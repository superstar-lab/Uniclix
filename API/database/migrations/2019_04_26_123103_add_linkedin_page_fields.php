<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddLinkedinPageFields extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table("linkedin_channels", function(Blueprint $table){
            $table->integer("parent_id")->nullable()->after("channel_id");
            $table->integer("original_id")->nullable()->after("channel_id");
            $table->string("account_type")->nullable()->after("access_token");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table("linkedin_channels", function(Blueprint $table){
            $table->dropColumn("parent_id");
            $table->dropColumn("original_id");
            $table->dropColumn("account_type");
        });
    }
}
