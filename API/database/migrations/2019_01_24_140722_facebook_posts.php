<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class FacebookPosts extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create("facebook_posts", function(Blueprint $table){
            $table->increments('id');
            $table->integer("channel_id")->unsigned();
            $table->string('post_id');
            $table->text('message');
            $table->timestamp('original_created_at');
            $table->timestamps();

            $table->foreign("channel_id")->references("id")->on("facebook_channels")->onDelete("cascade");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Scheema::dropIfExists("facebook_posts");
    }
}
