<?php

namespace App\Http\Controllers\Facebook;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class PagesController extends Controller
{

    private $user;

    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            $this->user = auth()->user();
            return $next($request);
        });
    }

    public function search(Request $request)
    {
        $channelId = $request->input("channelId");
        $query = $request->input("query");

        if(!$channelId || !$query) return response()->json(["error" => "Required fields missing."], 400);

        $channel = $this->user->getChannel($channelId);

        if(!$channel) return response()->json(["error" => "Channel not found."], 404);

        $channel = $channel->details;
        $results = $channel->searchPages(["q" => $query]);

        if(empty($results)) return response()->json(["error" => "No results found for $query"], 404);

        return response()->json($results);
    }
}