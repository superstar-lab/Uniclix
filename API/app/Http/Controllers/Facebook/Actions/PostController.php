<?php

namespace App\Http\Controllers\Facebook\Actions;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Carbon\Carbon;

class PostController extends Controller{

    private $user;

    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            $this->user = auth()->user();
            return $next($request);
        });
    }

    public function post(Request $request)
    {   
        try{
            $objectId = $request->input("objectId");
            $channelId = $request->input("channelId");
            $message = $request->input("message");

            if(!$channelId) return response()->json(["error" => "Channel is missing."], 400);

            $channel = $this->user->getChannel($channelId);
            $channel = $channel->details;
            $post = [
                "message" => $message
            ];

            if($objectId) {
                $post["link"] = "https://www.facebook.com/{$objectId}";
            }

            $channel->publish($post);

            return response()->json(["success" => "Post succeeded."], 200);
        }catch(\Exception $e){
            return response()->json(["error" => $e->getMessage()], 400);
        }

        return response()->json(["error" => "General error."], 500);
    }

    public function delete(Request $request)
    {   
        try{
            $postId = $request->input("postId");
            $channelId = $request->input("channelId");

            if(!$channelId) return response()->json(["error" => "Channel is missing."], 400);

            $channel = $this->user->channels()->find($channelId);
            $channel = $channel->details;

            $channel->deletePost($postId);

            return response()->json(["success" => "Post deleted successfully."], 200);
        }catch(\Exception $e){
            return response()->json(["error" => $e->getMessage()], 400);
        }

        return response()->json(["error" => "General error."], 500);
    }
}