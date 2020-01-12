<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddCategoryIdScheduledPostTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('scheduled_posts', function (Blueprint $table) {
            $table->integer('category_id')->nullable()->after("article_id");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
        Schema::table("scheduled_posts", function (Blueprint $table) {
            $table->dropColumn("category_id");
        });
    }
}
