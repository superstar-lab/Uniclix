<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;

class ScheduledController extends Controller
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
            if (!$this->user->hasPermission("scheduling")) return response()->json(["error" => "You need to upgrade to unlock this feature."], 403);
            $this->selectedChannel = $this->user->selectedChannel();
            return $next($request);
        });
    }

    public function unapprovedPosts(Request $request)
    {
        $posts = $this->selectedChannel->scheduledPosts()
            ->where("posted", 0)
            ->where("approved", 0)
            ->orderBy('scheduled_at', 'asc')
            ->paginate(20);

        foreach ($posts as $post) {
            $post->payload = unserialize($post->payload);
        }

        $posts = $posts->groupBy(function ($date) {
            return Carbon::parse($date->scheduled_at_original)->format('Y-m-d');
        });

        return response()->json(["items" => $posts->values()]);
    }

    public function scheduledPosts(Request $request)
    {
        $posts = $this->selectedChannel->scheduledPosts()
            ->with('category')
            ->where("posted", 0)
            ->where("approved", 1)
            ->orderBy('scheduled_at', 'asc')
            ->paginate(20);

        foreach ($posts as $post) {
            $post->payload = unserialize($post->payload);
        }

        $posts = $posts->groupBy(function ($date) {
            return Carbon::parse($date->scheduled_at_original)->format('Y-m-d');
        });

        return response()->json(["items" => $posts->values()]);
    }

    public function pastScheduled(Request $request)
    {
        $posts = $this->selectedChannel->scheduledPosts()
            ->where("posted", 1)
            ->orderBy('scheduled_at', 'desc')
            ->paginate(20);

        foreach ($posts as $post) {
            $post->payload = unserialize($post->payload);
        }

        $posts = $posts->groupBy(function ($date) {
            return Carbon::parse($date->scheduled_at_original)->format('Y-m-d');
        });

        return response()->json(["items" => $posts->values()]);
    }
}
