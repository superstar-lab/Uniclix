<?php

use Illuminate\Database\Seeder;

class AdminTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {   DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table("admins")->truncate();
        DB::table('admins')->insert([
            'name' => 'Rinol Alaj',
            'email' => 'alaj07030@gmail.com',
            'password' => bcrypt('P@ssw0rd'),
        ]);
    }
}
