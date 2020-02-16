<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    public function permissions()
    {
        return $this->belongsToMany(Permission::class, "role_permissions", "role_id", "permission_id");
    }

    public function roleLimit()
    {
        return $this->hasOne(RoleLimit::class);
    }

    public function scopeFormattedForDisplay($query)
    {
        $plans = $query->with("permissions")->with("roleLimit")->orderBy("id", "asc")->get();
        $planData = [];
 
        foreach($plans as $plan){
 
            $planData[] = [
                 "Name" => ucfirst($plan->name),
                 "Monthly" => $plan->monthly_price,
                 "Annual Billing" => $plan->annual_price,
                 "Social Accounts" => $plan->roleLimit->account_limit,
                 "Users" => $plan->roleLimit->team_accounts,
                 "Post Limitation" => $plan->roleLimit->posts_per_account == 99999 ? 'Unlimited' : $plan->roleLimit->posts_per_account,
                 "Schedule and Publish" => $plan->permissions->contains("name", "scheduling") && $plan->permissions->contains("name", "schedule-best-time") || $plan->name == 'basic' ? 'Limited' : true,
                 "Content Curation" => $plan->name == 'free' || $plan->name == 'basic' ? 'Limited' : $plan->permissions->contains("name", "articles"),
                 "Mentions" => $plan->permissions->contains("name", "mentions"),
                 "Social Listening & Monitoring" => $plan->permissions->contains("name", "streams"),
                 "Analytics" => $plan->permissions->contains("name", "analytics") && $plan->permissions->contains("name", "advanced-analytics") ? true : 'Limited',
                 "Advanced Schedule" => $plan->permissions->contains("name", "schedule-best-time"),
                 "Create and Manage Draft Posts" => $plan->permissions->contains("name", "draft-posts"),
                 "Team: Invite Additional Users" => $plan->roleLimit->team_accounts > 1,
                 "Approval Workflow" => $plan->roleLimit->team_accounts > 1
            ];
        }
 
        return $planData;
    }
}
