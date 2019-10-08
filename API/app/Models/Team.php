<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    protected $fillable = [
        'user_id', 'name'
    ];

    public function owner()
    {
        return $this->belongsTo(User::class, "user_id");
    }

    public function members()
    {
        return $this->hasMany(TeamUser::class);
    }

    public function channels()
    {
        return $this->hasMany(TeamUserChannel::class);
    }
}
