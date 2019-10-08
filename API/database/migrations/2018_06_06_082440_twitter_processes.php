<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class TwitterProcesses extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create("twitter_processes", function(Blueprint $table){
            $table->increments("id");
            $table->integer("channel_id")->unsigned();
            $table->string("process_name");
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
        Schema::dropIfExists("twitter_processes");
    }
}
