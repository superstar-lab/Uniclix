<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class Streams extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create("streams", function(Blueprint $table){
            $table->increments("id");
            $table->integer("index");
            $table->integer("tab_id")->unsigned();
            $table->integer("channel_id")->unsigned();
            $table->string("title");
            $table->string("type");
            $table->string("network");
            $table->timestamps();

            $table->foreign("tab_id")->references("id")->on("tabs")->onDelete("cascade");
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
        Schema::dropIfExists("streams");
    }
}
