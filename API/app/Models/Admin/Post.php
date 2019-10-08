<?php

namespace App\Models\Admin;

use Illuminate\Database\Eloquent\Model;

use App\Models\Admin\PostCategory;
use App\Models\Admin\PostTag;
use App\Models\Admin\Admin;

class Post extends Model
{
    protected $guard = 'admin';

    protected $fillable = [
        'title', 'image', 'content', 'admin_id', 'category_id'
    ];

    public function admin()
    {
    	return $this->belongsTo(Admin::class);
    }
    
    public function category()
    {
    	return $this->belongsTo(PostCategory::class);
    }

    public function tags()
    {
    	return $this->belongsToMany(PostTag::class, 'post_tag', 'post_id', 'tag_id');
    }

}
