<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

use App\Models\User;
use App\Models\Channel;
use App\Notifications\User\AccountDisconnected;
use App\Notifications\User\AfterFourteenDays;
use App\Notifications\User\AfterSevenDays;
use App\Notifications\User\AfterThirtyOneDays;
use App\Notifications\User\AfterTwelveHours;
use App\Notifications\User\AfterFourtyEightHours;
use App\Notifications\User\AfterTenDays;
use App\Notifications\User\AfterThirtyDays;
use App\Notifications\User\AfterTwentyDays;
use App\Notifications\User\FiveHoursAfterSignUp;
use App\Notifications\User\OneDayAfterSignUp;
use App\Notifications\User\UserSignUp;
use App\Notifications\User\UserFirstSignUp;
use App\Notifications\User\FourHoursAfterSignUp;
use App\Notifications\User\TwoHoursAfterSignUp;
use App\Notifications\User\TwentyEightHoursAfterSignUp;
use App\Notifications\User\NoPostScheduledAfterTenDays;
use App\Notifications\User\NoPostScheduledAfterThreeDays;
use App\Notifications\User\TwitterBoosterAfterFiveDays;
use App\Notifications\User\TwitterBoosterAfterThirtyFiveDays;
use App\Notifications\User\AfterThreeDays;
use App\Notifications\User\AfterFourDays;
use App\Notifications\User\AfterFiveDays;
use App\Notifications\User\AfterSixDays;

class Notifier extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'notify:users';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send notifications to users';

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
        Command::info("Fetching users...");
        if ($users = User::all()) {
            foreach ($users as $user) {
                $user->notify(new AfterFourteenDays($user));
                $user->notify(new AfterSevenDays($user));
                $user->notify(new AfterThirtyOneDays($user));
                $user->notify(new AfterTwelveHours($user));
                $user->notify(new FiveHoursAfterSignUp($user));
                $user->notify(new OneDayAfterSignUp($user));
                $user->notify(new TwentyEightHoursAfterSignUp($user));
                $user->notify(new AfterFourtyEightHours($user));
                $user->notify(new AfterTenDays($user));
                $user->notify(new AfterThirtyDays($user));
                $user->notify(new AfterTwentyDays($user));
                $user->notify(new UserSignUp());
                $user->notify(new UserFirstSignUp($user));
                $user->notify(new TwoHoursAfterSignUp($user));
                $user->notify(new FourHoursAfterSignUp($user));
                $user->notify(new NoPostScheduledAfterThreeDays($user));
                $user->notify(new NoPostScheduledAfterTenDays($user));
                $user->notify(new TwitterBoosterAfterFiveDays($user));
                $user->notify(new TwitterBoosterAfterThirtyFiveDays($user));
                $user->notify(new AfterThreeDays($user));
                $user->notify(new AfterFourDays($user));
                $user->notify(new AfterFiveDays($user));
                $user->notify(new AfterSixDays($user));
            }
        }

        if ($channels = Channel::all()) {
            foreach ($channels as $channel) {
                $channel->user->notify((new AccountDisconnected($channel)));
            }
        }

        Command::info("DONE");
    }
}
