<?php

namespace App\Traits;
use App\Models\SelectedChannel;
use Auth;


trait Selectable
{
    public function select($user = false)
    { 
        $user = $user ? $user : $this->user;
        $channelId = $this->id;
        $network = "global";

        if (!($this instanceof \App\Models\Channel)) {
            $network = $this->global->type;
            $channelId = $this->channel_id;
        } 

        SelectedChannel::where("user_id", $user->id)->where("network", $network)->delete();

        SelectedChannel::create([
            "user_id" => $user->id,
            "channel_id" => $channelId,
            "network" => $network
        ]);
    }
}