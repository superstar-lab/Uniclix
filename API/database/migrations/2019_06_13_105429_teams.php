<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class Teams extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('teams', function(Blueprint $table){
            $table->increments("id");
            $table->integer("user_id")->unsigned();
            $table->string("name")->nullable();
            $table->timestamps();

            $table->foreign("user_id")->references("id")->on("users")->onDelete("cascade");
        });        
        
        Schema::create("team_roles", function(Blueprint $table){
            $table->increments("id");
            $table->string("name")->index();
        });

        Schema::create('team_users', function(Blueprint $table){
            $table->increments("id");
            $table->integer("member_id")->unsigned();
            $table->integer("owner_id")->unsigned();
            $table->integer("team_id")->unsigned();
            $table->boolean("is_admin")->default(0);
            $table->boolean("is_pending")->default(1);
            $table->timestamps();

            $table->foreign("member_id")->references("id")->on("users")->onDelete("cascade");
            $table->foreign("owner_id")->references("id")->on("users")->onDelete("cascade");
            $table->foreign("team_id")->references("id")->on("teams")->onDelete("cascade");
        });

        Schema::create('team_user_channels', function(Blueprint $table){
            $table->increments("id");
            $table->integer("member_id")->unsigned();
            $table->integer("owner_id")->unsigned();
            $table->integer("approver_id")->unsigned();
            $table->integer("channel_id")->unsigned();
            $table->integer("team_id")->unsigned();
            $table->string("role")->default("member");
            $table->timestamps();

            $table->foreign("member_id")->references("id")->on("users")->onDelete("cascade");
            $table->foreign("approver_id")->references("id")->on("users")->onDelete("cascade");
            $table->foreign("owner_id")->references("id")->on("users")->onDelete("cascade");
            $table->foreign("channel_id")->references("id")->on("channels")->onDelete("cascade");
            $table->foreign("team_id")->references("id")->on("teams")->onDelete("cascade");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('teams', function(Blueprint $table){
            $table->dropForeign(['user_id']);
        });

        Schema::table('team_users', function(Blueprint $table){
            $table->dropForeign(['member_id']);
            $table->dropForeign(['owner_id']);
            $table->dropForeign(['team_id']);
        });

        Schema::table('team_user_channels', function(Blueprint $table){
            $table->dropForeign(['member_id']);
            $table->dropForeign(['owner_id']);
            $table->dropForeign(['team_id']);
            $table->dropForeign(['approver_id']);
            $table->dropForeign(['channel_id']);
        });

        Schema::dropIfExists("teams");
        Schema::dropIfExists("team_roles");
        Schema::dropIfExists("team_users");
        Schema::dropIfExists("team_user_channels");
    }
}
