<?php

namespace App\Http\Controllers\Twitter;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\Request;

class AccountTargetsController extends Controller
{
    private $user;
    private $selectedChannel;

    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            $this->user = auth()->user();

            if(!$this->user->hasPermission("manage-account-targets")) return response()->json(["error" => "You need to upgrade to unlock this feature."], 403);
            $this->selectedChannel = $this->user->selectedTwitterChannel();
            return $next($request);
        });
    }


    public function feed(Request $request)
    {
        try {

            $items = [];
            $feed = $this->selectedChannel->accountTargetsFeed();
            $currentTargetIds = $feed->groupBy("target_id")->pluck("target_id")->toArray();
            $targets = $this->selectedChannel->accountTargets();
            $actionsToday = $this->selectedChannel->getDailyStatisticsFor("follows");

            if ($target = $targets->whereNotIn("id", $currentTargetIds)->latest()->first()) {

                $feedIds = $this->selectedChannel->getFollowerIds(5000, -1, $target->account);

                $data = [];

                if (isset($feedIds->ids)) {
                    foreach ($feedIds->ids as $feedId) {

                        $data[] = [
                            "channel_id" => $this->selectedChannel->id,
                            "target_id" => $target->id,
                            "user_id" => $feedId,
                            "created_at" => Carbon::now(),
                            "updated_at" => Carbon::now()
                        ];
                    }
                }

                if (!empty($data)) {
                    $target->feed()->insert($data);
                }
            }

            $feedIds = $this->selectedChannel
                ->accountTargetsFeed()
                ->inRandomOrder('123')
                ->paginate(100)
                ->pluck("user_id")
                ->toArray();

            if (count($feedIds)) {
                $items = $this->selectedChannel->getUsersLookup($feedIds);
            }

            return response()->json([
                "items" => $this->filterFollowing($items),
                "targets" => $this->getAccounts(),
                "actions" => $actionsToday
            ]);

        } catch (\Exception $e) {

            return getErrorResponse($e, $this->selectedChannel->global);
        }
    }


    public function store(Request $request)
    {	
    	try{

    		$username = str_replace("@", "", $request->input("username"));
	        $target = $this->selectedChannel->accountTargets()->where("account", $username);

	        if (!$target->exists()) {
                $info = $this->selectedChannel->getUsersInfo(["screen_name" => $username]);
	            if (!empty($info)) {

	                $target->create(["account" => $username]);
	                $accounts = $this->getAccounts();
	 
	                return response()->json($accounts);
	            }
	        }

    	}catch(\Exception $e){
            return getErrorResponse($e, $this->selectedChannel->global);
    	}

        return response()->json(['error' => "Target not found"], 404);
    }

    public function destroy($username)
    {
        $target = $this->selectedChannel->accountTargets()->where("account", strtolower($username))->delete();

        return response()->json($this->getAccounts());
    }

    private function getAccounts()
    {
        $accounts = $this->selectedChannel
            ->accountTargets()
            ->orderBy("id", "desc")
            ->take(100)
            ->pluck("account")
            ->toArray();

        if (!empty($accounts)) {
            try{
                $accounts = $this->selectedChannel->getUsersLookupByName($accounts);
            }catch(\Exception $e){
                return getErrorResponse($e);
            }
            
            return $accounts;
        }

        return [];
    }

    private function filterFollowing($items)
    {
        $filtered = [];
        $followingIds = [];
        foreach ($items as $item) {
            if (isset($item->status)) {

                if ($item->following || $item->follow_request_sent) {
                    $followingIds[] = $item->id;
                } else {
                    $filtered[] = $item;
                }
            }
        }

        if (!empty($followingIds)) {
            $this->selectedChannel->accountTargetsFeed()->whereIn("user_id", $followingIds)->delete();
        }

        return $filtered;
    }
}