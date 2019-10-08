<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Article extends Model
{
    protected $fillable = [
        "source_url",
        "author",
        "title",
        "description",
        "content",
        "url",
        "image_url",
        "topic",
        "published_at",
        "created_at",
        "updated_at"
    ];

    public static function storeByTopic($topic){

        if(!$topic) return;

        $client = new \GuzzleHttp\Client();

        $apiKey = "83f2b261732e43f787e6ff78e5a6d75a";

        $pageSize = 100;

        $sortBy = "publishedAt";

        $language="en";

        $apiUrl = "https://newsapi.org/v2/everything?q={$topic}&language={$language}&sortBy={$sortBy}&pageSize={$pageSize}&apiKey={$apiKey}";

        $response = $client->request("GET", $apiUrl, ['headers' => ['Accept' => 'application/json']]); 
    
        $responseData = json_decode((string) $response->getBody(), true);
        
        $feed = [];

        if(!$responseData) return;

        $articles = collect(collect($responseData)["articles"]);

        $titles = $articles->pluck("title");

        $filteredTitles = self::whereIn("title", $titles)->pluck("title");

        $articles = $articles->whereNotIn("title", $filteredTitles);

        foreach($articles as $article){

            $feed[] = [
                "source_url" => $article["source"]["name"],
                "author" => $article["author"],
                "title" => $article["title"],
                "description" => $article["description"],
                "content" => $article["content"],
                "url" => $article["url"],
                "image_url" => $article["urlToImage"],
                "topic" => $topic,
                "published_at" => Carbon::parse($article["publishedAt"]),
                "created_at" => Carbon::now(),
                "updated_at" => Carbon::now()
            ];
        }

        self::insert($feed);
    }
}
