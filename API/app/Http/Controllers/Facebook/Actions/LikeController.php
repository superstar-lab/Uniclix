<?php

namespace App\Http\Controllers\Facebook\Actions;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Carbon\Carbon;

class LikeController extends Controller{

    private $user;

    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            $this->user = auth()->user();
            return $next($request);
        });
    }

    public function like(Request $request)
    {   
        try{
            $objectId = $request->input("objectId");
            $channelId = $request->input("channelId");

            if(!$objectId || !$channelId) return response()->json(["error" => "Channel or post id is missing."], 400);

            $channel = $this->user->getChannel($channelId);
            $channel = $channel->details;

            $channel->likePost($objectId);

            return response()->json(["success" => "Post like succeeded."], 200);
        }catch(\Exception $e){
            return response()->json(["error" => $e->getMessage()], 500);
        }

        return response()->json(["error" => "General error."], 500);
    }

    public function unlike(Request $request)
    {   
        try{
            $objectId = $request->input("objectId");
            $channelId = $request->input("channelId");

            if(!$objectId || !$channelId) return response()->json(["error" => "Channel or post id is missing."], 400);

            $channel = $this->user->getChannel($channelId);
            $channel = $channel->details;

            $channel->unlikePost($objectId);

            return response()->json(["success" => "Post unlike succeeded."], 200);
        }catch(\Exception $e){
            return response()->json(["error" => $e->getMessage()], 500);
        }

        return response()->json(["error" => "General error."], 500);
    }
}