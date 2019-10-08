<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class Articles extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create("articles", function(Blueprint $table){
            $table->increments("id");
            $table->string("source_url", 500)->nullable();
            $table->string("author", 500)->nullable();
            $table->string("title", 500);
            $table->string("description", 900)->nullable();
            $table->string("content", 900)->nullable();
            $table->string("url", 500);
            $table->string("image_url", 500)->nullable();
            $table->string("topic");
            $table->timestamp("published_at")->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists("articles");
    }
}
