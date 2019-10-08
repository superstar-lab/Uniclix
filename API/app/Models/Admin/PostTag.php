<?php

namespace App\Models\Admin;

use Illuminate\Database\Eloquent\Model;

use App\Models\Admin\Post;

class PostTag extends Model
{
    protected $guard = 'admin';

    protected $table = 'posts_tags';

    protected $fillable = [
        'tag_name'
    ];

    public function posts()
    {
    	return $this->belongsToMany(Post::class, 'post_tag', 'tag_id', 'post_id');
    }
}
