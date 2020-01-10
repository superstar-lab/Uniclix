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
        	['category_name' => 'Blog Post'],
        	['category_name' => 'SlideShare'],
        	['category_name' => 'Ebook'],
        	['category_name' => 'Webinar'],
        	['category_name' => 'Recommended Reads'],
            ['category_name' => 'Product Launch'],
            ['category_name' => 'Promotion and Sale'],
            ['category_name' => 'Experiment'],
            ['category_name' => 'Business'],
            ['category_name' => 'General'],
            ['category_name' => 'Other'],
        ]);
    }
}
