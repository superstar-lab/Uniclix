<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\ScheduledPost;
use Carbon\Carbon;

class RunScheduledPosts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'run:scheduled';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Publish the scheduled posts';

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
        $scheduledPosts = ScheduledPost::where('posted', 0)
        ->where('scheduled_at', '<=', Carbon::now())
        ->where('approved', 1)
        ->whereNull('status')->get();
        
        $ids = $scheduledPosts->pluck('id');

        ScheduledPost::whereIn('id', $ids)->update(['posted' => 1]);
        
        multiRequest(route('publish'), $scheduledPosts);
    }
}
