<?php

namespace App\Http\Controllers\Linkedin;

use App\Models\Channel as GlobalChannel;
use App\Models\ScheduleDefaultTime;
use App\Models\ScheduleTime;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use App\Http\Controllers\Controller;
use App\Models\Linkedin\Channel;

class ChannelController extends Controller
{

    public function add(Request $request){

        $user = auth()->user();

        if($user->countChannels() > $user->getLimit("account_limit")) {
            return response()->json(["message" => "limit of accounts exceded"], 432);
        }

        $accessToken = $request->input("access_token");

        $credentials = Socialite::driver("linkedin")->userFromToken($accessToken);

        if(is_object($credentials) && !isset($credentials->error)){

            $token = $credentials->token;

            $existingChannel = Channel::where("email", $credentials->email)->first();

            if(!$existingChannel){
                $channel = $user->channels()->create(["type" => "linkedin"]);
                $linkedinChannel = $channel->details()->create([
                "user_id" => $user->id,
                "name" => $credentials->name,
                "email" => $credentials->email,
                "payload" => serialize($credentials),
                "account_type" => "profile",
                "access_token" => $token]);

                $channel->select();
                $linkedinChannel->select();

            }else{
                if($existingChannel->user_id == $user->id){
                    $global = $existingChannel->global;
                    $global->active = 1;
                    $global->save();
                    $linkedinChannel = $existingChannel;
                    $linkedinChannel->access_token = $token;
                    $global->select();
                    $linkedinChannel->select();
                    $linkedinChannel->save();
                }else{
                    return response()->json(['error' => 'Channel already exists with some other account'], 409);
                }
            }

            return $user->allFormattedChannels();
        }

        return response()->json(['error' => 'Channel could not be authenticated with linkedin'], 401);
    }

    public function getPages(){
        $user = auth()->user();
        $channel = $user->selectedLinkedinChannel();
        $pages = collect($channel->getPages());
        return $pages;
    }

    public function savePages(Request $request){

        try{
            $pages = $request->get("pages");
            $user = auth()->user();
            $channel = $user->selectedLinkedinChannel();

            if(!$pages) return;

            if($user->countChannels() + count($pages) > $user->getLimit("account_limit")) return response()->json(["error" => "You have exceeded the account limit for this plan."], 432);

            $accountData = [];
            foreach($pages as $account){

                $existingChannel = $user->linkedinChannels()->where("original_id", $account["id"])->where("parent_id", $channel->id)->first();

                if(!$existingChannel){

                    $newChannel = $user->channels()->create(["type" => "linkedin"]);

                    $newChannel->details()->create([
                        "user_id" => $user->id,
                        "name" => $account["name"],
                        "original_id" => $account["id"],
                        "access_token" => $channel->access_token,
                        "parent_id" => $channel->id,
                        "payload" => serialize((object) $account),
                        "account_type" => "page"
                    ]);

                    //$newChannel->select();

                }else{
                    $existingChannel->access_token = $channel->access_token;
                    $existingChannel->save();
                    $global = $existingChannel->global;
                    $global->active = 1;
                    //$global->selected = 1;
                    $global->save();
                }
            }

        }catch(\Exception $e){
            return response()->json(["error" => $e->getMessage()], 400);
        }

        return response()->json(["message" => "Account added successfully."]);
    }
}
