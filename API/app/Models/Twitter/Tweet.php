<?php

namespace App\Models\Twitter;

use Illuminate\Database\Eloquent\Model;

class Tweet extends Model
{
    public $table = "twitter_tweets";
    protected $fillable = [
        "channel_id",
        "tweet_id",
        "original_created_at",
        "created_at",
        "updated_at"
    ];
}