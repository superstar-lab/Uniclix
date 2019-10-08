<?php

namespace App\Models\Pinterest;

use App\Traits\Selectable;
use App\Traits\Pinterest\PinterestTrait;
use App\Models\Channel as GlobalChannel;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class Channel extends Model
{
    use Selectable, PinterestTrait;

    public $table = "pinterest_channels";

    protected $fillable = [
        "user_id",
        "channel_id",
        "username",
        "name",
        "payload",
        "access_token",
        "selected"
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function global()
    {
        return $this->belongsTo(GlobalChannel::class, "channel_id");
    }
}
