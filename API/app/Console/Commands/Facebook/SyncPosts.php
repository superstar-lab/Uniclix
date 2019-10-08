<?php

namespace App\Console\Commands\Facebook;

use Illuminate\Console\Command;
use App\Models\Facebook\Channel;

class SyncPosts extends Command
{
    /**
     * The name and signature of the console command.
    *
     * @var string
     */
    protected $signature = 'sync:facebook-posts';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync facebook posts';

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
        $channels = Channel::where('account_type','page')->whereDoesntHave("processes", function($q){
            $q->where('process_name', 'syncFacebookPosts');
        })->get();

        $action = route('sync.facebook-posts');
        multiRequest($action, $channels);
    }
}
