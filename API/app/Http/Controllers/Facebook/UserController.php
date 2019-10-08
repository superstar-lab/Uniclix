<?php

namespace App\Http\Controllers\Facebook;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class UserController extends Controller
{

    private $user;

    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            $this->user = auth()->user();
            return $next($request);
        });
    }

    public function info(Request $request)
    {
        $channelId = $request->input("channelId");
        $id = $request->input("id");
        $simple = $request->input("simple");

        if(!$channelId || !$id) return response()->json(["error" => "Required fields missing."], 400);

        $channel = $this->user->getChannel($channelId);

        if(!$channel) return response()->json(["error" => "Channel not found."], 404);

        $channel = $channel->details;
        $info = $simple ? $channel->getSimpleInfoById($id) : $channel->getInfoById($id);

        if(empty($info)) return response()->json(["error" => "No info found for $id"], 404);

        return response()->json($info);
    }
}
