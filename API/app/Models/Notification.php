<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    public static function existsForUser($userId, $type)
    {

        return self::where("notifiable_id", $userId)
            ->where("type", $type)->exists();
    }
}
