<?php

namespace App\Http\Controllers\Twitter\Actions;

use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class DMController extends Controller
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
    public function DM(Request $request)
    {   try{
            $content = $request->input('content');
            $userId = $request->input('userId');
            
            $channelId = $request->input('channelId');

            if($channelId){
                $channel = $this->user->getChannel($channelId);
                $channel = $channel->details;
            }else{
                $channel = $this->selectedChannel;
            }
            
            if($content && $userId){
                $channel->DM($userId, $content);
                return response()->json(["success" => true, "message" => "DM posted successfully"]);
            }

            return response()->json(["success" => false, "message" => "No text or screen_name provided"], 400);
        }catch(\Exception $e){
            return response()->json(["success" => false, "message" => "You can not DM this user."], 400);
        }

        return response()->json(["success" => false, "message" => "Tweet cannot be empty"], 304);
    }


}