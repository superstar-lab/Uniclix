<?php

namespace App\Http\Controllers\Twitter;

use App\Traits\Selectable;
use function GuzzleHttp\default_ca_bundle;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

define('HOUR', 3600000);
define('DAY', 86400000);
define('MONTH', 2592000000);

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
        $period = $request->period;
        $startDate = $request->startDate;
        $endDate = $request->endDate;
        $result = [];
        try{
            if($channel){
                $channel = $channel->details;
                if(!isset($period) || $period == "undefined"){
                    $data = $channel->pageInsightsByType($type, $startDate, $endDate, $period);
                    return response()->json($data);
                }

                $data = $channel->pageInsightsByType($type, $startDate, $endDate, $period);
                // Set interval based on period
                $lastTime = intval($endDate);
                $firstTime = intval($startDate);
                $interval = DAY; // Default interval
                switch ($period){
                    case "year":
                        $interval = MONTH;
                        break;
                    case "month":
                        $interval = DAY;
                        break;
                    case "week":
                        $interval = DAY;
                        break;
                    case "day":
                        $interval = HOUR;
                        break;
                }

                // Get result based on type
                if($type == "engagementsChartData"){
                    $reactions = $data[0];
                    $comments = $data[1];
                    $shares = $data[2];

                    while ($lastTime >= $firstTime) {
                        $temp = [$lastTime, 0, 0, 0];
                        foreach ($reactions as $reaction){
                            if ($reaction[0] > $lastTime - $interval && $reaction[0] <= $lastTime)
                                $temp[1] = $reaction[1];
                        }

                        foreach ($comments as $comment){
                            if ($comment[0] > $lastTime - $interval && $comment[0] <= $lastTime)
                                $temp[2] = $comment[1];
                        }

                        foreach ($shares as $share){
                            if ($share[0] > $lastTime - $interval && $share[0] <= $lastTime)
                                $temp[3] = $share[1];
                        }

                        $result[] = $temp;
                        $lastTime -= $interval;
                    }
                } else {
                    while ($lastTime >= $firstTime) {
                        $temp = [$lastTime, 0];
                        foreach ($data as $item){
                            if ($item[0] > $lastTime - $interval && $item[0] <= $lastTime)
                                $temp[1] = $item[1];
                        }

                        $result[] = $temp;
                        $lastTime -= $interval;
                    }
                }

                $result_reverse = array_reverse($result);
                return response()->json($result_reverse);
            }
        }catch(\Exception $e){
            return getErrorResponse($e, $channel->global);
        }

        return response()->json(['error' => 'No channel found'], 404);
    }
}
