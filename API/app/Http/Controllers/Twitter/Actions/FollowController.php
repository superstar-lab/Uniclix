<?php

namespace App\Http\Controllers\Twitter\Actions;

use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class FollowController extends Controller
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
    public function follow($userId)
    {

        try{
            if($userId){

                if($this->user->getLimit("twitter_daily_follows") > $this->selectedChannel->getDailyStatisticsFor("follows")){

                    $twitterUser = $this->selectedChannel->followByName($userId);

                    $this->selectedChannel->followingIds()
                        ->updateOrCreate(
                            [
                                "channel_id" => $this->selectedChannel->id,
                                "user_id" => $twitterUser->id
                            ],
                            [
                                "unfollowed_at" => null,
                                "created_at" => Carbon::now(),
                                "updated_at" => Carbon::now()
                            ]);

                    $this->selectedChannel->updateStatistics("follows");
                    $follows = $this->selectedChannel->getDailyStatisticsFor("follows");

                    return response()->json(["success" => true, "message" => "You followed $twitterUser->screen_name.", "dailyActions" => $follows], 200);
                }

                return response()->json(["success" => false, "message" => "You exceeded the daily limit."], 403);
            }
        }catch(\Exception $e){
            return response()->json(["success" => false, "message" => $e->getMessage()], 500);
        }

        return response()->json(["success" => false, "message" => "Unknown user id"], 304);
    }
}