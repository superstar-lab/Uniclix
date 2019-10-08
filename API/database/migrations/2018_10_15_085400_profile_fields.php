<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ProfileFields extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function(Blueprint $table){
            $table->string('website')->nullable();
            $table->string('timezone')->nullable();
            $table->string('usage_reason')->nullable();
        });

        Schema::create('topics', function(Blueprint $table){
            $table->increments("id");
            $table->string("topic");
            $table->integer("user_id")->unsigned();
            $table->timestamps();

            $table->foreign("user_id")->references("id")->on("users")->onDelete("cascade");
        });

        Schema::create('locations', function(Blueprint $table){
            $table->increments("id");
            $table->string("location", 500);
            $table->integer("user_id")->unsigned();
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
        Schema::table('users', function(Blueprint $table){
            $table->dropColumn('website');
            $table->dropColumn('timezone');
            $table->dropColumn('usage_reason');
        });

        Schema::dropIfExists('topics');

        Schema::dropIfExists('locations');
    }
}
