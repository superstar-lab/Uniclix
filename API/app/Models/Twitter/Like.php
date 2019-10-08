<?php

namespace App\Models\Twitter;

use Illuminate\Database\Eloquent\Model;

class Like extends Model
{
    public $table = "twitter_likes";
    protected $fillable = [
        "channel_id",
        "tweet_id",
        "original_created_at",
        "created_at",
        "updated_at"
    ];
}