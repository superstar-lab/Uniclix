<?php

use Illuminate\Database\Seeder;

class TeamPermissionSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        DB::table("team_roles")->truncate();

        DB::table("team_roles")->insert([
            [
                "name" => "member"
            ],
            [
                "name" => "publisher"
            ],
            [
                "name" => "approver"
            ]
        ]);
    }  
}