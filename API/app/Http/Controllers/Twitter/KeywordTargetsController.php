<?php

namespace App\Http\Controllers\Twitter;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Carbon\Carbon;

class KeywordTargetsController extends Controller
{
    private $user;
    private $selectedChannel;
    private $title;

    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            $this->user = auth()->user();
            $this->title = "KEYWORD TARGETS";
            if(!$this->user->hasPermission("manage-keyword-targets")) return response()->json(["error" => "You need to upgrade to unlock this feature."], 403);
            $this->selectedChannel = $this->user->selectedTwitterChannel();
            return $next($request);
        });
    }

    public function feed(Request $request)
    {
        try {
            $items = [];
            $feed = $this->selectedChannel->keywordTargetsFeed();
            $currentTargetIds = $feed->groupBy("target_id")->pluck("target_id")->toArray();
            $targets = $this->selectedChannel->keywordTargets();
            $actionsToday = $this->selectedChannel->getDailyStatisticsFor("follows");

            if ($target = $targets->whereNotIn("id", $currentTargetIds)->latest()->first()) {

                if(!$target->location){
                    $tweets = $this->selectedChannel->getSearch(["q" => $target->keyword, "count" => 100]);
                }else{
                    $location = json_decode($target->location);
                    $tweets = $this->selectedChannel->getSearch(["q" => $target->keyword, "geocode" => "$location->lat,$location->lng,50mi", "count" => 100]);
                }

                // return response()->json($tweets);
                $feedIds = $this->getUsersFromTweetList($tweets);
                $data = [];

                if (isset($feedIds)) {
                    foreach ($feedIds as $feedId) {

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
                ->keywordTargetsFeed()
                ->inRandomOrder('123')
                ->paginate(100)
                ->pluck("user_id")
                ->toArray();

            if (count($feedIds)) {
                $items = $this->selectedChannel->getUsersLookup($feedIds);
            }

            $items = $this->filterFollowing($items);

            return response()->json([
                "items" => $this->filterFollowing($items),
                "targets" => $this->getKeywords(),
                "actions" => $actionsToday
            ]);

        } catch (\Exception $e) {

            return getErrorResponse($e, $this->selectedChannel->global);
        }
    }

    public function store(Request $request)
    {
        $title = $this->title;
        $keyword = $request->input("keyword");
        $location = $request->input("location");

        $target = $this->selectedChannel->keywordTargets()->where("keyword", $keyword)->where("location", $location);

        if (!$target->exists()) {

            $target->create(["keyword" => $keyword, "location" => $location]);
            $keywords = $this->getKeywords();

            return response()->json($keywords);
        }

        return response()->json(['error' => 'Keyword is invalid.'], 404);
    }

    public function destroy($id)
    {
        $this->selectedChannel->keywordTargets()->where("id", $id)->delete();
        return response()->json($this->getKeywords());
    }

    private function getKeywords()
    {
        return $this->selectedChannel
            ->keywordTargets()
            ->orderBy("id", "desc")
            ->take(100)->get();
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
            $this->selectedChannel->keywordTargetsFeed()->whereIn("user_id", $followingIds)->delete();
        }

        return $filtered;
    }

    private function getUsersFromTweetList($tweets)
    {
        $users = [];

        if($tweets){
            foreach($tweets as $tweet){
                $users[] = $tweet->user->id;
            }
        }

        return $users;
    }
}