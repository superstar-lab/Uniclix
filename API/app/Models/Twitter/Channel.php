<?php

namespace App\Models\Twitter;

use App\Traits\Selectable;
use App\Traits\Twitter\Tweetable;
use App\Models\Channel as GlobalChannel;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class Channel extends Model
{
    use Selectable, Tweetable;

    public $table = "twitter_channels";

    protected $fillable = [
        "user_id",
        "channel_id",
        "username",
        "payload",
        "access_token",
        "selected"
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function global()
    {
        return $this->belongsTo(GlobalChannel::class, "channel_id");
    }

    public function getTokens()
    {
        return json_decode($this->access_token);
    }

    public function accountTargets()
    {
        return $this->hasMany(AccountTarget::class);
    }

    public function accountTargetsFeed()
    {
        return $this->hasMany(AccountTargetFeed::class);
    }

    public function keywordTargets()
    {
        return $this->hasMany(KeywordTarget::class);
    }

    public function keywordTargetsFeed()
    {
        return $this->hasMany(KeywordTargetFeed::class);
    }

    public function followerIds()
    {
        return $this->hasMany(FollowerId::class);
    }

    public function followingIds()
    {
        return $this->hasMany(FollowingId::class);
    }

    public function tweets()
    {
        return $this->hasMany(Tweet::class);
    }

    public function retweets()
    {
        return $this->hasMany(Retweet::class);
    }

    public function likes()
    {
        return $this->hasMany(Like::class);
    }

    public function cursor()
    {
        return $this->hasOne(Cursor::class);
    }

    public function processes()
    {
        return $this->hasMany(Process::class);
    }

    public function startProcess($processName)
    {
        $this->processes()->create(["process_name" => $processName]);
    }

    public function stopProcess($processName)
    {
        $this->processes()->where("process_name", $processName)->delete();
    }

    public function statistics()
    {
        return $this->hasMany(Statistic::class);
    }

    public function updateStatistics($type, $count = 1)
    {
        $existingStatistics = $this->statistics()->where("created_at", "LIKE", "" . Carbon::today()->toDateString() . " %")->first();
        $lastDate = $existingStatistics ? $existingStatistics->created_at : Carbon::now();
        Statistic::updateOrCreate(["channel_id" => $this->id, "created_at" => $lastDate], [$type => \DB::raw("$type + $count")]);
    }

    public function getDailyStatisticsFor($type)
    {
        $existingStatistics = $this->statistics()->where("created_at", "LIKE", "" . Carbon::today()->toDateString() . "%")->first();
        $lastDate = $existingStatistics ? $existingStatistics->created_at : null;

        if ($statistics = $this->statistics()->where("created_at", $lastDate)->first()) {
            return $statistics->{$type};
        } else {
            return 0;
        }
    }

    public function getAnalytics($days=1)
    {
        $start_date = Carbon::now()->subDays($days);
        $end_date = Carbon::now();

        try {
            $key = $this->id . "-twitterAnalytics-$days";
            $minutes = 15;
            return Cache::remember($key, $minutes, function () use ($days, $start_date, $end_date) {
                $data = [];
                $startDate = Carbon::now();

                $followers = $this->followerIds()->whereNull('unfollowed_you_at')->whereBetween('created_at', [$startDate->subDays($days), Carbon::now()])->whereNotBetween('created_at', [$this->created_at , $this->created_at->addMinutes(5)])->get();
                $unfollowers = $this->followerIds()->whereNotNull('unfollowed_you_at')->whereBetween('unfollowed_you_at', [$startDate->subDays($days), Carbon::now()])->get();
                $likes = $this->likes()->whereBetween('original_created_at', [$startDate->subDays($days), Carbon::now()])->get();

                $tweets = $this->getTweets();

                $dataTweets = [];

                foreach ($tweets as $tweet) {
                    if (Carbon::parse($tweet->created_at) >= $start_date && Carbon::parse($tweet->created_at) <= $end_date) {
                        $dataTweets[] = $tweet;
                    }
                }

                $data = [
                    'followers' => $followers->count(),
                    'unfollowers' => $unfollowers->count(),
                    'tweets' => count($dataTweets),
                    'likes' => $likes->count(),
                    'profile' => $this->getData()
                ];

                return $data;
            });
        } catch (\Exception $e) {
            throw $e;
        }
    }

    public function pageInsightsByType($type, $startDate=null, $endDate=null, $period)
    {
        $sDate = $startDate != "undefined" ? intval($startDate/1000) : null;
        $eDate = $endDate != "undefined" ? intval($endDate/1000) : null;

        try {
            $key = $this->id . "-$type-$startDate-$endDate";
            $minutes = 15;
            $startDate = Carbon::now();

            return Cache::remember($key, $minutes, function () use ($sDate, $eDate, $type, $period) {
                $startDate = Carbon::now();

                $data = [];
                $startDate = Carbon::now();
                if (!isset($sDate) || $sDate == "undefined" || $sDate == null)
                    $data = $this->{$type}($sDate, $eDate, $period);
                else
                    $data = $this->getChartData($type, $sDate, $eDate, $period);

                return $data;

            });
        } catch (\Exception $e) {
            throw $e;
        }
    }

    public function tweetsCount($sDate, $eDate)
    {
        $data = $this->getData();

        return $data->statuses_count;
    }

    public function followersCount($sDate, $eDate)
    {
        $data = $this->getData();

        return $data->followers_count;
    }

    public function followingCount($sDate, $eDate)
    {
        $data = $this->getData();

        return $data->friends_count;
    }

    public function totalLikesCount($sDate, $eDate)
    {
        $data = $this->getData();

        return $data->favourites_count;
    }

    public function getChartData($type, $sDate, $eDate, $period)
    {
        $result = [];
        switch ($type)
        {
            case 'tweetsChartData':
                $result = $this->getChartDataByType("getTweets", $sDate, $eDate, $period);
                break;
            case 'followersChartData':
                $result = $this->getChartDataByType("getFollowers", $sDate, $eDate, $period);
                break;
            case 'engagementsChartData':
                $result[0] = $this->getChartDataByType("getLikes", $sDate, $eDate, $period);
                $result[1] = $this->getChartDataByType("getMentions", $sDate, $eDate, $period);
                $result[2] = $this->getChartDataByType("getRetweets", $sDate, $eDate, $period);
                break;
            case 'impressionsChartData':
                $result = $this->getChartDataByType("getHome", $sDate, $eDate, $period);
                break;
        }

        return $result;
    }

    public function getChartDataByType($type, $sDate, $eDate, $period)
    {
        $wholeData = [];
        $matchData = [];
        $maxId = 0;
        $groupedData = [];
        $result = [];

        while (true)
        {
            if ($maxId == 0)
                $data = $this->{$type}();
            else
                $data = $this->{$type}(["max_id" => $maxId]);

            if (count($data) <= 1)
                break;

            foreach($data as $item){
                $wholeData[] = $item;
            }

            $lastData = $data[count($data) - 1];
            $maxId = $lastData->{'id'};

            if ($sDate >= strtotime($lastData->{'created_at'}))
                break;
        }

        foreach($wholeData as $item)
        {
            if ($sDate <= strtotime($item->{'created_at'}) && $eDate >= strtotime($item->{"created_at"})) {
                $matchData[] = $item;
            }
        }

        switch ($period){
            case "year":
                $groupedData = collect($matchData)->groupBy(function($data) {
                    return Carbon::parse($data->created_at)->format('Y-m');
                });
                break;
            case "day":
                $groupedData = collect($matchData)->groupBy(function($data) {
                    return Carbon::parse($data->created_at)->format('Y-m-d-H');
                });
                break;
            default:
                $groupedData = collect($matchData)->groupBy(function($data) {
                    return Carbon::parse($data->created_at)->format('Y-m-d');
                });
                break;
        }

        foreach($groupedData as $date => $item)
        {
            $result[] = [Carbon::parse($date)->timestamp*1000, count($item)];
        }

        return $result;
    }

    public function tweetsTableData($sDate, $eDate)
    {
        $tweets = collect($this->getTweets());
        for($i = 0; $i < count($tweets); $i++){
            $replies = count($this->getStatusReplies($tweets[$i]->user->screen_name, $tweets[$i]->id_str));
            $tweets[$i]->replies = $replies;
            $tweets[$i]->date = Carbon::parse($tweets[$i]->created_at)->format('M d Y, H:i');
        }
        return $tweets;
    }

    public function likesCount($sDate, $eDate)
    {
        $data = $this->getLikes();

        return count($data);
    }

}
