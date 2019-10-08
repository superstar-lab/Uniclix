<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Models\Admin\Post;
use App\Models\Admin\PostCategory;
use App\Models\Admin\PostTag;

class AdminController extends Controller
{
    public function dashboard()
    {
    	$posts = Post::all();

    	return view('admin.dashboard', compact('posts'));
    }

    public function createPost()
    {
    	$post_categories = PostCategory::all();
    	$tags = PostTag::all();

    	return view('admin.create_post', compact('post_categories','tags'));
    }

    public function editPost($id)
    {
    	$post = Post::find($id);
    	$post_categories = PostCategory::all();
    	$tags = PostTag::all();

    	return view('admin.edit_post', compact('post', 'post_categories','tags'));
    }

    public function storePost(Request $request)
    {
    	$filename = null;

        if ($request->has('image')) {
            if (!is_dir(public_path() . '/post_images')) {
                mkdir(public_path() . '/post_images', 0777, true);
            }

            $file = $request->file('image');

            $destinationPath = public_path() . '/post_images';
            $filename = str_random(8) . '_' . $file->getClientOriginalName();
            $file->move($destinationPath, $filename);
        }

    	$post = Post::create([
    		'title'=>$request->input('title'),   
    		'image'=>$filename, 		
    		'content'=>$request->input('content'),
    		'admin_id'=>auth()->user()->id,
    		'category_id'=>$request->input('category_id'),
    	]);

    	$tags = $request->input('tags');
    	foreach ($tags as $tag) {
    		$exist_tag = PostTag::where('id',$tag)->first();
    		if($exist_tag === null)
    		{
    			$new_tag = PostTag::create(['tag_name'=>$tag]); 
    			$post->tags()->attach($new_tag->id);
    		}
    		else {
    			$post->tags()->attach($tag);
    		}
    	}
    	return redirect()->route('admin.dashboard');
   	}

   	public function editPostStore($id, Request $request)
    {
    	$post = Post::find($id);

    	$filename = null;

        if ($request->has('image')) {
            if (!is_dir(public_path() . '/post_images')) {
                mkdir(public_path() . '/post_images', 0777, true);
            }

            $file = $request->file('image');

            $destinationPath = public_path() . '/post_images';
            $filename = str_random(8) . '_' . $file->getClientOriginalName();
            $file->move($destinationPath, $filename);

            $post->update(['image'=>$filename]);
        }    	

        $tags = $request->input('tags');



        foreach ($tags as $key=>$value) {
            $exist_tag = PostTag::where('id',$value)->first();
            if($exist_tag === null)
            {
                $new_tag = PostTag::create(['tag_name'=>$value]); 
                unset($tags[$key]);
                $tags[] = $new_tag->id;
            }
        }

        $post->tags()->sync($tags);

    	$post->update([
    		'title'=>$request->input('title'),   
    		'content'=>$request->input('content'),
    		'admin_id'=>auth()->user()->id,
    		'category_id'=>$request->input('category_id'),
    	]);

    	return redirect()->back();
    }

    public function uploadPostImage(Request $request)
    {
    	$imgpath = request()->file('file')->store('post_images', 'public');
    }

    public function deletePost($id)
    {
        $post = Post::findOrFail($id);

        try {
            $post->delete();
            return redirect()->back();              
        } catch (Exception $e) {
            
        }
    }
    
}	
