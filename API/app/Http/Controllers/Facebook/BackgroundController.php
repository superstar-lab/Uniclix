<?php

namespace App\Http\Controllers\Facebook;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class BackgroundController extends Controller
{
    public function syncFacebookPosts(Request $request)
    {
        if(!($item = $request->input('item'))) return;

        $channel = unserialize($item);

        $channel->startProcess("syncFacebookPosts");

        try{
            $channel->syncFacebookPosts();
        }catch(\Exception $e){
            getErrorResponse($e, $channel->global);
        }

        $channel->stopProcess("syncFacebookPosts");
    }
}
