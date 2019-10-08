<?php

namespace App\Models\Twitter;

use Illuminate\Database\Eloquent\Model;

class Cursor extends Model
{
    public $table = "twitter_cursor";
    protected $fillable = ["followerids_cursor", "followingids_cursor", "followers_cursor", "followings_cursor", "created_at", "updated_at"];
}
