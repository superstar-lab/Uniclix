<?php

namespace App\Models\Twitter;

use App\Traits\Selectable;
use App\Traits\Twitter\Tweetable;
use App\Models\Channel as GlobalChannel;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

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

    public function pageInsightsByType($type, $startDate=null, $endDate=null)
    {
        $sDate = is_integer($startDate) ? intval($startDate/1000) : null;
        $eDate = is_integer($endDate) ? intval($endDate/1000) : null;

        try {
            $key = $this->id . "-$type-$startDate-$endDate";
            $minutes = 15;
            $startDate = Carbon::now();

            return Cache::remember($key, $minutes, function () use ($sDate, $eDate, $type) {
                $startDate = Carbon::now();

                $data = [];
                $startDate = Carbon::now();

                $data = $this->{$type}($sDate, $eDate);

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

    public function tweetsChartData($sDate, $eDate)
    {
        $tweets = $this->getTweets();

        $groupedTweets = collect($tweets)->groupBy(function($tweets) {
            return Carbon::parse($tweets->created_at)->format('Y-m-d');
        });

        $data = [];

        foreach($groupedTweets as $date => $tweets)
        {
            $data[] = [Carbon::parse($date)->timestamp*1000, count($tweets)];
        }

        return $data;
    }

    public function followersChartData($sDate, $eDate)
    {
        $followers = $this->getFollowers();

        $groupedFollowers = collect($followers)->groupBy(function($followers) {
            return Carbon::parse($followers->created_at)->format('Y-m-d');
        })->sortKeysDesc();

        $data = [];

        foreach($groupedFollowers as $date => $followers)
        {
            $data[] = [Carbon::parse($date)->timestamp*1000, count($followers)];
        }

        return $data;
    }

    public function tweetsTableData($sDate, $eDate)
    {
        $tweets = collect($this->getTweets());

        foreach($tweets as $tweet)
        {
            $tweet->date = Carbon::parse($tweet->created_at)->format('M d Y, H:i');
        }

        return $tweets;
    }

    public function likesCount($sDate, $eDate)
    {
        $data = $this->getLikes();

        return count($data);
    }

}
