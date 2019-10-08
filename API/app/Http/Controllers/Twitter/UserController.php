<?php

namespace App\Http\Controllers\Twitter;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class UserController extends Controller
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

    public function info(Request $request)
    {
        $channelId = $request->input("channelId");
        $username = $request->input("username");

        if(!$channelId || !$username) return response()->json(["error" => "Required fields missing."], 400);

        $channel = $this->user->channels()->find($channelId);

        if(!$channel) return response()->json(["error" => "Channel not found."], 404);

        $channel = $channel->details;
        $user = $channel->getUserInfo($username);

        if(empty($user)) return response()->json(["error" => "No info found for $username"], 404);

        return response()->json($user[0]);
    }
}