<?php

namespace App\Models\Facebook;

use Illuminate\Database\Eloquent\Model;

class Process extends Model
{
    public $table = "facebook_processes";
    protected $fillable = ["channel_id", "process_name", "created_at", "updated_at"];
}
