<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;

class ScheduledController extends Controller
{
    private $user;
    private $selectedChannel;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            $this->user = auth()->user();
            $user_id = $this->user->id;
            if (!$this->user->hasPermission("scheduling", $user_id)) return response()->json(["error" => "You need to upgrade to unlock this feature."], 403);
            $this->selectedChannel = $this->user->selectedChannel();
            return $next($request);
        });
    }

    public function unapprovedPosts(Request $request)
    {
        $posts = $this->selectedChannel->scheduledPosts()
            ->with('category')
            ->where("posted", 0)
            ->where("approved", 0)
            ->orderBy('scheduled_at', 'asc')
            ->paginate(20);

        foreach ($posts as $post) {
            $post->payload = unserialize($post->payload);
        }

        $posts = $posts->groupBy('post_id');
        $new_posts = array();
        $new_item = array();
        $new_item_else = array();
        $channel_ids = array();
        foreach ($posts as $post) {
            if(count($post) > 1) {
                foreach ($post as $item) {
                    array_push($channel_ids, $item->channel_id);
                }
                unset($post[0]->channel_id);
                $post[0]->channel_ids = $channel_ids;
                array_push($new_item, (object)$post[0]);
                array_push($new_posts, (object)$new_item[0]);
                
            } else {
                array_push($channel_ids, $post[0]->channel_id);
                $post[0]->channel_ids = $channel_ids;
                unset($post[0]->channel_id);
                array_push($new_item_else, (object)$post[0]);
                array_push($new_posts, (object)$new_item_else[0]);
            }
            $new_item_else = [];
            $channel_ids = [];
            $new_item = [];
        }

        return response()->json(["items" => $new_posts]);
    }

    public function scheduledPosts(Request $request)
    {
        $from_date = $request->input('from_date');
        $to_date = $request->input('to_date');
        $posts = $this->user->getAllScheduledPosts($from_date, $to_date);

        if ($from_date != 'null' && $to_date != 'null') {
            $posts = $this->user->getAllScheduledPosts($from_date, $to_date);
        } else {
            $posts = $this->user->getAllScheduledPosts();
        }

        foreach ($posts as $post) {
            $post->payload = unserialize($post->payload);
            $images = $post->payload['images'];
            $scheduled = $post->payload['scheduled'];            
            $new_images = array();
            $new_payload = array();
            if(!empty($images)){
                foreach ($images as $image) {
                    array_push( $new_images, $image['absolutePath']);
                }           
            } else {
                //$new_images = null;
            }
            
            $new_payload =  [ "images" => $new_images, "scheduled" => $scheduled ];
            $post->payload = $new_payload;
        }
        
        $posts = $posts->groupBy('post_id');
        $new_posts = array();
        $new_item = array();
        $new_item_else = array();
        $channel_ids = array();
        foreach ($posts as $post) {
            if(count($post) > 1) {
                foreach ($post as $item) {
                    array_push($channel_ids, $item->channel_id);
                }
                unset($post[0]->channel_id);
                $post[0]->channel_ids = $channel_ids;
                array_push($new_item, (object)$post[0]);
                array_push($new_posts, (object)$new_item[0]);
                
            } else {
                array_push($channel_ids, $post[0]->channel_id);
                $post[0]->channel_ids = $channel_ids;
                unset($post[0]->channel_id);
                array_push($new_item_else, (object)$post[0]);
                array_push($new_posts, (object)$new_item_else[0]);
            }
            $new_item_else = [];
            $channel_ids = [];
            $new_item = [];
        }
        return response()->json(["items" => $new_posts]);
    }

    public function pastScheduled(Request $request)
    {
        $posts = $this->selectedChannel->scheduledPosts()
            ->where("posted", 1)
            ->orderBy('scheduled_at', 'desc')
            ->paginate(20);

        foreach ($posts as $post) {
            $post->payload = unserialize($post->payload);
        }

        $posts = $posts->groupBy(function ($date) {
            return Carbon::parse($date->scheduled_at_original)->format('Y-m-d');
        });

        return response()->json(["items" => $posts->values()]);
    }
}
