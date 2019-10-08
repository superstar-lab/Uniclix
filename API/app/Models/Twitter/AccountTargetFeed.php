<?php

namespace App\Models\Twitter;

use Illuminate\Database\Eloquent\Model;

class AccountTargetFeed extends Model
{
    public $table = "twitter_account_targets_feed";

    protected $fillable = ["channel_id", "target_id", "user_id", "created_at", "update_at"];
}
