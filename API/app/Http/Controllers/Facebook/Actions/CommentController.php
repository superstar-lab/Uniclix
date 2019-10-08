<?php

namespace App\Http\Controllers\Facebook\Actions;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Carbon\Carbon;

class CommentController extends Controller{

    private $user;

    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            $this->user = auth()->user();
            return $next($request);
        });
    }

    public function comment(Request $request)
    {   
        try{
            $objectId = $request->input("objectId");
            $channelId = $request->input("channelId");
            $image = $request->input("image");
            $message = $request->input("message");

            if(!$objectId || !$channelId || !$message) return response()->json(["error" => "Channel or post id is missing."], 400);

            $channel = $this->user->getChannel($channelId);
            $channel = $channel->details;

            $uploadedImage = false;
            if($image){
                $uploadedImage = $channel->uploadFile($image);
            }

            $comment = [
                "message" => $message
            ];

            if($uploadedImage){
                $comment["attachment_id"] = $uploadedImage["id"];
            }

            $channel->postComment($objectId, $comment);

            return response()->json(["success" => "Post commented succeeded."], 200);
        }catch(\Exception $e){
            return response()->json(["error" => $e->getMessage()], 500);
        }

        return response()->json(["error" => "General error."], 500);
    }
}