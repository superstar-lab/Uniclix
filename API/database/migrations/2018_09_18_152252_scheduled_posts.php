<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ScheduledPosts extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create("scheduled_posts", function(Blueprint $table){
            $table->increments("id");
            $table->integer("channel_id")->unsigned();
            $table->text("post_id")->nullable();
            $table->text("content")->nullable();
            $table->text("payload")->nullable();
            $table->boolean("posted")->default(0);
            $table->integer("status")->nullable();
            $table->timestamp("scheduled_at")->nullable();
            $table->timestamps();

            $table->foreign("channel_id")->references("id")->on("channels")->onDelete("cascade");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists("scheduled_posts");
    }
}
