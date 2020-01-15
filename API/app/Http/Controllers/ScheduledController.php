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
            ->with('category')
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

        $from_date = $request->input('from_date');
        $to_date = $request->input('to_date');
        if ($from_date && $to_date) {
            $posts = $this->selectedChannel->scheduledPosts()
                ->with('category')
                ->where("posted", 0)
                ->where("approved", 1)
                ->whereDate('scheduled_at', '>=', $from_date)
                ->whereDate('scheduled_at', '<=', $to_date)
                ->orderBy('scheduled_at', 'asc')
                ->paginate(20);
        } else {
            $posts = $this->selectedChannel->scheduledPosts()
                ->with('category')
                ->where("posted", 0)
                ->where("approved", 1)
                ->orderBy('scheduled_at', 'asc')
                ->paginate(20);
        }

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
