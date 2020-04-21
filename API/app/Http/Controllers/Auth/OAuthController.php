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
        // $user->notify(new \App\Notifications\User\UserSignUp());

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
        $user_id = User::where('email', $email)->first()->id;
        TeamUser::where('member_id', $user_id)->update(['is_pending' => 0]);

        if(!$user || !Hash::check($password, $user->password)) return response()->json(["error" => "Incorrect email or password."], 404);
        $token = $user->createToken("Password Token");

        //The UI needs this value before the portal gets loaded
        $token->token->accessLevel = $user->getAccessLevel();

        return response()->json($token);
    }
}
