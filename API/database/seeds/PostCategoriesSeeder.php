<?php

use Illuminate\Database\Seeder;

class PostCategoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('posts_categories')->insert([
        	['category_name' => 'General'],
        	['category_name' => 'Life Style'],
        	['category_name' => 'Social Media'],
        	['category_name' => 'Tech'],
        	['category_name' => 'Music'],
        	['category_name' => 'Entertainment']
        ]);
    }
}
