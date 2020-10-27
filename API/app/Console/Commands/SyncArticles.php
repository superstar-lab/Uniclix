<?php

namespace App\Console\Commands;

use App\Models\Article;
use Illuminate\Console\Command;
use App\Models\Topic;

class SyncArticles extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sync:articles';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Synchronizes articles for given topics';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $topics = Topic::select('topic')
                    ->join('users', 'topics.user_id', '=', 'users.id')
                    ->where('users.active', 1)
                    ->distinct()->pluck("topic")->toArray();

        foreach ($topics as $topic){

            try{
                Article::storeByTopic($topic);

            }catch(\Exception $e){
                return $e->getMessage();
            }
        }
    }
}
