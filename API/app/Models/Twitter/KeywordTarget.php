<?php

namespace App\Models\Twitter;

use Illuminate\Database\Eloquent\Model;

class KeywordTarget extends Model
{
    public $table = "twitter_keyword_targets";

    protected $fillable = ["channel_id", "keyword", "location", "created_at", "updated_at"];

    public function feed()
    {
        return $this->hasMany(KeywordTargetFeed::class, "target_id");
    }
}
