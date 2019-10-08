<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RoleLimitsAccountLimit extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table("role_limits", function(Blueprint $table){
            $table->integer("account_limit")->after("role_id");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table("role_limits", function(Blueprint $table){
            $table->dropColumn("account_limit");
        });
    }
}
