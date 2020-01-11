<?php

namespace App\Models;

use App\Models\Admin\PostCategory;
use Illuminate\Database\Eloquent\Model;

class ScheduledPost extends Model
{
    protected $fillable = [
        "channel_id",
        "content",
        "scheduled_at",
        "scheduled_at_original",
        "payload",
        "status",
        "posted",
        "approved",
        "article_id",
        "category_id"
    ];

    public function channel()
    {

        return $this->belongsTo(Channel::class);
    }

    public function category()
    {
        return $this->belongsTo(PostCategory::class);
    }

    public function destroyCompletely()
    {
        $payload = unserialize($this->payload);
        $images = $payload['images'];

        foreach ($images as $image) {
            $exists = self::where("payload", "like", "%" . $image['absolutePath'] . "%")->exists();

            if (!$exists) {
                $filePath = str_replace("storage", "public", $image['relativePath']);
                \Storage::delete($filePath);
            }
        }

        $this->delete();
    }
}
