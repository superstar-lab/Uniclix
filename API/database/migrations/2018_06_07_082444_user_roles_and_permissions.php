<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UserRolesAndPermissions extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create("roles", function(Blueprint $table){
            $table->increments("id");
            $table->string("name");
            $table->string("description")->nullable();
        });

        Schema::create("permissions", function(Blueprint $table){
            $table->increments("id");
            $table->string("name");
            $table->string("description")->nullable();
        });

        Schema::create("role_permissions", function(Blueprint $table){
            $table->increments("id");
            $table->integer("role_id")->unsigned();
            $table->integer("permission_id")->unsigned();
        });

        Schema::create("role_limits", function(Blueprint $table){
            $table->increments("id");
            $table->integer("role_id")->unsigned();
            $table->integer("accounts_per_platform");
            $table->integer("posts_per_account");
            $table->integer("twitter_daily_follows");
            $table->integer("twitter_daily_unfollows");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists("roles");
        Schema::dropIfExists("permissions");
        Schema::dropIfExists("role_permissions");
        Schema::dropIfExists("role_limits");
    }
}
