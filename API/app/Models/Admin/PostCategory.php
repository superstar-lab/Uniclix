<?php

namespace App\Models\Admin;

use Illuminate\Database\Eloquent\Model;

use App\Models\Admin\Post;

class PostCategory extends Model
{
    protected $guard = 'admin';

    protected $table = 'posts_categories';

    protected $fillable = [
        'category_name'
    ];

    public function post()
    {
    	return $this->hasMany(Post::class);
    }
}
