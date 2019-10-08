<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ArticleIdOnScheduledPosts extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table("scheduled_posts", function(Blueprint $table){
            $table->integer("article_id")->nullable()->after("status")->index();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table("scheduled_posts", function(Blueprint $table){
            $table->dropColumn("article_id");
        });
    }
}
