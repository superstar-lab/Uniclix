<?php

namespace App\Models\Twitter;

use Illuminate\Database\Eloquent\Model;

class KeywordTargetFeed extends Model
{
    public $table = "twitter_keyword_targets_feed";

    protected $fillable = ["channel_id", "target_id", "user_id", "created_at", "update_at"];
}
