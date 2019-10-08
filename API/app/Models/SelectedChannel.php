<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SelectedChannel extends Model
{
    protected $fillable = [
        'user_id', 'channel_id', 'network'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
