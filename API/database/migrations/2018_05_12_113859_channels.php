<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class Channels extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create("channels", function(Blueprint $table){
            $table->increments("id");
            $table->integer("user_id")->unsigned();
            $table->string("type");
            $table->boolean("selected")->default(0);
            $table->boolean("banned")->default(0);
            $table->boolean("deleted")->default(0);
            $table->timestamps();

            $table->foreign("user_id")->references("id")->on("users")->onDelete("cascade");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists("channels");
    }
}
