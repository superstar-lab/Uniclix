<?php

namespace App\Models\Linkedin;

use App\Traits\Selectable;
use App\Traits\Linkedin\LinkedinTrait;
use App\Models\Channel as GlobalChannel;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;
use Carbon\Carbon;

class Channel extends Model
{
    use Selectable, LinkedinTrait;

    public $table = "linkedin_channels";

    protected $fillable = [
        "user_id",
        "channel_id",
        "original_id",
        "parent_id",
        "username",
        "name",
        "email",
        "payload",
        "access_token",
        "account_type",
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

    public function pageInsightsByType($type, $startDate, $endDate)
    {
        $sDate = intval($startDate);
        $eDate = intval($endDate);

        try {
            $key = $this->id . "-$type-$startDate-$endDate";
            $minutes = 15;
            $startDate = Carbon::now();

            return Cache::remember($key, $minutes, function () use ($sDate, $eDate, $type) {

                $data = $this->{$type}($sDate, $eDate);

                return $data;

            });
        } catch (\Exception $e) {
            throw $e;
        }
    }

    private function postsCount($sDate, $eDate)
    {
        try {
            $key = $this->id . "-postsCount-$sDate-$eDate";
            $minutes = 15;

            return Cache::remember($key, $minutes, function () use ($sDate, $eDate) {

                $preparePosts = [];

                $posts = collect($this->getPosts());

                foreach($posts as $post) {
                    if($post->created->time >= $sDate && $post->created->time <= $eDate) {
                        $preparePosts[] = $post;
                    }
                }

                return count($preparePosts);

            });
        } catch (\Exception $e) {
            return response()->json(['error'=>$e->getMessage()], 400);
        }
    }

    private function followersCount($sDate, $eDate)
    {
        try {
            $key = $this->id . "-followersCount-$sDate-$eDate";
            $minutes = 15;

            return Cache::remember($key, $minutes, function () use ($sDate, $eDate) {

                $followers = $this->followerStatistics($sDate, $eDate);

                $total_followers = 0;

                if (is_object($followers) && property_exists($followers, 'elements')) {
                    foreach ($followers->elements as $element) {
                        $total_followers += $element->followerGains->paidFollowerGain + $element->followerGains->organicFollowerGain;
                    }
                }

                return $total_followers;

            });
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    private function engagementsCount($sDate, $eDate)
    {
        try {
            $key = $this->id . "-engagementsCount-$sDate-$eDate";
            $minutes = 15;

            return Cache::remember($key, $minutes, function () use ($sDate, $eDate) {

                $engagement = $this->shareStatistics($sDate, $eDate);

                $likes = 0;
                $comments = 0;
                $shares = 0;

                if (is_object($engagement) && property_exists($engagement, 'elements')) {
                    foreach ($engagement->elements as $element) {
                        $likes += $likes + $element->totalShareStatistics->likeCount;
                        $comments += $comments + $element->totalShareStatistics->commentCount;
                        $shares += $shares + $element->totalShareStatistics->shareCount;
                    }
                }

                return $likes+$comments+$shares;

            });
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    private function clickCount($sDate, $eDate)
    {
        try {
            $key = $this->id . "-clickCount-$sDate-$eDate";
            $minutes = 15;

            return Cache::remember($key, $minutes, function () use ($sDate, $eDate) {

                $statistics = $this->shareStatistics($sDate, $eDate);

                if (is_object($statistics) && property_exists($statistics, 'elements')) return $statistics->elements[0]->totalShareStatistics->clickCount;

                return [];
            });
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    private function postsChartData($sDate, $eDate)
    {
        try {
            $key = $this->id . "-postsChartData-$sDate-$eDate";
            $minutes = 15;

            return Cache::remember($key, $minutes, function () use ($sDate, $eDate) {

                $posts = collect($this->getPosts($sDate, $eDate));

                $grouped_posts = $posts->sortBy(function($post){return Carbon::createFromTimestampMs($post->created->time)->format('Y m d');})->groupBy(function ($post) {
                    return Carbon::createFromTimestampMs($post->created->time)->format('Y m d');
                });

                $data = [];

                foreach ($grouped_posts as $key => $value) {
                    $date = Carbon::createFromFormat("Y m d", $key)->timestamp * 1000;
                    if ($date >= $sDate && $date <= $eDate) {
                        $data[] = [$date, count($value)];
                    }
                }

                return $data;
            });
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    private function followersChartData($sDate, $eDate)
    {
        try {
            $key = $this->id . "-followersChartData-$sDate-$eDate";
            $minutes = 15;

            return Cache::remember($key, $minutes, function () use ($sDate, $eDate) {


                $followers = $this->followerStatistics($sDate, $eDate);

                $data=[];

                if (is_object($followers) && property_exists($followers, 'elements'))
                {
                    foreach($followers->elements as $element)
                    {
                        $data[] = [$element->timeRange->start, $element->followerGains->paidFollowerGain + $element->followerGains->organicFollowerGain];
                    }
                }

                return $data;
            });
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    private function postsData($sDate, $eDate)
    {
        try {
            $key = $this->id . "-postsData-$sDate-$eDate";
            $minutes = 15;

            return Cache::remember($key, $minutes, function () use ($sDate, $eDate) {

                $posts = $this->getPosts();

                $preparePosts = collect();

                foreach ($posts as $post) {
                    if ($post->created->time >= $sDate && $post->created->time <= $eDate) {
                        $shareContent = "com.linkedin.ugc.ShareContent";
                        $newPost = collect();
                        $postSocialActions = $this->socialActions($post->id);
                        $newPost->put('date', Carbon::createFromTimestampMs($post->created->time)->format('M d, H:i'));
                        $newPost->put('message', $post->specificContent->$shareContent->shareCommentary->text);
                        $newPost->put('comments', $postSocialActions->commentsSummary->totalFirstLevelComments);
                        $newPost->put('likes', $postSocialActions->likesSummary->totalLikes);
                        $newPost->put('shares', 0);
                        $preparePosts->push($newPost);
                    }
                }

                return $preparePosts;
            });
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    private function engagementsChartData($sDate, $eDate)
    {
        try {
            $key = $this->id . "-engagementsChartData-$sDate-$eDate";
            $minutes = 15;

            return Cache::remember($key, $minutes, function () use ($sDate, $eDate) {

                $engagement = $this->shareStatistics($sDate, $eDate);

                $dataLikes = collect();
                $dataComments = collect();
                $dataShares = collect();

                $dataLikes->put('name', 'Likes');
                $dataComments->put('name', 'Comments');
                $dataShares->put('name', 'Shares');

                $likes = [];
                $comments = [];
                $shares = [];

                if (is_object($engagement) && property_exists($engagement, 'elements')) {
                    foreach ($engagement->elements as $element) {
                        $likes[] = [$element->timeRange->start, $element->totalShareStatistics->likeCount];
                        $comments[] = [$element->timeRange->start, $element->totalShareStatistics->commentCount];
                        $shares[] = [$element->timeRange->start, $element->totalShareStatistics->shareCount];
                    }
                }

                $dataLikes->put('data', $likes);
                $dataComments->put('data', $comments);
                $dataShares->put('data', $shares);

                $dataArray = [];

                $dataArray[] = $dataLikes;
                $dataArray[] = $dataComments;
                $dataArray[] = $dataShares;

                return $dataArray;
            });
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    private function engagementTotalData($sDate, $eDate)
    {
        try {
            $key = $this->id . "-engagementTotalData-$sDate-$eDate";
            $minutes = 15;

            return Cache::remember($key, $minutes, function () use ($sDate, $eDate) {

                $engagement = $this->shareStatistics($sDate, $eDate);

                $engagementData = collect();

                $likes = 0;
                $comments = 0;
                $shares = 0;

                if (is_object($engagement) && property_exists($engagement, 'elements'))
                {
                    foreach($engagement->elements as $element) {
                        $likes += $likes+$element->totalShareStatistics->likeCount;
                        $comments += $comments + $element->totalShareStatistics->commentCount;
                        $shares += $shares + $element->totalShareStatistics->shareCount;
                    }
                }

                $engagementData->put('likes', $likes);
                $engagementData->put('comments', $comments);
                $engagementData->put('shares', $shares);

                return $engagementData;

            });
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
}
