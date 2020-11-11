<?php

namespace App\Http\Controllers\Pinterest;

use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use DirkGroenen\Pinterest\Pinterest;
use App\Http\Controllers\Controller;
use App\Models\Pinterest\Channel;

class ChannelController extends Controller
{

    public function add(Request $request){
        
        $user = auth()->user();
        if($user->countChannels() >= $user->getLimit("account_limit")) return response()->json(["error" => "You have exceeded the account limit for this plan."], 432);
        $accessToken = $request->input("access_token");
       

        $pinterest = new Pinterest(config("services.pinterest.client_id"), config("services.pinterest.client_secret"));
        $pinterest->auth->setOAuthToken($accessToken);
        $user = $pinterest->users->me(["fields" => "username,first_name,last_name,image[small,large]"]);

        $credentials = false;

        if($user){
            $credentials = new \stdClass();
            $credentials->nickname = $user->username;
            $credentials->name = $user->first_name." ".$user->last_name;
            $credentials->avatar = $user->image["large"]["url"];
            $credentials->token = $accessToken; 
        }

        if(is_object($credentials) && !isset($credentials->error)){

            $token = $credentials->token;
            $existingChannel = Channel::where("username", $credentials->nickname)->first();
    
            if(!$existingChannel){ 
                $user = auth()->user();
                $channel = $user->channels()->create(["type" => "pinterest"]);
                
                $pinterestChannel = $channel->details()->create([
                    "user_id" => $user->id, 
                    "name" => $credentials->name,
                    "username" => $credentials->nickname, 
                    "payload" => serialize($credentials), 
                    "access_token" => $token
                ]);
    
                $channel->select();
                $pinterestChannel->select();
    
            }else{
                if($existingChannel->user_id == $user->id){
                    $global = $existingChannel->global;
                    $global->active = 1;
                    $global->save();
                    $pinterestChannel = $existingChannel;
                    $pinterestChannel->access_token = $token;
                    $pinterestChannel->save();
                }else{
                    return response()->json(['error' => 'Channel already exists with some other account'], 409);
                }
            }

            return $user->allFormattedChannels();
        }

        return response()->json(['error' => 'Channel could not be authenticated with pinterest'], 401);
    }

    public function getBoards(Request $request)
    {   
        try{
            $user = auth()->user();
            $channel = $user->getChannel($request->input("id"));

            if(!$channel){
                return response()->json(["error" => "Channel not found."], 404);
            }

            return $channel->details->getBoards(); 
        }catch(\Exception $e){
            return getErrorResponse($e, $channel);
        }

    }
}