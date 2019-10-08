<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class StreamSearchFields extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table("streams", function(Blueprint $table){
            $table->string("search_query")->nullable()->after("network");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table("streams", function(Blueprint $table){
            $table->dropColumn("search_query");
        });
    }
}
