<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeamUserChannel extends Model
{
    protected $fillable = [
        'member_id', 'owner_id', 'approver_id', 'channel_id', 'team_id', 'role'
    ];

    public function owner()
    {
        return $this->belongsTo(User::class, "owner_id");
    }

    public function member()
    {
        return $this->belongsTo(User::class, "member_id");
    }

    public function approver()
    {
        return $this->belongsTo(User::class, "approver_id");
    }

    public function team()
    {
        return $this->belongsTo(Team::class, "team_id");
    }

    public function channel()
    {
        return $this->belongsTo(Channel::class, "channel_id");
    }
}
