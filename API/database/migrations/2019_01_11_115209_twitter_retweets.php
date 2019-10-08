<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class TwitterRetweets extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create("twitter_retweets", function(Blueprint $table){
            $table->increments('id');
            $table->integer("channel_id")->unsigned();
            $table->string('tweet_id');
            $table->timestamp('original_created_at');
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
        Scheema::dropIfExists("twitter_retweets");
    }
}
