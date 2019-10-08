<?php

namespace App\Http\Controllers\Twitter;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class WhitelistController extends Controller
{
    private $user;
    private $selectedChannel;

    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            $this->user = auth()->user();
            $this->selectedChannel = $this->user->selectedTwitterChannel();
            return $next($request);
        });
    }

    public function index()
    {
        $title = 'WHITELIST';
        $items = [];
        return view('backend.manage.search-list', compact('title', 'items'));
    }
}