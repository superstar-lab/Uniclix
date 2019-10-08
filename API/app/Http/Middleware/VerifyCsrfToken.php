<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array
     */
    protected $except = [
        'sync/twitter/following/ids',
        'sync/twitter/follower/ids',
        'sync/twitter/tweets',
        'sync/twitter/retweets',
        'sync/twitter/likes',
        'twitter/follow',
        'twitter/unfollow',
        'admin/post/image/upload',
        'sync/facebook/posts',
        'facebook/chatbot',
        'stripe/*'
    ];
}
