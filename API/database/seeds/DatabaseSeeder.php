<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call(UserRolePermissionLimitsSeeder::class);
        $this->call(AdminTableSeeder::class);
        $this->call(PostCategoriesSeeder::class);
        $this->call(TeamPermissionSeeder::class);
    }
}
