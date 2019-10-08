<?php

namespace App\Http\Controllers\Twitter;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Thujohn\Twitter\Facades\Twitter;

class AuthController extends Controller
{

    public function login(Request $request)
    {   
        $verifier = $request->input("oauth_verifier");
        $token = $request->input("oauth_token");
        $clientUrl = config('frontendclient.client_url');
        return redirect("$clientUrl/redirect?oauth_verifier=$verifier&oauth_token=$token");
    }

    public function reverse(Request $request)
    {   
        Twitter::reconfig(['token' => '', 'secret' => '']);
        $token = Twitter::getRequestToken(route('api.twitter.login'));

        return response()->json($token);
    }

    public function access(Request $request)
    {
        Twitter::reconfig(["token" => $request->input("oauth_token"), "secret" => ""]);
        $token = Twitter::getAccessToken($request->input("oauth_verifier"));
        return response()->json($token);
    }

}
