<?php

namespace App\Http\Controllers\Facebook;

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
    /**
     * 
     * Prepare data for Facebook Page Insights
     */
    public function pageInsights(Request $request)
    {
        $user = $this->user;
        $channel = $user->getChannel($request->id);

        try{
            if($channel){
                $channel = $channel->details;
                return response()->json($channel->pageInsights($request->startDate, $request->endDate));
            }
        }catch(\Exception $e){
            return getErrorResponse($e, $channel->global);
        }

        return response()->json(['error' => 'No channel found'], 404);
    }

    /**
     * 
     * Prepare data for Facebook Page Insights
     */
    public function pagePostsInsights(Request $request)
    {
        $user = $this->user;
        $channel = $user->getChannel($request->id);

        try{
            if($channel){
                $channel = $channel->details;
                return response()->json($channel->pagePostsInsights($request->startDate, $request->endDate));
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
        $user_id = $this->user->id;
        if(!$this->user->hasPermission("advanced-analytics", $user_id)) return response()->json(["error" => "You need to upgrade to unlock this feature."], 403);
        $user    = $this->user;
        $channel = $user->getChannel($request->id);
        $period     = $request->period;
        $startDate  = $request->startDate;
        $endDate    = $request->endDate;
        $result     = [];

        if($type == "engagementsCardData"){
            try{
                if($channel){
                    $result           = array();
                    $channel          = $channel->details;
                    $startDateHistory = 1072929600;
                    $endDateHistory   = round(microtime(true) * 1000);

                    $prevStartDate    = $request->$period == "week" ? $startDate - WEEK   : ($request->$period == "month" ? $startDate - MONTH   : ($request->$period == "year" ? $startDate - $year   : $startDate));
                    $prevEndDate      = $request->$period == "week" ? $endDate - WEEK     : ($request->$period == "month" ? $endDate - MONTH     : ($request->$period == "year" ? $endDate - $year     : $endDate));


                    $data             = $channel->pageInsightsByType($type, $request->startDate, $request->endDate, $request->period);
                    $historyData      = $channel->pageInsightsByType($type, $startDateHistory, $endDateHistory, $request->period);
                    $prevData         = $channel->pageInsightsByType($type, $prevStartDate, $prevEndDate, $request->$period);
                    
                    $reactions        = isset($data['reactions']) ? $data['reactions']  : 0;
                    $comments         = isset($data['comments'])  ? $data['comments']   : 0;
                    $shares           = isset($data['shares'])    ? $data['shares']    : 0;

                    $reactionsHistory = isset($historyData['reactions'])  ? $historyData['reactions']   : 0;
                    $commentsHistory  = isset($historyData['comments'])   ? $historyData['comments']    : 0;
                    $sharesHistory    = isset($historyData['shares'])    ? $historyData['shares']       : 0;

                    $reactionsPrev    = isset($prevData['reactions'])  ? $prevData['reactions']   : 0;
                    $commentsPrev     = isset($prevData['comments'])   ? $prevData['comments']    : 0;
                    $sharesPrev       = isset($prevData['shares'])     ? $prevData['shares']      : 0;


                    $result['reactions']['historicalNumber']         = $reactionsHistory;
                    $result['reactions']['totalInPeriod']            = $reactions;
                    $result['reactions']['differenceWithPrevPeriod'] = $reactions - $reactionsPrev;

                    $result['comments']['historicalNumber']          = $commentsHistory;
                    $result['comments']['totalInPeriod']             = $comments;
                    $result['comments']['differenceWithPrevPeriod']  = $comments - $commentsPrev;

                    $result['shares']['historicalNumber']            = $sharesHistory;
                    $result['shares']['totalInPeriod']               = $shares;
                    $result['shares']['differenceWithPrevPeriod']    = $shares - $sharesPrev;


                        return $result;
                }
            }catch(\Exception $e){
                return getErrorResponse($e, $channel->global);
            }
        }else if($type == "engagementsChartData"){
                try {
                    if($channel){
                        $result     = array();
                        $channel    = $channel->details;
                        $data       = $channel->pageInsightsByType($type, $request->startDate, $request->endDate, $request->period);
                        $reactions  = $data[0];
                        $comments   = $data[1];
                        $shares     = $data[2];
                        $lastTime   = (floor($endDate) / 1000) * 1000;


                        switch ($period) {

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
                    }


                $result_reverse = array_reverse($result);
                return response()->json($result_reverse);
                //return $data;
                } catch (Exception $e) {
                    return getErrorResponse($e, $channel->global);
                }
        }else if($type == "fansChartData"){
            try{
                if($channel){
                    $channel = $channel->details;
                    $data    = $channel->pageInsightsByType($type, $request->startDate, $request->endDate, $period);
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


                    $result_reverse = array_reverse($result);
                     return response()->json($result_reverse);
                }
            }catch(\Exception $e){
                return getErrorResponse($e, $channel->global);
            }
        }else{
            try{
                if($channel){
                    $channel = $channel->details;
                    return response()->json($channel->pageInsightsByType($type, $request->startDate, $request->endDate, $period));
                }
                }catch(\Exception $e){
                return getErrorResponse($e, $channel->global);
            }

        }

        return response()->json(['error' => 'No channel found'], 404);
    }
}