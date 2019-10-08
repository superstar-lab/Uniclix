<?php

namespace App\Models\Twitter;

use Illuminate\Database\Eloquent\Model;

class FollowingId extends Model
{
    public $table = "twitter_following_ids";
    protected $fillable = [
        "channel_id",
        "user_id",
        "unfollowed_at",
        "unfollowed_you_at",
        "created_at",
        "updated_at"
    ];
}
