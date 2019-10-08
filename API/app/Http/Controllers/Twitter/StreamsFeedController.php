<?php

namespace App\Http\Controllers\Twitter;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Carbon\Carbon;

class StreamsFeedController extends Controller{

    private $user;

    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            $this->user = auth()->user();
            return $next($request);
        });
    }

    public function index($type, Request $request){

        try{
            $channelId = $request->get("channelId");
            $params = $request->get("query") ? ["q" => $request->get("query")] : [];

            if($request->get("nextPage")) $params["max_id"] = $request->get("nextPage");

            if(!$channelId) return;

            $channel = $this->user->getChannel($channelId);

            $global = $channel;

            if(!$channel) return;

            $channel = $channel->details;

            $func = "get".ucfirst($type);

            $feed = $channel->{$func}($params);

            if(!$feed) return;
        }catch(\Exception $e){
            return getErrorResponse($e, $global);
        }


        return response()->json($feed, 200);
    }


    public function scheduled(Request $request){
        
        $channelId = $request->get("channelId");
        $params = $request->get("query") ? ["q" => $request->get("query")] : [];

        if(!$channelId) return;

        $channel = $this->user->getChannel($channelId);

        if(!$channel) return;

        $posts = $channel->scheduledPosts()->get();

        if(!$posts) return;

        foreach($posts as $post){
            $post->payload = unserialize($post->payload);
        }

        return response()->json($posts, 200);
    }
}