<?php

namespace App\Http\Controllers\Twitter\Actions;

use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class LikeController extends Controller
{
    private $user;
    private $selectedChannel;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            $this->user = auth()->user();
            return $next($request);
        });
    }

    public function likePost(Request $request)
    {
        $postId = $request->input("postId");
        $channelId = $request->input("channelId");
        $channel = $this->user->getChannel($channelId);

        $channel = $channel->details;

        $channel->likePost($postId);
        try{

            return response()->json(["success" => "Post like succeeded."], 200);

        }catch(\Exception $e){

            return response()->json(["error" => $e->getMessage()], 400);
        }
    }

    public function unlikePost(Request $request)
    {
        $postId = $request->input("postId");
        $channelId = $request->input("channelId");
        $channel = $this->user->getChannel($channelId);

        $channel = $channel->details;

        $channel->unlikePost($postId);
        try{

            return response()->json(["success" => "Post unlike succeeded."], 200);

        }catch(\Exception $e){

            return response()->json(["error" => $e->getMessage()], 400);
        }
    }
}  