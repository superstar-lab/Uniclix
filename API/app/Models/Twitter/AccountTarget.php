<?php

namespace App\Models\Twitter;

use Illuminate\Database\Eloquent\Model;

class AccountTarget extends Model
{
    public $table = "twitter_account_targets";

    protected $fillable = ["channel_id", "account", "created_at", "updated_at"];

    public function feed()
    {
        return $this->hasMany(AccountTargetFeed::class, "target_id");
    }
}
