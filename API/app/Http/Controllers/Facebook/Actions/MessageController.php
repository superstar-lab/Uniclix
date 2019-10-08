<?php

namespace App\Http\Controllers\Facebook\Actions;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Carbon\Carbon;

class MessageController extends Controller{

    private $user;

    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            $this->user = auth()->user();
            return $next($request);
        });
    }

    public function send(Request $request)
    {   
        try{
            $conversationId = $request->input("conversationId");
            $channelId = $request->input("channelId");
            $text = $request->input("message");

            if(!$channelId || !$text || !$conversationId) return response()->json(["error" => "Required parameters are missing."], 400);

            $channel = $this->user->getChannel($channelId);
            $channel = $channel->details;
            $message = [
                "message" => $text
            ];

            $channel->sendMessage($conversationId, $message);

            return response()->json(["success" => "Post succeeded.", "conversation" => $channel->getMessages($conversationId)], 200);
        }catch(\Exception $e){
            return response()->json(["error" => $e->getMessage()], 400);
        }

        return response()->json(["error" => "General error."], 500);
    }
}