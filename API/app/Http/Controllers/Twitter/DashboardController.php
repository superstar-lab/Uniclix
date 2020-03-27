<?php

namespace App\Http\Controllers\Twitter;

use App\Http\Controllers\Controller;

class DashboardController extends Controller
{   
    private $user;
    private $selectedChannel;

    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            $this->user = auth()->user();
            $user_id = $this->user->id;
            if(!$this->user->hasPermission("manage-dashboard", $user_id)) return response()->json(["error" => "You need to upgrade to unlock this feature."], 403);
            $this->selectedChannel = $this->user->selectedTwitterChannel();
            return $next($request);
        });
    }

    public function index()
    {
        $user = $this->user;
        $channel = $this->selectedChannel;

        try{
            if($channel){
                return response()->json($channel->getData());
            }
        }catch(\Exception $e){
            return getErrorResponse($e, $channel->global);
        }

        return response()->json(['error' => 'No channel found'], 404);
    }
}
