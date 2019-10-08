<?php

namespace App\Console\Commands\Twitter;

use Illuminate\Console\Command;
use App\Models\Twitter\Channel;

class SyncTweets extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sync:tweets';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Synchronize user tweets';

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
        $channels = Channel::whereDoesntHave("processes", function($q){
            $q->where('process_name', 'syncTweets');
        })->get();

        $action = route('sync.tweets');
        multiRequest($action, $channels);
    }
}
