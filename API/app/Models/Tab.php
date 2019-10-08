<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tab extends Model
{
    protected $fillable = [
        "user_id",
        "title",
        "key",
        "index",
        "selected"
    ];

    public function streams()
    {
        return $this->hasMany(Stream::class);
    }
}
