<?php

namespace App\Models\Facebook;

use App\Traits\Selectable;
use App\Traits\Facebook\FacebookTrait;
use App\Models\Channel as GlobalChannel;
use App\Models\Facebook\Post as FacebookPost;
use App\Models\User;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Channel extends Model
{
    use Selectable, FacebookTrait;

    public $table = "facebook_channels";

    protected $fillable = [
        "user_id",
        "channel_id",
        "parent_id",
        "username",
        "name",
        "email",
        "payload",
        "access_token",
        "account_type",
        "selected",
        "original_id",
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function global()
    {
        return $this->belongsTo(GlobalChannel::class, "channel_id");
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

    public function posts()
    {
        return $this->hasMany(FacebookPost::class);
    }

    public function getAnalytics($days=1)
    {
        switch ($days) {
            case 1:
                $period = 'day';
                $since = Carbon::now()->subDays(1)->timestamp;
                $until = Carbon::now()->timestamp;
                break;
            case 7:
                $period = 'week';
                $since = Carbon::now()->subDays(7)->timestamp;
                $until = Carbon::now()->timestamp;
                break;
            case 30:
                $period = 'days_28';
                $since = Carbon::now()->subDays(28)->timestamp;
                $until = Carbon::now()->timestamp;
                break;

            default:
                $period = 'day';
                $since = Carbon::now()->subDays(1)->timestamp;
                $until = Carbon::now()->timestamp;
                break;
        }

        try {
            $key = $this->id . "-facebookAnalytics-$days";
            $minutes = 15;
            return Cache::remember($key, $minutes, function () use ($since, $until, $period) {
                $data = [];

                $likes = $this->pageNewLikes($period)['data'][0]['values'][1]['value'];
                $unlikes = $this->pageUnlikes($period)['data'][0]['values'][1]['value'];
                $engagement = $this->pageEngagement($period)['data'][0]['values'][1]['value'];
                $reactions = $this->pageTotalReactions($period);
                $posts = count($this->getPagePosts($since, $until)['data']);

                    $data = [
                    'likes' => $likes,
                    'unlikes' => $unlikes,
                    'engagement' => $engagement,
                    'reactions' => $reactions,
                    'posts' => $posts
                ];

                return $data;
            });
        } catch (\Exception $e) {
            throw $e;
        }
    }

    public function pageInsights($startDate, $endDate)
    {
        $period = 'month';

        $sDate = intval($startDate/1000);
        $eDate = intval($endDate/1000);

        return $this->pageLikes('day', $sDate, $eDate);

        try {
            $key = $this->id . "-pageInsights-$startDate-$endDate";
            $minutes = 15;
            $startDate = Carbon::now();

            return Cache::remember($key, $minutes, function () use ($period, $sDate, $eDate) {
                $data = [];

                $fans = collect($this->pageLikes('day', $sDate, $eDate)['data'][0]['values'])->last()['value'];
                $posts = $this->getPosts($sDate, $eDate)['data'];
                $postsChartData = $this->postsChartData($sDate, $eDate);
                $fansChartData = $this->fansChartData($sDate, $eDate);
                $postsData = $this->postsData($sDate, $eDate);
                $reactions = $postsData->sum('reactions');
                $comments = $postsData->sum('comments');
                $shares = $postsData->sum('shares');
                $engagementByTypeData = $this->engagementByTypeData($sDate, $eDate);

                $data = [
                    'posts' => count($posts),
                    'fans' => $fans,
                    'postsChartData' => $postsChartData,
                    'fansChartData' => $fansChartData,
                    'postsData' => $postsData,
                    'reactions' => $reactions,
                    'comments' => $comments,
                    'shares' => $shares,
                    'engagement' => $reactions + $comments + $shares,
                    'engagementByTypeData' => $engagementByTypeData
                ];

                return $data;
            });
        } catch (\Exception $e) {
            throw $e;
        }
    }
    public function pageInsightsByType($type, $startDate, $endDate)
    {
        $sDate = intval($startDate/1000);
        $eDate = intval($endDate/1000);

        try {
            $key = $this->id . "-$type-$startDate-$endDate";

            $data = $this->{$type}($sDate, $eDate);

            return $data;

        } catch (\Exception $e) {
            throw $e;
        }
    }

    private function postsCount($sDate, $eDate)
    {
        try {
            $maxId = null;
            $posts = [];
            do {
                $data = $this->getPagePosts($sDate, $eDate, ['max_id' => $maxId]);
                $posts = array_merge($posts, $data['data']);
                if (isset($data['paging']['next'])) {
                    $maxId = $data['paging']['cursors']['after'];
                } else {
                    $maxId = null;
                }
            } while ($maxId);

            return count($posts);

        } catch (\Exception $e) {
            throw $e;
        }
    }

    private function fansCount($sDate, $eDate)
    {
        try {
            $key = $this->id . "-fansCount-$sDate-$eDate";
            $minutes = 15;

            return Cache::remember($key, $minutes, function () use ($sDate, $eDate) {

                $pageLikes = $this->pageLikes('day', $sDate, $eDate);
                if(!isset($pageLikes['data']) || count($pageLikes['data']) < 1) return 0;
                $fans = collect($pageLikes['data'][0]['values'])->last()['value'];

                return $fans;

            });
        } catch (\Exception $e) {
            throw $e;
        }
    }

    private function engagementsCount($sDate, $eDate)
    {
        try {
            $key = $this->id . "-engagementsCount-$sDate-$eDate";
            $minutes = 15;

            return Cache::remember($key, $minutes, function () use ($sDate, $eDate) {

                $postsData = $this->postsData($sDate, $eDate);

                $reactions = $postsData->sum('reactions');
                $comments = $postsData->sum('comments');
                $shares = $postsData->sum('shares');

                return $reactions+$comments+$shares;

            });
        } catch (\Exception $e) {
            throw $e;
        }
    }

    private function impressionsCount($sDate, $eDate)
    {
        try {
            $key = $this->id . "-impressionsCount-$sDate-$eDate";
            $minutes = 15;

            return Cache::remember($key, $minutes, function () use ($sDate, $eDate) {

                $first_date = Carbon::createFromTimestamp($sDate);
                $second_date = Carbon::createFromTimestamp($eDate);

                $diff = $second_date->diffInDays($first_date);

                $total=0;

                while($diff>90){

                    $until = $second_date->copy();

                    $since = $until->copy()->subDays(90);


                    $impresions = $this->pageImpressions($since->timestamp, $until->timestamp);
                    $data = $impresions['data'][0]['values'];

                    foreach ($data as $item) {
                        $total += $item['value'];
                    }

                    $second_date = $since;

                    $diff = $since->diffInDays($first_date);
                }

                $impresions = $this->pageImpressions($second_date->subDays($diff), $second_date);
                $data = $impresions['data'][0]['values'];

                foreach ($data as $item) {
                    $total += $item['value'];
                }


                return $this->number_format_short($total);

            });
        } catch (\Exception $e) {
            throw $e;
        }
    }

    private function engagementsByType($sDate, $eDate)
    {
        try {
            $key = $this->id . "-engagementsByType-$sDate-$eDate";
            $minutes = 15;

            return Cache::remember($key, $minutes, function () use ($sDate, $eDate) {

                $postsData = $this->postsData($sDate, $eDate);

                $reactions = $postsData->sum('reactions');
                $comments = $postsData->sum('comments');
                $shares = $postsData->sum('shares');

                $data = [
                    'reactions' => $reactions,
                    'comments' => $comments,
                    'shares' => $shares
                ];

                return $data;

            });
        } catch (\Exception $e) {
            throw $e;
        }
    }
    /**
     *
     * Prepare data for Posts Chart
     */
    private function postsChartData($sDate, $eDate)
    {
        try {
            $key = $this->id . "-postsChartData-$sDate-$eDate";
            $minutes = 15;

            return Cache::remember($key, $minutes, function () use ($sDate, $eDate) {

                $maxId = null;
                $posts = [];
                do {
                    $data = $this->getPagePosts($sDate, $eDate, ['max_id' => $maxId]);
                    $posts = array_merge($posts, $data['data']);
                    if (isset($data['paging']['next'])) {
                        $maxId = $data['paging']['cursors']['after'];
                    } else {
                        $maxId = null;
                    }
                } while ($maxId);

                $grouped_posts = collect($posts)->sortBy('created_time')->groupBy(function($post) {
                    return Carbon::parse($post['created_time'])->format('Y-m-d');
                });

                $data = [];

                foreach($grouped_posts as $key=>$value)
                {
                    $data[] = [Carbon::parse($key)->timestamp*1000, count($value)];
                }

                return $data;

            });
        } catch (\Exception $e) {
            throw $e;
        }

    }

    /**
     * Prepare data for Fans Chart
     */
    public function fansChartData($sDate, $eDate)
    {
        try {
            $key = $this->id . "-postsChartData-$sDate-$eDate";
            $minutes = 15;

            return Cache::remember($key, $minutes, function () use ($sDate, $eDate) {

                $data = [];

                $fans = $this->pageLikes('day', $sDate, $eDate);
                if(!isset($fans['data']) || count($fans['data']) < 1) return 0;

                $values = $fans['data'][0]['values'];

                foreach($values as $value)
                {

                    $data[] = [Carbon::parse($value['end_time'])->timestamp*1000, $value['value']];
                }

                return $data;

            });
        } catch (\Exception $e) {
            throw $e;
        }
    }

    /**
     * Prepare data for Posts Table
     */
    public function postsData($sDate, $eDate)
    {
        try {
            $key = $this->id . "-postsData-$sDate-$eDate";
            $minutes = 15;

            return Cache::remember($key, $minutes, function () use ($sDate, $eDate) {

                $maxId = null;
                $posts = [];
                do {
                    $data = $this->getPagePosts($sDate, $eDate, ['max_id' => $maxId]);
                    $posts = array_merge($posts, $data['data']);
                    if (isset($data['paging']['next'])) {
                        $maxId = $data['paging']['cursors']['after'];
                    } else {
                        $maxId = null;
                    }
                } while ($maxId);

                $preparePosts = collect();

                foreach($posts as $post)
                {
                    $message = array_key_exists('message', $post) ? $post['message'] : $post['attachments']['data'][0]['title'];
                    $post = collect($post);
                    $post->put('date', Carbon::parse($post['created_time'])->format('M d, H:i'));
                    $post->put('reactions', $post['reactions']['summary']['total_count']);
                    $post->put('comments', $post['comments']['summary']['total_count']);
                    $post->put('shares', 0);
                    $post->put('timestamp', Carbon::parse($post['created_time'])->timestamp);
                    $post->put('message', $message);

                    $preparePosts->push($post);
                }

                return $preparePosts;

            });
        } catch (\Exception $e) {
            throw $e;
        }
    }

    /**
     * Prepare data for Posts Table
     */
    public function engagementByTypeData($startDate, $endDate)
    {
        $posts = $this->getPosts($startDate, $endDate)['data'];

        $dataReactions = collect();
        $dataComments = collect();
        $dataShares = collect();

        $dataReactions->put('name', 'Reactions');
        $dataComments->put('name', 'Comments');
        $dataShares->put('name', 'Shares');

        $grouped_posts = collect($posts)->groupBy('created_time');

        $reactions = [];
        $comments = [];
        $shares = [];

        foreach($grouped_posts as $key=>$grouped)
        {
            $reaction=0;
            $comment=0;
            $share=0;
            foreach($grouped as $post)
            {
                $reaction = $reaction+$post['reactions']['summary']['total_count'];
                $comment = $comment+$post['comments']['summary']['total_count'];
                $share = 0;
            }
            $reactions[] = [Carbon::parse($key)->timestamp*1000, $reaction];
            $comments[] = [Carbon::parse($key)->timestamp*1000, $comment];
            $shares[] = [Carbon::parse($key)->timestamp*1000, $share];
        }

        $dataReactions->put('data', $reactions);
        $dataComments->put('data', $comments);
        $dataShares->put('data', $shares);

        $dataArray=[];

        $dataArray[] = $dataReactions;
        $dataArray[] = $dataComments;
        $dataArray[] = $dataShares;

        return $dataArray;

    }

    private function number_format_short($n)
    {
        if ($n >= 0 && $n < 1000) {
            // 1 - 999
            $n_format = floor($n);
            $suffix = '';
        } else if ($n >= 1000 && $n < 1000000) {
            // 1k-999k
            $n_format = floor($n / 1000);
            $suffix = 'K+';
        } else if ($n >= 1000000 && $n < 1000000000) {
            // 1m-999m
            $n_format = floor($n / 1000000);
            $suffix = 'M+';
        } else if ($n >= 1000000000 && $n < 1000000000000) {
            // 1b-999b
            $n_format = floor($n / 1000000000);
            $suffix = 'B+';
        } else if ($n >= 1000000000000) {
            // 1t+
            $n_format = floor($n / 1000000000000);
            $suffix = 'T+';
        }

        return !empty($n_format . $suffix) ? $n_format . $suffix : 0;
    }
}
