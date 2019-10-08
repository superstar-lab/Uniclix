<?php

namespace App\Http\Controllers\Facebook;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Laravel\Socialite\Facades\Socialite;
use Carbon\Carbon;
use App\Models\Facebook\Channel;
use App\Models\Channel as GlobalChannel;

class ChannelController extends Controller
{

    public function add(Request $request){
        
        $user = auth()->user();
        if($user->channels()->count() >= $user->getLimit("account_limit")) return response()->json(["error" => "You have exceeded the account limit for this plan."], 403);

        $accessToken = $request->input("access_token");
        $accessToken = exchangeFBToken($accessToken)->getValue();
        $credentials = Socialite::driver("facebook")->userFromToken($accessToken);

        if(is_object($credentials) && !isset($credentials->error)){

            $existingChannel = Channel::where("email", $credentials->email)->first();
    
            if(!$existingChannel){
                $channel = $user->channels()->create(["type" => "facebook"]);
                $facebookChannel = $channel->details()->create([
                    "user_id" => $user->id, 
                    "email" => $credentials->email,
                    "name" => $credentials->name, 
                    "payload" => serialize($credentials), 
                    "access_token" => $credentials->token,
                    "account_type" => "profile"
                ]);
    
                $channel->select();
                $facebookChannel->select();
    
            }else{

                if($existingChannel->user_id == $user->id){
                    $global = $existingChannel->global;
                    $global->active = 1;
                    $global->save();
                    $facebookChannel = $existingChannel;
                    $facebookChannel->access_token = $credentials->token;
                    $global->select();
                    $facebookChannel->select();
                    $facebookChannel->save(); 
                }else{
                    return response()->json(['error' => 'Channel already exists with some other account'], 409);
                }
            }

            return $user->allFormattedChannels();
        }

        return response()->json(['error' => 'Channel could not be authenticated with facebook'], 401);
    }


    public function getAccounts(){
        $user = auth()->user();
        $channel = $user->selectedFacebookChannel();
        $response = collect($channel->getPages());

        $pages = [];
        if(isset($response["data"])){
            $pages = collect($response["data"])->map(function($page){
                $page["token"] = @$page["access_token"];
                $page["avatar"] = @$page["picture"]["data"]["url"];

                return $page;
            });
        }

        $response = collect($channel->getGroups());
        $groups = [];
        if(isset($response["data"])){
            $groups = collect($response["data"])->map(function($group) use ($channel){
                $group["token"] = @$channel->access_token;
                $group["avatar"] = @$group["picture"]["data"]["url"];

                return $group;
            });
        }

        $results = collect($pages)->merge(collect($groups));

        return $results;
    }

    public function saveAccounts(Request $request){

        try{
            $accounts = $request->get("accounts");
            $user = auth()->user();
            $channel = $user->selectedFacebookChannel();
    
            if(!$accounts) return;
            
            if($user->channels()->count() + count($accounts) > $user->getLimit("account_limit")) return response()->json(["error" => "You have exceeded the account limit for this plan."], 403);
            
            $accountData = [];
            foreach($accounts as $account){

                $existingChannel = $user->facebookChannels()->where("original_id", $account["id"])->where("parent_id", $channel->id)->first();

                if(!$existingChannel){

                    $newChannel = $user->channels()->create(["type" => "facebook"]);

                    $newChannel->details()->create([
                        "user_id" => $user->id,
                        "name" => $account["name"],
                        "original_id" => $account["id"],
                        "access_token" => $account["token"],
                        "parent_id" => $channel->id,
                        "payload" => serialize((object) $account),
                        "account_type" => $account["token"] == "group" ? "group" : "page"
                    ]);

                    $newChannel->select();

                }else{
                    $existingChannel->access_token = $account["token"];
                    $existingChannel->save();
                    $global = $existingChannel->global;
                    $global->active = 1;
                    $global->selected = 1;
                    $global->save();
                }
            }
    
        }catch(\Exception $e){
            return response()->json(["error" => $e->getMessage()], 400);
        }

        return response()->json(["message" => "Account added successfully."]);
    }
    
    public function select($id)
    {
        $user = auth()->user();
        $channel = $user->getChannel($id);

        if($channel){
            $channel->select($user);
            $channel->details->select($user);
        }

        return $user->allFormattedChannels();
    }
}
