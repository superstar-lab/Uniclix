<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class TwitterStatistics extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create("twitter_statistics", function(Blueprint $table){
           $table->increments("id");
           $table->integer("channel_id")->unsigned();
           $table->integer("follows")->default(0);
           $table->integer("unfollows")->default(0);
           $table->integer("followers")->default(0);
           $table->integer("posts")->default(0);
           $table->timestamps();

           $table->foreign("channel_id")->references("id")->on("twitter_channels")->onDelete("cascade");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists("twitter_statistics");
    }
}
