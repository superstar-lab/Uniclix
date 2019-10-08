<?php

namespace App\Console\Commands\Twitter;

use Illuminate\Console\Command;
use App\Models\Twitter\Channel;

class SyncRetweets extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sync:retweets';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync retweets of user tweets';

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
            $q->where('process_name', 'syncRetweets');
        })->get();

        $action = route('sync.retweets');
        multiRequest($action, $channels);
    }
}
