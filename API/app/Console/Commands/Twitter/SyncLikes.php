<?php

namespace App\Console\Commands\Twitter;

use Illuminate\Console\Command;
use App\Models\Twitter\Channel;

class SyncLikes extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sync:likes';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync likes of user';

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
            $q->where('process_name', 'syncLikes');
        })->get();

        $action = route('sync.likes');
        multiRequest($action, $channels);
    }
}
