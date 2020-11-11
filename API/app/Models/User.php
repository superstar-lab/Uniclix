<?php

namespace App\Models;

use App\Traits\Permissible;
use Laravel\Passport\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Cashier\Billable;
use Carbon\Carbon;
use App\Models\Facebook\Channel as FacebookChannel;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable, Permissible, Billable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'role_id', 'username', 'password', 'website', 'timezone', 'usage_reason', 'isInvited'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];


    public function channels()
    {
        return $this->hasMany(Channel::class);
    }

    public function memberChannels()
    {
        return $this->hasMany(TeamUserChannel::class, "member_id");
    }

    public function approverChannels()
    {
        return $this->hasMany(TeamUserChannel::class, "approver_id");
    }

    public function teams()
    {
        return $this->hasMany(Team::class);
    }

    public function teamMembers()
    {
        return $this->hasMany(TeamUser::class, "owner_id");
    }

    public function hasPublishPermission($channel)
    {
        if(!$channel) return false;

        if($this->id === $channel->user_id) return true;

        return $this->memberChannels()->where("channel_id", $channel->id)->where("role", "publisher")->exists();
    }

    public function getChannel($id)
    {
        $channel = $this->channels()->find($id);

        if(!$channel) {
            $channel = $this->memberChannels()->where("channel_id", $id)->first();
            if($channel) $channel = $channel->channel;
        }

        if(!$channel) {
            $channel = $this->approverChannels()->where("channel_id", $id)->first();
            if($channel) $channel = $channel->channel;
        }

        return $channel;
    }

    public function formattedChannels(){

        $selectedChannel = $this->selectedChannel();
        $selectedTwitterChannel = $this->selectedTwitterChannel();

        if($channels = $this->channels()->get()){

            return collect($channels)->map(function($channel) use ($selectedChannel, $selectedTwitterChannel) {
                $channel->details = @$channel->details;
                $channel->selected = $selectedChannel && $selectedChannel->id == $channel->id ? 1 : 0;
                if($channel->details){
                    if($channel->details->account_type != "page" && $channel->type != "linkedin"){
                        $avatar = @$channel->details->getAvatar();
                    }
                    $channel->details->payload = @unserialize($channel->details->payload);
                    $channel->details->selected = $channel->type == "twitter" && $selectedTwitterChannel->channel_id == $channel->id ? 1 : $channel->details->selected;
                    $channel->avatar = @$avatar ? @$avatar : @$channel->details->payload->avatar;
                    $channel->name = @$channel->details->payload->name;
                    $channel->username = @$channel->details->payload->nickname;
                }
                return $channel;
            });
        }
        return [];
    }

    public function formattedMemberChannels($markSelected = false){
        $selectedChannel = $this->selectedChannel();
        $selectedTwitterChannel = $this->selectedTwitterChannel();
        if($channels = $this->memberChannels()->get()){
            return collect($channels)->map(function($channel) use ($markSelected, $selectedChannel, $selectedTwitterChannel){
                        $permissionLevel = $channel->role;
                        $teamId = $channel->team_id;
                        $approverId = $channel->approver_id;
                        $channel = $channel->channel;
                        $channel->details = @$channel->details;
                        $channel->permissionLevel = $permissionLevel;
                        $channel->teamId = $teamId;
                        $channel->approverId = $approverId;
                        $channel->selected = $selectedChannel && $selectedChannel->id == $channel->id ? 1 : 0;

                        if($markSelected) $channel->selected = 1;

                        if($channel->details){
                            if($channel->details->account_type != "page" && $channel->type != "linkedin"){
                                $avatar = @$channel->details->getAvatar();
                            }
                            $channel->details->payload = @unserialize($channel->details->payload);
                            $channel->avatar = @$avatar ? @$avatar : @$channel->details->payload->avatar;
                            $channel->name = @$channel->details->payload->name;
                            $channel->username = @$channel->details->payload->nickname;
                            $channel->details->selected = $channel->type == "twitter" && $selectedTwitterChannel->channel_id == $channel->id ? 1 : $channel->details->selected;
                        }

                        return $channel;
                    });
        }

        return [];
    }

    public function allFormattedChannels(){

        return $this->formattedChannels()->merge($this->formattedMemberChannels());
    }

    public function selectedChannelModel()
    {
        return $this->hasMany(SelectedChannel::class);
    }

    public function selectedChannel()
    {
        if($selectedChannelModel = $this->selectedChannelModel()->where("network", "global")->first()){
            $channel = $this->getChannel($selectedChannelModel->channel_id);
            if($channel) return $channel;
        }

        $channelIds = $this->memberChannels()->pluck("channel_id")->merge($this->channels()->pluck("id"));
        return Channel::whereIn("id", $channelIds)->first();
    }

    public function twitterChannels()
    {
        $channelIds = $this->memberChannels()->pluck("channel_id")->merge($this->channels()->pluck("id"));
        return Twitter\Channel::whereIn("channel_id", $channelIds);
    }

    public function facebookChannels()
    {
        $channelIds = $this->memberChannels()->pluck("channel_id")->merge($this->channels()->pluck("id"));
        return Facebook\Channel::whereIn("channel_id", $channelIds);
    }

    public function linkedinChannels()
    {
        $channelIds = $this->memberChannels()->pluck("channel_id")->merge($this->channels()->pluck("id"));
        return Linkedin\Channel::whereIn("channel_id", $channelIds);
    }

    public function pinterestChannels()
    {
        $channelIds = $this->memberChannels()->pluck("channel_id")->merge($this->channels()->pluck("id"));
        return Pinterest\Channel::whereIn("channel_id", $channelIds);
    }

    public function selectedTwitterChannel()
    {
        if($selectedChannelModel = $this->selectedChannelModel()->where("network", "twitter")->first()){
            $channel = $this->getChannel($selectedChannelModel->channel_id);

            if($channel) return $channel->details;
        }

        return $this->twitterChannels()->first();
    }

    public function selectedFacebookChannel()
    {
        if($selectedChannelModel = $this->selectedChannelModel()->where("network", "facebook")->first()){
            $channel = $this->getChannel($selectedChannelModel->channel_id);

            if($channel) return $channel->details;
        }

        return $this->facebookChannels()->first();
    }

    public function selectedLinkedinChannel()
    {
        if($selectedChannelModel = $this->selectedChannelModel()->where("network", "linkedin")->first()){
            $channel = $this->getChannel($selectedChannelModel->channel_id);

            if($channel) return $channel->details;
        }

        return $this->linkedinChannels()->first();
    }

    public function selectedPinterestChannel()
    {
        if($selectedChannelModel = $this->selectedChannelModel()->where("network", "pinterest")->first()){
            $channel = $this->getChannel($selectedChannelModel->channel_id);

            if($channel) return $channel->details;
        }

        return $this->pinterestChannels()->first();
    }

    public function topics()
    {
        return $this->hasMany(Topic::class);
    }

    public function tabs()
    {
        return $this->hasMany(Tab::class);
    }

    public function locations()
    {
        return $this->hasMany(Location::class);
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function roleAddons()
    {
        return $this->belongsToMany(RoleAddon::class, "user_role_addons", "user_id", "addon_id");
    }

    public function isOld($hours)
    {
        return strtotime($this->created_at) <= strtotime(Carbon::now()->subHours($hours));
    }

    public function getAllPosts()
    {
        return ScheduledPost::with('category')
            ->orderBy('scheduled_at', 'asc')
            ->get();
    }

    public function getAllScheduledPosts($from_date = null, $to_date = null)
    {
        $id = $this->id;

        if($from_date == null && $to_date == null){
            return ScheduledPost::with('category')->select('scheduled_posts.*')
            ->orderBy('scheduled_at', 'asc')->leftJoin('channels', 'scheduled_posts.channel_id', '=', 'channels.id')
            ->where("approved", 1)
            ->where("user_id", $id)
            ->get();
        } else if ($from_date == null) {
            // We return past post from a given date
            return ScheduledPost::with('category')->select('scheduled_posts.*')
                ->orderBy('scheduled_at', 'asc')->leftJoin('channels', 'scheduled_posts.channel_id', '=', 'channels.id')
                ->where("approved", 1)
                ->whereDate('scheduled_at', '<=', $to_date)
                ->where("user_id", $id)
                ->get();
        } else if($to_date == null) {
            // We return future post from a given date
            return ScheduledPost::with('category')->select('scheduled_posts.*')
                ->orderBy('scheduled_at', 'asc')->leftJoin('channels', 'scheduled_posts.channel_id', '=', 'channels.id')
                ->where("approved", 1)
                ->whereDate('scheduled_at', '>=', $from_date)
                ->where("user_id", $id)
                ->get();
        } else {
            return ScheduledPost::with('category')->select('scheduled_posts.*')
            ->orderBy('scheduled_at', 'asc')->leftJoin('channels', 'scheduled_posts.channel_id', '=', 'channels.id')
            ->where("approved", 1)
            ->whereDate('scheduled_at', '>=', $from_date)
            ->whereDate('scheduled_at', '<=', $to_date)
            ->where("user_id", $id)
            ->get();
        }
    }

    public function getMemberScheduledPosts($from_date = null, $to_date = null)
    {
        $id = $this->id;

        if($from_date == null || $to_date == null){
            return ScheduledPost::with('category')->select('scheduled_posts.*')
            ->orderBy('scheduled_at', 'asc')->leftJoin('team_user_channels', 'scheduled_posts.channel_id', '=', 'team_user_channels.channel_id')
            ->where("approved", 1)
            ->where("team_user_channels.member_id", $id)
            ->get();
        } else {
            return ScheduledPost::with('category')->select('scheduled_posts.*')
            ->orderBy('scheduled_at', 'asc')->leftJoin('team_user_channels', 'scheduled_posts.channel_id', '=', 'team_user_channels.channel_id')
            ->where("approved", 1)
            ->whereDate('scheduled_at', '>=', $from_date)
            ->whereDate('scheduled_at', '<=', $to_date)
            ->where("team_user_channels.member_id", $id)
            ->get();
        }
    }

    public function getAllUnapprovedPosts()
    {
        return ScheduledPost::with('category')
            ->where("approved", 0)
            ->where('posted', 0)
            ->orderBy('scheduled_at', 'asc')
            ->get();
    }

    public function getRemainDate($user_id)
    {
        $selectedUser = $this->where('id', $user_id)->first();
        $trial_ends_at = $selectedUser['trial_ends_at'];
        return $trial_ends_at;
    }

    public function countChannels()
    {
        // We need to filter the facebook profile accounts from the counting
        $facebookChannels = $this->hasMany(FacebookChannel::class)->where('parent_id', '!=', null)->count();
        $restOfChannels = $this->hasMany(Channel::class)->where('type', '!=', 'facebook')->count();
        return $facebookChannels + $restOfChannels;
    }

    // Function that let us know if the user is an member, admin or owner
    public function getAccessLevel()
    {
        $team = '';
        try {
            $team = TeamUser::where('member_id', $this->id)->first();
        } catch(\Exception $error) {

        }

        // If the user is not in the table, we assume it is an owner.
        // If it's in the table, we check the value
        return $team
            ? $team->is_admin
                ? 'admin'
                : 'member'
            : 'owner';
    }

    public static function updateActiveUsers()
    {
        \DB::table('users')
            ->leftJoin('subscriptions', 'subscriptions.user_id', '=', 'users.id')
            ->where(function ($q) {
                $q->where('users.trial_ends_at', '<', Carbon::now())
                    ->orWhere(function ($r){
                        $r->whereNull('users.trial_ends_at')
                            ->where(function ($s){
                                $s->whereNull('subscriptions.id')
                                    ->orWhere('subscriptions.ends_at', '<', Carbon::now());
                            });
                    });
            })
            ->update(['users.active' => 0]);

        \DB::table('users')
            ->leftJoin('subscriptions', 'subscriptions.user_id', '=', 'users.id')
            ->where(function ($q) {
                $q->where('users.trial_ends_at', '>', Carbon::now())
                    ->orWhere(function ($r){
                        $r->where(function ($s){
                            $s->whereNull('subscriptions.ends_at')
                                ->orWhere('subscriptions.ends_at', '>', Carbon::now());
                        })->whereNotNull('subscriptions.id');
                    });
            })
            ->update(['users.active' => 1, 'users.updated_at' => Carbon::now()]);
    }
}
