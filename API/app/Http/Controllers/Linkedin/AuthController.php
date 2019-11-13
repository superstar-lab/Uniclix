<?php

namespace App\Http\Controllers\Linkedin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AuthController extends Controller
{

    public function accessToken(Request $request)
    {   
        try{
            $code = $request->input("code");
            $appUrl = config('app.url');
            $clientUrl = config('frontendclient.client_url');
            $clientId = config('services.linkedin.client_id');
            $clientSecret = config('services.linkedin.client_secret');
            $redirectUrl = "{$appUrl}/api/linkedin/callback";
            $params = "grant_type=authorization_code&state=123456&code={$code}&redirect_uri={$redirectUrl}&client_id={$clientId}&client_secret={$clientSecret}";
            $url = "https://www.linkedin.com/oauth/v2/accessToken?{$params}";

            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_VERBOSE, 1);
            curl_setopt($ch, CURLOPT_HEADER, 1);
            $response = curl_exec($ch);

            $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
            $header = substr($response, 0, $header_size);
            $body = substr($response, $header_size);

            $body = json_decode($body);

            $token = @$body->access_token;
            
            return redirect("$clientUrl/redirect?accessToken=$token");
        }catch(\Exception $e){
            return response()->json(["error" => "Something went wrongssss"], 400);
        }


        
    }

}