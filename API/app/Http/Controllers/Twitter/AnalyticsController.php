<?php

namespace App\Http\Controllers\Twitter;

use App\Traits\Selectable;
use function GuzzleHttp\default_ca_bundle;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

define('HOUR', 3600000);
define('DAY', 86400000);
define('WEEK', 604800000);
define('MONTH', 2592000000);

class AnalyticsController extends Controller
{
    private $user;
    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            $this->user = auth()->user();
            $user_id = $this->user->id;
            if(!$this->user->hasPermission("analytics", $user_id)) return response()->json(["error" => "You need to upgrade to unlock this feature."], 403);
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

    public function pageInsightsByType($type, Request $request)
    {
        $user_id = $this->user->id;
        if(!$this->user->hasPermission("advanced-analytics", $user_id) && !$this->user->hasAddon("twitter_growth")) return response()->json(["error" => "You need to upgrade to unlock this feature."], 403);
        $user       = $this->user;
        $channel    = $user->getChannel($request->id);
        $period     = $request->period;
        $startDate  = $request->startDate;
        $endDate    = $request->endDate;
        $result     = [];
        $ninetyDays = DAY   * 90;
        $year       = MONTH * 12;

        try{
            if($channel){
                $channel = $channel->details;
                if(!isset($period) || $period == "undefined"){
                    $data = $channel->pageInsightsByType($type, $startDate, $endDate, $period);
                    return response()->json($data);
                }


               $data        = $channel->pageInsightsByType($type, $startDate, $endDate, $period);

                if($type == "engagementsChartData"){
                    $reactions = $data[0];
                    $comments  = $data[1];
                    $shares    = $data[2];
                    $lastTime   = (floor($endDate) / 1000) * 1000;


                    switch ($period){
                        case "year":
                            for($i = 0; $i < 12; $i++){
                                $temp = [$lastTime, 0, 0, 0];
                                foreach ($reactions as $reaction){
                                    if ($lastTime >= $reaction[0] && $lastTime - MONTH <= $reaction[0])
                                        $temp[1] = $reaction[1];
                                }

                                foreach ($comments as $comment){
                                    if ($lastTime >= $comment[0] && $lastTime - MONTH <= $comment[0])
                                        $temp[2] = $comment[1];
                                }

                                foreach ($shares as $share){
                                    if ($lastTime >= $share[0] && $lastTime - MONTH <= $share[0])
                                        $temp[3] = $share[1];
                                }

                                $result[] = $temp;
                                $lastTime -= MONTH;
                            }

                            break;
                        case "month":
                            for($i = 0; $i < 31; $i++){
                                $temp = [$lastTime, 0, 0, 0];
                                foreach ($reactions as $reaction){
                                    if ($lastTime >= $reaction[0] && $lastTime - DAY <= $reaction[0])
                                        $temp[1] = $reaction[1];
                                }

                                foreach ($comments as $comment){
                                    if ($lastTime >= $comment[0] && $lastTime - DAY <= $comment[0])
                                        $temp[2] = $comment[1];
                                }

                                foreach ($shares as $share){
                                    if ($lastTime >= $share[0] && $lastTime - DAY <= $share[0])
                                        $temp[3] = $share[1];
                                }

                                $result[] = $temp;
                                $lastTime -= DAY;
                            }

                            break;
                        case "week":
                            for($i = 0; $i < 7; $i++){
                                $temp = [$lastTime, 0, 0, 0];
                                foreach ($reactions as $reaction){
                                    if ($lastTime >= $reaction[0] && $lastTime - DAY <= $reaction[0])
                                        $temp[1] = $reaction[1];
                                }

                                foreach ($comments as $comment){
                                    if ($lastTime >= $comment[0] && $lastTime - DAY <= $comment[0])
                                        $temp[2] = $comment[1];
                                }

                                foreach ($shares as $share){
                                    if ($lastTime >= $share[0] && $lastTime - DAY <= $share[0])
                                        $temp[3] = $share[1];
                                }

                                $result[] = $temp;
                                $lastTime -= DAY;
                            }

                            break;
                        case "day":
                            for($i = 0; $i < 24; $i++){
                                $temp = [$lastTime, 0, 0, 0];
                                foreach ($reactions as $reaction){
                                    if ($lastTime >= $reaction[0] && $lastTime - HOUR <= $reaction[0])
                                        $temp[1] = $reaction[1];
                                }

                                foreach ($comments as $comment){
                                    if ($lastTime >= $comment[0] && $lastTime - HOUR <= $comment[0])
                                        $temp[2] = $comment[1];
                                }

                                foreach ($shares as $share){
                                    if ($lastTime >= $share[0] && $lastTime - HOUR <= $share[0])
                                        $temp[3] = $share[1];
                                }

                                $result[] = $temp;
                                $lastTime -= HOUR;
                            }

                            break;
                    }
                }else if($type == "engagementsCardData"){

                    $endDateHistory   = round(microtime(true) * 1000);
                    $startDateHistory = $endDateHistory - $ninetyDays;

                    $prevStartDate    = $period == "week" ? $startDate - WEEK   : ($period == "month" ? $startDate - MONTH   : ($period == "year" ? $startDate - $year   : $startDate));
                    $prevEndDate      = $period == "week" ? $endDate - WEEK     : ($period == "month" ? $endDate - MONTH     : ($period == "year" ? $endDate - $year     : $endDate));

                    $prevData         = $channel->pageInsightsByType($type, $prevStartDate, $prevEndDate, $period);
                    $historyData      = $channel->pageInsightsByType($type, $startDateHistory, $endDateHistory, "year");
                    
                    $reactions        = isset($data[0][0][1]) ? $data[0][0][1] : 0;
                    $comments         = isset($data[1][0][1]) ? $data[1][0][1] : 0;
                    $shares           = isset($data[2][0][1]) ? $data[2][0][1] : 0;

                    $reactionsHistory = isset($historyData[0][0][1]) ? $historyData[0][0][1] : 0;
                    $commentsHistory  = isset($historyData[1][0][1]) ? $historyData[1][0][1] : 0;
                    $sharesHistory    = isset($historyData[2][0][1]) ? $historyData[1][0][1] : 0;

                    $reactionsPrev    = isset($prevData[0][0][1]) ? $prevData[0][0][1] : 0;
                    $commentsPrev     = isset($prevData[1][0][1]) ? $prevData[1][0][1] : 0;
                    $sharesPrev       = isset($prevData[2][0][1]) ? $prevData[1][0][1] : 0;

                    $totalReactions   = $channel->totalLikesCount($startDate, $endDate);

                    $result['reactions']['historicalNumber']         = $reactionsHistory;
                    $result['reactions']['totalInPeriod']            = $reactions;
                    $result['reactions']['differenceWithPrevPeriod'] = $reactions - $reactionsPrev;

                    $result['comments']['historicalNumber']          = $commentsHistory;
                    $result['comments']['totalInPeriod']             = $comments;
                    $result['comments']['differenceWithPrevPeriod']  = $comments - $commentsPrev;

                    $result['shares']['historicalNumber']            = $sharesHistory;
                    $result['shares']['totalInPeriod']               = $shares;
                    $result['shares']['differenceWithPrevPeriod']    = $shares - $sharesPrev;
                }
                else {
                    $lastTime   = (floor($endDate) / 1000) * 1000;
                    switch ($period) {
                        case "year":
                            for($i = 0; $i < 12; $i++){
                                $temp = [$lastTime, 0];
                                foreach ($data as $item){
                                    if ($lastTime >= $item[0] && $lastTime - MONTH <= $item[0])
                                        $temp[1] = $item[1];
                                }

                                $result[] = $temp;
                                $lastTime -= MONTH;
                            }

                            break;
                        case "month":
                            for ($i = 0; $i < 31; $i++) {
                                $temp = [$lastTime, 0];
                                foreach ($data as $item){
                                    if ($lastTime >= $item[0] && $lastTime - DAY <= $item[0])
                                        $temp[1] = $item[1];
                                }

                                $result[] = $temp;
                                $lastTime -= DAY;
                            }

                            break;
                        case "week":
                            for ($i = 0; $i < 7; $i++) {
                                $temp = [$lastTime, 0];
                                foreach ($data as $item){
                                    if ($lastTime >= $item[0] && $lastTime - DAY <= $item[0])
                                        $temp[1] = $item[1];
                                }

                                $result[] = $temp;
                                $lastTime -= DAY;
                            }

                            break;
                        case "day":
                            for ($i = 0; $i < 24; $i++) {
                                $temp = [$lastTime, 0];
                                foreach ($data as $item){
                                    if ($lastTime >= $item[0] && $lastTime - HOUR <= $item[0])
                                        $temp[1] = $item[1];
                                }

                                $result[] = $temp;
                                $lastTime -= HOUR;
                            }

                            break;
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
