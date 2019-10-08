<?php

namespace App\Models\Twitter;

use Illuminate\Database\Eloquent\Model;

class Statistic extends Model
{
    public $table = "twitter_statistics";
    protected $fillable = [
        "channel_id",
        "follows",
        "unfollows",
        "posts",
        "followers",
        "created_at",
        "updated_at"
    ];
}
