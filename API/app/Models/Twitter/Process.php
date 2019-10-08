<?php

namespace App\Models\Twitter;

use Illuminate\Database\Eloquent\Model;

class Process extends Model
{
    public $table = "twitter_processes";
    protected $fillable = ["channel_id", "process_name", "created_at", "updated_at"];
}
