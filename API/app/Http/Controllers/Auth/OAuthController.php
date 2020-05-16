<?php

namespace App\Http\Controllers\Auth;

use App\Models\Role;
use App\Models\User;
use App\Models\TeamUser;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class OAuthController extends Controller
{

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest');
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return \App\User
     */
    protected function create(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors'=>$validator->errors()], 400);
        }

        $user = User::create([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'role_id' => Role::first()->id,
            'password' => Hash::make($request->input('password')),
            'timezone' => $request->input('timezone')
        ]);

        $email = $request->input('email');
        $user_register = User::where('email', $email)->first();
        
        $created_at = strtotime($user_register['created_at']);
        $trial_ends_at = date("Y-m-d h:i:s", $created_at + 14 * 86400);

        \DB::table('users')->where('email', $email)->update(['trial_ends_at' => $trial_ends_at]);
        
        $user->notify(new \App\Notifications\User\UserSignUp());

        $fourHours = $user->created_at->addMinutes(30);
        $user->notify(new \App\Notifications\User\UserFirstSignUp());

        $fourHours = $user->created_at->addMinutes(60 * 4);
        $user->notify((new \App\Notifications\User\FourHoursAfterSignUp($user))->delay($fourHours));

        $twoHours = $user->created_at->addMinutes(60 * 2);
        $user->notify((new \App\Notifications\User\TwoHoursAfterSignUp($user))->delay($twoHours));

        $oneDay = $user->created_at->addMinutes(60 * 24);
        $user->notify((new \App\Notifications\User\OneDayAfterSignUp($user))->delay($oneDay));

        $twentyeightHours = $user->created_at->addMinutes(60 * 28);
        $user->notify((new \App\Notifications\User\TwentyEightHoursAfterSignUp($user))->delay($twentyeightHours));

        $threeDays = $user->created_at->addMinutes(60 * 24 * 3);
        $user->notify((new \App\Notifications\User\AfterThreeDays($user))->delay($threeDays));

        $sixDays = $user->created_at->addMinutes(60 * 24 * 6);
        $user->notify((new \App\Notifications\User\AfterThreeDays($user))->delay($sixDays));

        $sixDaysSecond = $user->created_at->addMinutes(60 * 24 * 6 + 60 * 3);
        $user->notify((new \App\Notifications\User\AfterSixDays($user))->delay($sixDaysSecond));

        $tenDays = $user->created_at->addMinutes(60 * 24 * 9);
        $user->notify((new \App\Notifications\User\AfterThreeDays($user))->delay($tenDays));

        $fifteenDays = $user->created_at->addMinutes(60 * 24 * 15);
        $user->notify((new \App\Notifications\User\AfterThreeDays($user))->delay($fifteenDays));

        $fourDays = $user->created_at->addMinutes(60 * 24 * 4);
        $user->notify((new \App\Notifications\User\AfterFourDays($user))->delay($fourDays));

        $fiveDays = $user->created_at->addMinutes(60 * 24 * 5);
        $user->notify((new \App\Notifications\User\AfterFiveDays($user))->delay($fiveDays));

        $sevenDaysAM = $user->created_at->addMinutes(60 * 24 * 7);
        $user->notify((new \App\Notifications\User\AfterSevenDays($user))->delay($sevenDaysAM));

        $sevenDaysPM = $user->created_at->addMinutes(60 * 24 * 7 + 60 * 12);
        $user->notify((new \App\Notifications\User\AfterSevenDaysSecond($user))->delay($sevenDaysPM));

        $eightDaysAM = $user->created_at->addMinutes(60 * 24 * 8);
        $user->notify((new \App\Notifications\User\AfterEightDays($user))->delay($eightDaysAM));

        $eightDaysPM = $user->created_at->addMinutes(60 * 24 * 8 + 60 * 12);
        $user->notify((new \App\Notifications\User\AfterEightDaysSecond($user))->delay($eightDaysPM));

        $elevenDays = $user->created_at->addMinutes(60 * 24 * 11);
        $user->notify((new \App\Notifications\User\AfterElevenDays($user))->delay($elevenDays));

        $twelveDaysAM = $user->created_at->addMinutes(60 * 24 * 12);
        $user->notify((new \App\Notifications\User\AfterTwelveDays($user))->delay($twelveDaysAM));

        $twelveDaysPM = $user->created_at->addMinutes(60 * 24 * 12 + 60 * 12);
        $user->notify((new \App\Notifications\User\AfterTwelveDaysSecond($user))->delay($twelveDaysPM));

        $fourteenDays = $user->created_at->addMinutes(60 * 24 * 14);
        $user->notify((new \App\Notifications\User\AfterFourteenDays($user))->delay($fourteenDays));

        $fifteenDaysSecond = $user->created_at->addMinutes(60 * 24 * 15 + 60 * 3);
        $user->notify((new \App\Notifications\User\AfterFifteenDays($user))->delay($fifteenDaysSecond)); 

        $token = $user->createToken("Password Token");

        //The UI needs this value before the portal gets loaded
        $token->token->accessLevel = $user->getAccessLevel();

        return response()->json($token);
    }

    protected function login(Request $request)
    {
        $email = $request->input('email');
        $password = $request->input('password');

        $user = User::where('email', $email)->first();

        if(!$user || !Hash::check($password, $user->password)) return response()->json(["error" => "Incorrect email or password."], 404);

        $user_id = $user->id;
        // is our way to activate invited users
        TeamUser::where('member_id', $user_id)->update(['is_pending' => 0]);
    
        $token = $user->createToken("Password Token");

        //The UI needs this value before the portal gets loaded
        $token->token->accessLevel = $user->getAccessLevel();

        return response()->json($token);
    }
}
