<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class TwitterRelationships extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('twitter_follower_ids', function(Blueprint $table){
            $table->increments('id');
            $table->integer("channel_id")->unsigned();
            $table->string('user_id');
            $table->timestamp('unfollowed_at')->nullable();
            $table->timestamp('unfollowed_you_at')->nullable();
            $table->timestamps();

            $table->foreign("channel_id")->references("id")->on("twitter_channels")->onDelete("cascade");
        });

        Schema::create('twitter_following_ids', function(Blueprint $table){
            $table->increments('id');
            $table->integer("channel_id")->unsigned();
            $table->string('user_id');
            $table->timestamp('unfollowed_at')->nullable();
            $table->timestamp('unfollowed_you_at')->nullable();
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
        Schema::dropIfExists("twitter_follower_ids");
        Schema::dropIfExists("twitter_following_ids");
    }
}
