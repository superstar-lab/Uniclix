<?php

namespace App\Http\Controllers\Twitter;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
set_time_limit(0);

class BackgroundController extends Controller
{

    public function syncFollowerIds(Request $request)
    {
        if(!($item = $request->input('item'))) return;

        $params = unserialize($request->input('params'));

        $sleep = isset($params['sleep']) ? $params['sleep'] : 60;

        $channel = unserialize($item);

        $channel->startProcess("syncTwitterFollowerIds");

        try{
            $channel->syncFollowerIds($sleep);
        }catch(\Exception $e){
            getErrorResponse($e, $channel->global);
        }

        $channel->stopProcess("syncTwitterFollowerIds");
    }


    public function syncFollowingIds(Request $request)
    {
        if(!($item = $request->input('item'))) return;

        $params = unserialize($request->input('params'));

        $sleep = isset($params['sleep']) ? $params['sleep'] : 60;

        $channel = unserialize($item);

        $channel->startProcess("syncTwitterFollowingIds");

        try{
            $channel->syncFollowingIds($sleep);
        }catch(\Exception $e){
            getErrorResponse($e, $channel->global);
        }

        $channel->stopProcess("syncTwitterFollowingIds");
    }

    public function syncTweets(Request $request)
    {
        if(!($item = $request->input('item'))) return;

        $channel = unserialize($item);

        $channel->startProcess("syncTweets");

        try{
            $channel->syncTweets();
        }catch(\Exception $e){
            getErrorResponse($e, $channel->global);
        }

        $channel->stopProcess("syncTweets");
    }

    public function syncRetweets(Request $request)
    {
        if(!($item = $request->input('item'))) return;

        $channel = unserialize($item);

        $channel->startProcess("syncRetweets");

        try{
            $channel->syncRetweets();
        }catch(\Exception $e){
            getErrorResponse($e, $channel->global);
        }

        $channel->stopProcess("syncRetweets");
    }

    public function syncLikes(Request $request)
    {
        if(!($item = $request->input('item'))) return;

        $channel = unserialize($item);

        $channel->startProcess("syncLikes");

        try{
            $channel->syncLikes();
        }catch(\Exception $e){
            getErrorResponse($e, $channel->global);
        }

        $channel->stopProcess("syncLikes");
    }
}