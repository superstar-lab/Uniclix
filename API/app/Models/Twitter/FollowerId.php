<?php

namespace App\Models\Twitter;

use Illuminate\Database\Eloquent\Model;

class FollowerId extends Model
{
    public $table = "twitter_follower_ids";
    protected $fillable = [
        "channel_id",
        "user_id",
        "unfollowed_at",
        "unfollowed_you_at",
        "created_at",
        "updated_at"
    ];
}
