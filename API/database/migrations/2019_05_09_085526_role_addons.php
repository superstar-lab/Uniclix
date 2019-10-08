<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RoleAddons extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create("role_addons", function(Blueprint $table){
            $table->increments("id");
            $table->string("name");
            $table->string("description")->nullable();
        });

        Schema::create("role_addon_permissions", function(Blueprint $table){
            $table->increments("id");
            $table->integer("addon_id")->unsigned();
            $table->integer("permission_id")->unsigned();
        });

        Schema::create("user_role_addons", function(Blueprint $table){
            $table->increments("id");
            $table->integer("user_id")->unsigned();
            $table->integer("addon_id")->unsigned();
        });


    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists("role_addons");
        Schema::dropIfExists("role_addon_permissions");
        Schema::dropIfExists("user_role_addons");
    }
}
