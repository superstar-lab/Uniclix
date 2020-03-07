<?php

namespace App\Traits;


use App\Models\Role;
use App\Models\RoleLimit;
use App\Models\RoleAddon;
use App\Models\User;
use Carbon\Carbon;

trait Permissible
{
    private $user;
    public function hasRole($roleName)
    {  
        if($roleName=="free") return true;
        
        if ($this->subscribedToPlan($roleName, 'main') || $this->subscribedToPlan($roleName."_annual", 'main')) {
           return Role::where("id", $this->role_id)->where("name", strtolower($roleName))->exists();
        }

        return $this->hasAddon($roleName);
    }

    public function hasPermission($permission)
    {
        
        $role = Role::where("id", $this->role_id)->first();
        $trial_ends_at = strtotime(User::getRemainDate());
        $current_date = Carbon::now()->timestamp;
        if($trial_ends_at >= $current_date && !$this->hasRole($role->name)) {
            return true;
        }

        if ($this->hasRole($role->name)) {

            return $role->permissions()->where("name", strtolower($permission))->exists() || $this->hasAddonPermission($permission);
        }

        return false;
    }

    public function hasAddon($addonName)
    {
        $addon = RoleAddon::where("name", strtolower($addonName))->first();

        if(!$addon) return false;
        $isAddonActive = \DB::table("user_role_addons")
        ->where("user_id", $this->id)
        ->where("trial_ends_at", ">", Carbon::now())
        ->whereNotNull("trial_ends_at")
        ->where("addon_id", $addon->id)
        ->exists();
        return $isAddonActive || $this->subscribedToPlan($addon->name, 'addon');
    }

    public function hasAddonPermission($permission)
    {
        $addons = $this->roleAddons()->get();

        foreach($addons as $addon){
            if($addon->permissions()->where("name", strtolower($permission))->exists() && $this->hasAddon($addon->name, 'addon')) return true;
        }

        return false;
    }

    public function setRole($roleName)
    {
        $roleName = strtolower($roleName);

        if ($role = Role::where("name", $roleName)->first()) {
            $this->role_id = $role->id;
            $this->save();
        }
    }

    public function setAddon($addonName)
    {
        $addonName = strtolower($addonName);

        if($addon = RoleAddon::where("name", $addonName)->first()){
            $this->roleAddons()->attach($addon->id);
        }
    }

    public function getLimit($type)
    {
        if($limit = RoleLimit::where("role_id", $this->role_id)->first()){
            return $limit->{$type};
        }

        return 0;
    }
}