<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Mail\Message;
use Illuminate\Support\Facades\Password;
use App\Models\User;
use App\Models\Team;
use App\Models\TeamUser;
use App\Models\TeamUserChannel;
use App\Notifications\SendPasswordResetInviteNotification;

class TeamController extends Controller
{
    private $user;
    private $selectedChannel;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            $this->user = auth()->user();
            $this->selectedChannel = $this->user->selectedChannel();
            return $next($request);
        });
    }


    public function getTeams()
    {   
        $user = $this->user;
        $teamIds = TeamUser::where("member_id", $user->id)
        ->orWhere("owner_id", $user->id)->pluck("team_id");

        $team = $user->teams()->first();

        if(!$team){
            $team = $user->teams()->create([
                "name" => $user->organization_name ? $user->organization_name : "My Organization" 
            ]);
        }

        return Team::whereIn("id", $teamIds)->orWhere("user_id", $user->id)->get();
    }

    public function getMembers(Request $request)
    {   
        $teamId = $request->input("teamId");
        if(!$teamId || $teamId == 'false') return [];

        $team = Team::find($teamId);

        if(!$team) return response()->json(["error" => "Team not found."], 404);

        $members = $team->members()->with("details")->orderBy("created_at", "DESC")->get();

        return collect($members)->map(function($member){
            $member->assignedChannels = $member->formattedChannels(true);
            return $member;
        });
    }

    public function addOrUpdate(Request $request)
    {   
        $user = $this->user;

        if($user->teamMembers()->count() + 1 >= $user->getLimit("team_accounts")) return response()->json(["error" => "You have exceeded the account limit for your current plan."], 403);

        $name = $request->input('name');
        $email = $request->input('email');
        $admin = $request->input('isAdmin');
        $teamId = $request->input('teamId');
        $assignedChannels = $request->input('assignedChannels');

        if(!$teamId || $teamId == 'false'){
            $team = $user->teams()->first();
            
            if(!$team){
                $team = $user->teams()->create([
                    "name" => $user->organization_name ? $user->organization_name : "My Organization" 
                ]);
            }
        }else{
            
            $team = Team::find($teamId);

            if(!$team) return response()->json(["error" => "Team not found."], 404);

            if($team->user_id != $user->id && !$team->members()->where("member_id", $user->id)->where("is_admin", 1)->exists()){
                return response()->json(["error" => "You don't have permission to perform this action."], 403);
            }
        }
        
        if($team->user_id === $user->id && $email === $user->email) return response()->json(["error" => "You are already the owner of this team."], 409);

        $member = User::where("email", $email)->first();

        if(!$member){
            $member = User::create([
                "email" => $email,
                "name" => $name,
                "role_id" => 1,
            ]);

            $user_register = User::where('email', $email)->first();
            $created_at = strtotime($user_register['created_at']);
            $trial_ends_at = date("Y-m-d h:i:s", $created_at + 14 * 86400);
            User::where('email', $email)->update(['trial_ends_at' => $trial_ends_at]);
            
        }else{
            $member->name = $name;
            $member->email = $email;
            $member->save();
        }        

        if($teamMember = $team->members()->where("member_id", $member->id)
        ->orWhere("owner_id", $member->id)->first()){
            
            $teamMember->is_admin = $admin ? 1 : 0;
            $teamMember->save();
        }else{
            
            $teamMember = $team->members()->create([
                "member_id" => $member->id,
                "owner_id" => $user->id,
                "is_admin" => $admin ? 1 : 0,
                "is_pending" => 1,
            ]);
            

            $token = Password::getRepository()->create($member);
            $member->notify(new SendPasswordResetInviteNotification($token, $user));
        }

        $team->channels()->where("member_id", $member->id)->delete();

        $assignedChannelData = [];

        foreach($assignedChannels as $channel){
            $assignedChannelData[] = [
                "member_id" => $member->id,
                "owner_id" => $user->id,
                "approver_id" => $user->id,
                "channel_id" => $channel["id"],
                "team_id" => $team->id,
                "role" => $channel["permissionLevel"] === "publisher" ? "publisher" : "member"
            ];
        }

        if(count($assignedChannelData))
        TeamUserChannel::insert($assignedChannelData);
        
        return response()->json(["message" => "New member has been added"], 200);
    }

    public function remove(Request $request)
    {   
        $user = $this->user;
        $memberId = $request->input("memberId");
        $teamId = $request->input("teamId");

        $team = Team::find($teamId);

        if($team->user_id != $user->id && !$team->members()->where("member_id", $user->id)->where("is_admin", 1)->exists()){
            return response()->json(["error" => "You don't have permission to remove members from this team"], 403);
        }

        $team->members()->where("member_id", $memberId)->delete();
        $team->channels()->where("member_id", $memberId)->delete();

        return response()->json(["message" => "Member removed successfuly."]);
    }

    public function getMembersByPending(Request $request) {
        $user = $this->user;
        $teamId = $request->input("teamId");

        if(!$teamId || $teamId == 'false') return [];
        $team = Team::find($teamId);
        $members = $team
            ->members()
            ->where([['team_id', '=', $teamId],['is_pending', '=', 1]])
            ->with("details")
            ->orderBy("created_at", "DESC")
            ->get();

        return collect($members)->map(function($member){
            $member->assignedChannels = $member->formattedChannels(true);
            return $member;
        });

        return $members;
    }
}
