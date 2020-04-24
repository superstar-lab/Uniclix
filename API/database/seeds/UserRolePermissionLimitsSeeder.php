<?php

use App\Models\Permission;
use App\Models\Role;
use App\Models\RoleAddon;
use Illuminate\Database\Seeder;

class UserRolePermissionLimitsSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        DB::table("roles")->truncate();
        DB::table("role_addons")->truncate();
        DB::table("permissions")->truncate();
        DB::table("role_permissions")->truncate();
        DB::table("role_addon_permissions")->truncate();
        DB::table("role_limits")->truncate();

        DB::table("roles")->insert([
            [
                "name" => "basic",
                "trial_days" => 30,
                "description" => "Basic features",
                "monthly_price" => 14.99,
                "annual_price" => 150,
            ],
            [
                "name" => "premium",
                "trial_days" => 30,
                "description" => "Premium features",
                "monthly_price" => 29.99,
                "annual_price" => 299,
            ],
            [
                "name" => "pro",
                "trial_days" => 30,
                "description" => "Pro features",
                "monthly_price" => 59,
                "annual_price" => 599,
            ],
        ]);

        DB::table("role_addons")->insert([
            [
                "name" => "twitter_growth",
                "description" => "Twitter growth features",
                "trial_days" => 3,
                "monthly_price" => 10,
                "annual_price" => 100,
            ],
        ]);

        DB::table("permissions")->insert([
            [
                "name" => "manage",
                "description" => "Twitter growth",
            ],
            [
                "name" => "manage-dashboard",
                "description" => "Dashboard management",
            ],
            [
                "name" => "manage-reply",
                "description" => "Reply to users in twitter growth",
            ],
            [
                "name" => "manage-fans",
                "description" => "Fans management",
            ],
            [
                "name" => "manage-non-followers",
                "description" => "Non-followers management",
            ],
            [
                "name" => "manage-recent-unfollowers",
                "description" => "Recent unfollowers management",
            ],
            [
                "name" => "manage-recent-followers",
                "description" => "Recent followers management",
            ],
            [
                "name" => "manage-inactive-following",
                "description" => "Inactive following management",
            ],
            [
                "name" => "manage-following",
                "description" => "All following management",
            ],
            [
                "name" => "manage-account-targets",
                "description" => "Account targets management",
            ],
            [
                "name" => "manage-keyword-targets",
                "description" => "Keyword targets management",
            ],
            [
                "name" => "manage-whitelist",
                "description" => "Whitelist management",
            ],
            [
                "name" => "manage-blacklist",
                "description" => "Blacklist management",
            ],
            [
                "name" => "scheduling",
                "description" => "Scheduled posts",
            ],
            [
                "name" => "schedule-best-time",
                "description" => "Scheduled posts at best time",
            ],
            [
                "name" => "draft-posts",
                "description" => "Scheduled posts at best time",
            ],
            [
                "name" => "accounts",
                "description" => "Accounts management",
            ],
            [
                "name" => "compose",
                "description" => "Post something",
            ],
            [
                "name" => "articles",
                "description" => "Curate articles of interest",
            ],
            [
                "name" => "mentions",
                "description" => "Track social media mentions",
            ],
            [
                "name" => "streams",
                "description" => "Social listening",
            ],
            [
                "name" => "analytics",
                "description" => "Analytics",
            ],
            [
                "name" => "advanced-analytics",
                "description" => "Analytics",
            ],
        ]);

        $basic = Role::where("name", "basic")->first();
        $premium = Role::where("name", "premium")->first();
        $pro = Role::where("name", "pro")->first();

        $twitterGrowth = RoleAddon::where("name", "twitter_growth")->first();

        $basicPlusPermissions = Permission::whereIn("name", [
            "articles",
            "compose",
            "scheduling",
            "schedule-best-time",
            "analytics",
            "advanced-analytics",
            "streams",
            "mentions"])->pluck("id");

        $allPermissions = Permission::whereIn("name", [
            "articles",
            "compose",
            "scheduling",
            "schedule-best-time",
            "analytics",
            "advanced-analytics",
            "streams",
            "draft-posts",
            "manage",
            "manage-dashboard",
            "manage-reply",
            "manage-fans",
            "manage-non-followers",
            "manage-recent-unfollowers",
            "manage-recent-followers",
            "manage-inactive-following",
            "manage-following",
            "manage-account-targets",
            "manage-keyword-targets",
            "manage-whitelist",
            "manage-blacklist",
            "mentions"])->pluck("id");

        $twitterGrowthPerm = Permission::whereIn("name",
            [
                "manage",
                "manage-dashboard",
                "manage-reply",
                "manage-fans",
                "manage-non-followers",
                "manage-recent-unfollowers",
                "manage-recent-followers",
                "manage-inactive-following",
                "manage-following",
                "manage-account-targets",
                "manage-keyword-targets",
                "manage-whitelist",
                "manage-blacklist"])->pluck("id");

        $basic->permissions()->attach($basicPlusPermissions);
        $premium->permissions()->attach($allPermissions);
        $pro->permissions()->attach($allPermissions);

        $twitterGrowth->permissions()->attach($twitterGrowthPerm);

        $basic->roleLimit()->create([
            "account_limit" => 5,
            "accounts_per_platform" => 6,
            "team_accounts" => 1,
            "posts_per_account" => 99999,
            "twitter_daily_follows" => 500,
            "twitter_daily_unfollows" => 500,
        ]);

        $premium->roleLimit()->create([
            "account_limit" => 20,
            "accounts_per_platform" => 25,
            "team_accounts" => 3,
            "posts_per_account" => 99999,
            "twitter_daily_follows" => 500,
            "twitter_daily_unfollows" => 500,
        ]);

        $pro->roleLimit()->create([
            "account_limit" => 40,
            "accounts_per_platform" => 50,
            "team_accounts" => 6,
            "posts_per_account" => 99999,
            "twitter_daily_follows" => 500,
            "twitter_daily_unfollows" => 500,
        ]);
    }
}
