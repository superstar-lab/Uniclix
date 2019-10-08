<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class TabRefreshRate extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table("tabs", function(Blueprint $table){
            $table->integer("refresh_rate")->after("title")->default(2);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table("tabs", function(Blueprint $table){
            $table->dropColumn("refresh_rate");
        });
    }
}
