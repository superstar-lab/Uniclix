<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class FacebookProcesses extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create("facebook_processes", function(Blueprint $table){
            $table->increments("id");
            $table->integer("channel_id")->unsigned();
            $table->string("process_name");
            $table->timestamps();

            $table->foreign("channel_id")->references("id")->on("facebook_processes")->onDelete("cascade");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists("facebook_processes");
    }
}
