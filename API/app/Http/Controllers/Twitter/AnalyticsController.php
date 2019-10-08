<?php

namespace App\Http\Controllers\Twitter;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AnalyticsController extends Controller
{
    private $user;

    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            $this->user = auth()->user();

            if(!$this->user->hasPermission("analytics")) return response()->json(["error" => "You need to upgrade to unlock this feature."], 403);
            return $next($request);
        });
    }

    public function index(Request $request)
    {
        $user = $this->user;
        $channel = $user->getChannel($request->id);

        try{
            if($channel){
                $channel = $channel->details;
                return response()->json($channel->getAnalytics($request->days));
            }
        }catch(\Exception $e){
            return getErrorResponse($e, $channel->global);
        }

        return response()->json(['error' => 'No channel found'], 404);
    }

    /**
     *
     * Get count of facebook page posts
     */
    public function pageInsightsByType($type, Request $request)
    {
        if(!$this->user->hasPermission("advanced-analytics") && !$this->user->hasAddon("twitter_growth")) return response()->json(["error" => "You need to upgrade to unlock this feature."], 403);
        $user = $this->user;
        $channel = $user->getChannel($request->id);

        try{
            if($channel){
                $channel = $channel->details;
                return response()->json($channel->pageInsightsByType($type, $request->startDate, $request->endDate));
            }
        }catch(\Exception $e){
            return getErrorResponse($e, $channel->global);
        }

        return response()->json(['error' => 'No channel found'], 404);
    }
}
