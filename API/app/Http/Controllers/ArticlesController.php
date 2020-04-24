<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Article;

class ArticlesController extends Controller
{
    private $user;
    private $selectedChannel;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            $this->user = auth()->user();
            $user_id = $this->user->id;
            if($this->user){
               if(!$this->user->hasPermission("articles", $user_id)) return response()->json(["error" => "You need to upgrade to unlock this feature."], 403);
               $this->selectedChannel = $this->user->selectedChannel(); 
            }
            
            return $next($request);
        });
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function sync(Request $request)
    {   

        try{
            $topic = $request->input("item");   
            
            if(!$topic) return;

            $topic = unserialize($topic);
            Article::storeByTopic($topic);

        }catch(\Exception $e){
            return $e->getMessage();
        }
    }

    public function articles(Request $request){

        $perPage = $request->input("count") ? $request->input("count") : 20;
        $topics = $this->user->topics()->pluck("topic");

        $articles = \DB::table("articles")
        ->select("articles.id as id", "articles.source_url", 
        "articles.title", "articles.description", "articles.content", "articles.url", 
        "articles.image_url", "articles.topic", "articles.published_at", "articles.author", "scheduled_posts.posted")
        ->leftJoin("scheduled_posts", "articles.id", "like", "scheduled_posts.article_id")
        ->whereIn("topic", $topics)
        ->inRandomOrder("123");

        if(!$articles->exists() && $topics){
            multiRequest(route('articles.sync'), $topics);
        }

        return $articles->paginate($perPage);
    }
}
