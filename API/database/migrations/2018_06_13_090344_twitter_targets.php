<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class TwitterTargets extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create("twitter_account_targets", function(Blueprint $table){
            $table->increments("id");
            $table->integer("channel_id")->unsigned();
            $table->string("account");
            $table->timestamps();

            $table->foreign("channel_id")->references("id")->on("twitter_channels")->onDelete("cascade");
        });

        Schema::create("twitter_account_targets_feed", function(Blueprint $table){
            $table->increments("id");
            $table->integer("channel_id")->unsigned();
            $table->integer("target_id")->unsigned();
            $table->string("user_id");
            $table->timestamps();

            $table->foreign("channel_id")->references("id")->on("twitter_channels")->onDelete("cascade");
            $table->foreign("target_id")->references("id")->on("twitter_account_targets")->onDelete("cascade");
        });

        Schema::create("twitter_keyword_targets", function(Blueprint $table){
            $table->increments("id");
            $table->integer("channel_id")->unsigned();
            $table->string("keyword");
            $table->string("location")->nullable();
            $table->text("coordinates")->nullable();
            $table->timestamps();

            $table->foreign("channel_id")->references("id")->on("twitter_channels")->onDelete("cascade");
        });

        Schema::create("twitter_keyword_targets_feed", function(Blueprint $table){
            $table->increments("id");
            $table->integer("channel_id")->unsigned();
            $table->integer("target_id")->unsigned();
            $table->string("user_id");
            $table->timestamps();

            $table->foreign("channel_id")->references("id")->on("twitter_channels")->onDelete("cascade");
            $table->foreign("target_id")->references("id")->on("twitter_keyword_targets")->onDelete("cascade");
        });

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {   Schema::dropIfExists("twitter_keyword_targets_feed");
        Schema::dropIfExists("twitter_account_targets_feed");
        Schema::dropIfExists("twitter_account_targets");
        Schema::dropIfExists("twitter_keyword_targets");
    }
}
