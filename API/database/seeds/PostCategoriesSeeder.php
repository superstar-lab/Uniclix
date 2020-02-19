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
        	['category_name' => 'Blog Post', 'color' => '#D83E7F'],
        	['category_name' => 'SlideShare', 'color' => '#FF8975'],
        	['category_name' => 'Ebook', 'color' => '#45ADFA'],
        	['category_name' => 'Webinar', 'color' => '#30204C'],
        	['category_name' => 'Recommended Reads', 'color' => '#32A83E'],
            ['category_name' => 'Product Launch', 'color' => '#F7D6E0'],
            ['category_name' => 'Promotion and Sale', 'color' => '#BCD39C'],
            ['category_name' => 'Experiment', 'color' => '#FFFC99'],
            ['category_name' => 'Business', 'color' => '#0073B1'],
            ['category_name' => 'General', 'color' => '#8E8358'],
            ['category_name' => 'Other', 'color' => '#D7DAE5'],
        ]);
    }
}
