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
use Mail;
use App\Mail\UserFirstSignUp;
use App\Mail\FourHoursAfterSignUp;
use App\Mail\TwoHoursAfterSignUp;
use App\Mail\OneDayAfterSignUp;
use App\Mail\TwentyEightHoursAfterSignUp;
use App\Mail\AfterThreeDays;
use App\Mail\AfterSixDays;
use App\Mail\AfterFourDays;
use App\Mail\AfterFiveDays;
use App\Mail\AfterSevenDays;
use App\Mail\AfterSevenDaysSecond;
use App\Mail\AfterEightDays;
use App\Mail\AfterEightDaysSecond;
use App\Mail\AfterElevenDays;
use App\Mail\AfterTwelveDays;
use App\Mail\AfterTwelveDaysSecond;
use App\Mail\AfterFourteenDays;
use App\Mail\AfterFifteenDays;
use App\Models\ScheduleTime;
use App\Models\ScheduleDefaultTime;


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
            'timezone' => $request->input('timezone'),
            'isInvited' => $request->input('isInvited')
        ]);

        $email = $request->input('email');
        $user_register = User::where('email', $email)->first();

        $created_at = strtotime($user_register['created_at']);
        $trial_ends_at = date("Y-m-d h:i:s", $created_at + 14 * 86400);

        \DB::table('users')->where('email', $email)->update(['trial_ends_at' => $trial_ends_at]);

        // $user->notify(new \App\Notifications\User\UserSignUp());


        Mail::to($email)->send(new UserFirstSignUp($user));
        Mail::to($email)->send(new FourHoursAfterSignUp($user));
        Mail::to($email)->send(new TwoHoursAfterSignUp($user));
        Mail::to($email)->send(new OneDayAfterSignUp($user));
        Mail::to($email)->send(new TwentyEightHoursAfterSignUp($user));
        Mail::to($email)->send(new AfterThreeDays($user));
        Mail::to($email)->send(new AfterSixDays($user));
        Mail::to($email)->send(new AfterFourDays($user));
        Mail::to($email)->send(new AfterFiveDays($user));
        Mail::to($email)->send(new AfterSevenDays($user));
        Mail::to($email)->send(new AfterSevenDaysSecond($user));
        Mail::to($email)->send(new AfterEightDays($user));
        Mail::to($email)->send(new AfterEightDaysSecond($user));
        Mail::to($email)->send(new AfterElevenDays($user));
        Mail::to($email)->send(new AfterTwelveDays($user));
        Mail::to($email)->send(new AfterTwelveDaysSecond($user));
        Mail::to($email)->send(new AfterFourteenDays($user));
        Mail::to($email)->send(new AfterFifteenDays($user));

        $defaultTimes = ScheduleDefaultTime::all()->pluck("default_time");

        for ($i = 0; $i < 7; $i++) {
            foreach ($defaultTimes as $defaultTime) {
                ScheduleTime::create([
                    'user_id' => $user->id,
                    'time_id' => uniqid(),
                    'schedule_week' => $i,
                    'schedule_time' => $defaultTime,
                ]);
            }
        }

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

    protected function autologin(Request $request)
    {
        $email = $request->input('email');
        $password = $request->input('password');

        $user = User::where('email', $email)->first();

        if(!$user || ($password != $user->password)) return response()->json(["error" => "Incorrect email or password."], 404);

        $user_id = $user->id;
        // is our way to activate invited users
        TeamUser::where('member_id', $user_id)->update(['is_pending' => 0]);

        $token = $user->createToken("Password Token");

        //The UI needs this value before the portal gets loaded
        $token->token->accessLevel = $user->getAccessLevel();

        return response()->json($token);
    }
}
