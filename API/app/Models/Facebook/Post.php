<?php

namespace App\Models\Facebook;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    public $table = "facebook_posts";
    protected $fillable = [
        "channel_id",
        "post_id",
        "message",
        "story",
        "original_created_at",
        "created_at",
        "updated_at"
    ];
}
