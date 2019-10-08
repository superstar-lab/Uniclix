<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class TimezoneAndOriginalScheduledAt extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table("scheduled_posts", function(Blueprint $table){
            $table->timestamp("scheduled_at_original")->nullable()->after("scheduled_at");
        });

        Schema::table("channels", function(Blueprint $table){
            $table->string("timezone")->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table("scheduled_posts", function(Blueprint $table){
            $table->dropColumn("scheduled_at_original");
        });

        Schema::table("channels", function(Blueprint $table){
            $table->dropColumn("timezone");
        });
    }
}
