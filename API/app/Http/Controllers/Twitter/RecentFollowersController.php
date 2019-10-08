<?php

namespace App\Http\Controllers\Twitter;

use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Http\Controllers\Controller;

class RecentFollowersController extends Controller
{
    private $user;
    private $selectedChannel;

    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            $this->user = auth()->user();
            if(!$this->user->hasPermission("manage-recent-followers")) return response()->json(["error" => "You need to upgrade to unlock this feature."], 403);
            $this->selectedChannel = $this->user->selectedTwitterChannel();
            return $next($request);
        });
    }

    public function feed(Request $request)
    {
        $perPage = 100;
        $order = $request->input('order') ? $request->input('order') : 'desc';

        if($firstFollowerId = $this->selectedChannel->followerIds()->first()){
            $registrationDate = Carbon::parse($firstFollowerId->created_at)->addSeconds(1);
        }else{
            $registrationDate = Carbon::parse($this->selectedChannel->created_at)->addMinutes(2);
        }

        $followingIds = $this->selectedChannel->followingIds()->whereNull("unfollowed_at")->pluck("user_id");
        $followerIds = $this->selectedChannel->followerIds()
            ->whereNull("unfollowed_you_at")
            ->whereNotIn("user_id", $followingIds)
            ->where("created_at", ">=", $registrationDate)
            ->orderBy("id", $order)
            ->paginate($perPage)
            ->pluck("user_id")
            ->toArray();

        $items = [];

        $actionsToday = $this->selectedChannel->getDailyStatisticsFor("follows");

        if(count($followerIds)){
            try{
                $items = $this->selectedChannel->getUsersLookup($followerIds);
            }catch(\Exception $e){
                return getErrorResponse($e, $this->selectedChannel->global);
            }
            
        }

        return response()->json([
            "items" => $items,
            "actions" => $actionsToday
        ]);
    }
}