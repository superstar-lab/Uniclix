<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ScheduleTime extends Model
{
    protected $fillable = [
        "channel_id",
        "time_id",
        "schedule_week",
        "schedule_time",
        "posted",
        "content",
    ];

    public function channel()
    {

        return $this->belongsTo(Channel::class);
    }
}
