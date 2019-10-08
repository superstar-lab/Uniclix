<?php

namespace App\Http\Controllers\Twitter\Actions;

use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class StatusController extends Controller
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
            $this->selectedChannel = $this->user->selectedTwitterChannel();
            return $next($request);
        });
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function tweet(Request $request)
    {   try{
            $content = $request->input('tweet');
            $images = $request->input('images');
            $reply = $request->input('statusId');

            
            $channelId = $request->input('channelId');
            $channel = $this->selectedChannel;

            if($channelId){
                $channel = $this->user->getChannel($channelId);
                $channel = $channel->details;
            }

            $mediaIds = [];
            foreach($images as $image){
                $imageData = explode(',', $image);
                $imageBase64 = $imageData[1];
                $imageInfo = explode(';', $imageData[0]);
                $imageOriginalName = explode('.',$imageInfo[1]);
                $imageExtension = $imageOriginalName[1];
                $contents = base64_decode($imageBase64);

                $imageName = str_random(35).'.'.$imageExtension;

                $uploadResponse = $channel->uploadMedia(["media" => $contents]);
                $mediaIds[] = $uploadResponse->media_id;
            }

            
            $tweet = ["status" => $content, 'in_reply_to_status_id' => $reply, 'media_ids' => $mediaIds];
            
            if($tweet){
                $channel->publish($tweet);
                return response()->json(["success" => true, "message" => "Tweet posted successfully"]);
            }
        }catch(\Exception $e){
            return response()->json(["success" => false, "message" => $e->getMessage()], 500);
        }

        return response()->json(["success" => false, "message" => "Tweet cannot be empty"], 304);
    }

        /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function delete(Request $request)
    {   try{
            $statusId = $request->input('statusId');

            if(!$statusId) return response()->json(["error" => false, "message" => "Status id not specified"], 400);
            $channelId = $request->input('channelId');
            $channel = $this->selectedChannel;

            if($channelId){
                $channel = $this->user->channels()->find($channelId);
                $channel = $channel->details;
            }
            
            $channel->deleteTweet($statusId);
            return response()->json(["success" => true, "message" => "Tweet posted successfully"]);
        }catch(\Exception $e){
            return response()->json(["success" => false, "message" => $e->getMessage()], 500);
        }

        return response()->json(["success" => false, "message" => "Tweet cannot be empty"], 304);
    }

}