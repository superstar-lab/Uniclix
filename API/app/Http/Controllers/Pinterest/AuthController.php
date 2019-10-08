<?php

namespace App\Http\Controllers\Pinterest;

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
            $clientId = config('services.pinterest.client_id');
            $clientSecret = config('services.pinterest.client_secret');
            $params = "grant_type=authorization_code&client_id=$clientId&client_secret=$clientSecret&code=$code";
            $url = "https://api.pinterest.com/v1/oauth/token";

            $ch = curl_init();

            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_POST, TRUE);
            curl_setopt($ch, CURLOPT_BINARYTRANSFER, TRUE);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $params);

            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_VERBOSE, 1);
            curl_setopt($ch, CURLOPT_HEADER, 1);

            $response = curl_exec($ch);

            $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
            $header = substr($response, 0, $header_size);
            $body = substr($response, $header_size);

            $body = json_decode($body);
        }catch(\Exception $e){
            return response()->json(["error" => "Something went wrong"], 400);
        }

        if(!property_exists($body, "access_token")) return response()->json(["error" => "Something went wrong"], 400);
        return redirect("$clientUrl/redirect?accessToken=$body->access_token");
    }

}