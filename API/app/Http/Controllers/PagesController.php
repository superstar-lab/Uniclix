<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Admin\Post;
use App\Models\Admin\PostCategory;
use App\Models\Admin\PostTag;
use App\Models\Role;
use App\Models\RoleAddon;

class PagesController extends Controller
{

    /**
     * Show homepage
     */
    public function index() {
        return view('frontend.homepage.index');
    }

    /**
     *
     * Show upgrade page
     */
    public function upgrade()
    {
    	return view('frontend.upgrade');
    }

    /**
     *
     * Show learning page
     */
    public function education()
    {
    	return view('frontend.education');
    }

    /**
     *
     * Show learning page
     */
    public function pricing()
    {   
        $allPlans = Role::formattedForDisplay();
        $paidPlans = Role::where("name", "!=", "free")->formattedForDisplay();
        $addon = RoleAddon::first();
    	return view('frontend.pricing', compact('allPlans', 'paidPlans', 'addon'));
    }

     /**
     *
     * Show learning page
     */
    public function blog()
    {
        $posts = Post::paginate(5);

    	return view('frontend.blog', compact('posts'));
    }

    /**
     *
     * Show publisher page
     */
    public function publisher()
    {
        return view('frontend.products.publisher');
    }

    /**
     *
     * Show content curation page
     */
    public function content_curation()
    {
        return view( 'frontend.products.content_curation');
    }

    /**
     *
     * Show social listening page
     */
    public function social_listening()
    {
        return view('frontend.products.social_listening');
    }

    /**
     *
     * Show analytics page
     */
    public function analytics()
    {
        return view('frontend.products.analytics');
    }

    /**
     *
     * Show Twitter growth page
     */
    public function twitter_growth()
    {
        return view('frontend.products.twitter_growth');
    }

    /**
     *
     * Show Twitter follower page
     */
    public function twitter_follower()
    {
        return view('frontend.products.twitter_follower');
    }

    /**
     *
     * Show Twitter unfollow page
     */
    public function twitter_unfollow()
    {
        return view('frontend.products.twitter_unfollow');
    }

    /**
     *
     * Show Social Media Management Tools page
     */
    public function management_tools()
    {
        return view('frontend.products.management_tools');
    }

    /**
     *
     * Show Article page
     */
    public function article($id)
    {
        $post = Post::findOrFail($id);
        $categories = PostCategory::all();
        $tags = PostTag::all();
        $recent_posts = Post::whereNotIn('id',[$post->id])->latest()->take(3)->get();

    	return view('frontend.article', compact('post', 'categories', 'tags','recent_posts'));
    }
}
