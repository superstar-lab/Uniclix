<?php

namespace App\Http\Controllers\Twitter;

use App\Models\Channel as GlobalChannel;
use App\Models\ScheduleDefaultTime;
use App\Models\ScheduleTime;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use App\Http\Controllers\Controller;
use App\Models\Twitter\Channel;
use Carbon\Carbon;

class ChannelController extends Controller
{

    public function add(Request $request){
        $user = auth()->user();
        $trial_ends_at = $user->trial_ends_at;
        $current_date = Carbon::now()->timestamp;
        $current_role_name = $user->role->name;
        if($trial_ends_at >= $current_date && !$current_role_name) {
            return response()->json(["message" => "freetrial"]);
        }
        $channels_count = $user->countChannels();
        if($current_role_name == 'basic' && $channels_count >= $user->getLimit("account_limit")) {
            return response()->json(["message" => "limit of accounts exceded"], 432);
        } else if($current_role_name == 'premium' && $channels_count >= $user->getLimit("account_limit")) {
            return response()->json(["message" => "limit of accounts exceded"], 432);
        } else if($current_role_name == 'pro' && $channels_count >= $user->getLimit("account_limit")) {
            return response()->json(["message" => "limit of accounts exceded"], 432);
        }

        $accessToken = $request->input("oauth_token");
        $accessTokenSecret = $request->input("oauth_token_secret");

        $credentials = Socialite::driver("twitter")->userFromTokenAndSecret($accessToken, $accessTokenSecret);

        if(is_object($credentials) && !isset($credentials->error)){

            $token = [
                "oauth_token" => $credentials->token,
                "oauth_token_secret" => $credentials->tokenSecret
            ];

            $existingChannel = Channel::where("username", $credentials->nickname)->first();

            if(!$existingChannel){
                $channel = $user->channels()->create(["type" => "twitter"]);
                $twitterChannel = $channel->details()->create([
                "user_id" => $user->id,
                "username" => $credentials->nickname,
                "payload" => serialize($credentials),
                "access_token" => json_encode($token)]);

                $channel->select();
                $twitterChannel->select();

                /*
                 * Sync following and followers in the background
                 */
                multiRequest(route("sync.follower.ids"), [$twitterChannel], ["sleep" => 0]);
                multiRequest(route("sync.following.ids"), [$twitterChannel], ["sleep" => 0]);
            }else{

                if($existingChannel->user_id == $user->id){
                    $global = $existingChannel->global;
                    $global->active = 1;
                    $global->save();
                    $twitterChannel = $existingChannel;
                    $twitterChannel->access_token = json_encode($token);
                    $twitterChannel->save();
                }else{
                    return response()->json(['error' => 'Channel already exists with some other account'], 409);
                }

            }

            return $user->allFormattedChannels();
        }

        return response()->json(['error' => 'Channel could not be authenticated with twitter'], 401);
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
