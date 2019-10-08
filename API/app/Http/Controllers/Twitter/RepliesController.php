<?php

namespace App\Http\Controllers\Twitter;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class RepliesController extends Controller
{
    private $user;
    private $selectedChannel;

    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            $this->user = auth()->user();
            $this->selectedChannel = $this->user->selectedTwitterChannel();
            return $next($request);
        });
    }

    public function replies(Request $request)
    {
        $channelId = $request->input("channelId");
        $username = $request->input("username");
        $tweetId = $request->input("tweetId");

        if(!$channelId || !$username || !$tweetId) return response()->json(["error" => "Required fields missing."], 400);

        $channel = $this->user->channels()->find($channelId);

        if(!$channel) return response()->json(["error" => "Channel not found."], 404);

        $channel = $channel->details;
        $replies = $channel->getStatusReplies($username, $tweetId);

        if(empty($replies)) return response()->json(["error" => "No info found for $username"], 404);

        return response()->json($replies);
    }
}