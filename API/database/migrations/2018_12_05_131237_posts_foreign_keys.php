<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class PostsForeignKeys extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table("posts", function(Blueprint $table){
            $table->foreign("admin_id")->references("id")->on("admins")->onDelete("cascade");
            $table->foreign("category_id")->references("id")->on("posts_categories");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table("posts", function(Blueprint $table){
            $table->dropForeign(['admin_id', 'category_id']);
        });
    }
}
