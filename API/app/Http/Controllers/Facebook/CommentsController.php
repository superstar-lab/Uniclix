<?php

namespace App\Http\Controllers\Facebook;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class CommentsController extends Controller{

    private $user;

    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            $this->user = auth()->user();
            return $next($request);
        });
    }

    public function get(Request $request)
    {   
        $objectId = $request->input('objectId');
        $channelId = $request->input('channelId');

        if(!$objectId || !$channelId) return response()->json(["error" => "Fields are missing"], 400);

        $channel = $this->user->channels()->find($channelId);

        $comments = $channel->details->getComments($objectId);

        return response()->json($comments);
    }
}