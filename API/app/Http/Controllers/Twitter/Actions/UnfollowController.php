<?php

namespace App\Http\Controllers\Twitter\Actions;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Carbon\Carbon;

class UnfollowController extends Controller
{
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
    public function unfollow($userId)
    {
        try{
            if($userId){

                if($this->user->getLimit("twitter_daily_unfollows") > $this->selectedChannel->getDailyStatisticsFor("unfollows")){

                    $twitterUser = $this->selectedChannel->unfollowByName($userId);

                    $this->selectedChannel->followingIds()
                        ->updateOrCreate(
                            [
                                "channel_id" => $this->selectedChannel->id,
                                "user_id" => $twitterUser->id
                            ],
                            [
                                "unfollowed_at" => Carbon::now(),
                                "created_at" => Carbon::now(),
                                "updated_at" => Carbon::now()
                            ]);

                    $this->selectedChannel->updateStatistics("unfollows");
                    $dailyActions = $this->selectedChannel->getDailyStatisticsFor("unfollows");
                    return response()->json(["success" => true, "message" => "You unfollowed $twitterUser->screen_name.", "dailyActions" => $dailyActions], 200);
                }

                return response()->json(["success" => false, "message" => "You exceeded the daily limit."], 403);
            }
        }catch(\Exception $e){
            return response()->json(["success" => false, "message" => $e->getMessage()], 500);
        }

        return response()->json(["success" => false, "message" => "Something went wrong"], 304);
    }

}