<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RolePricing extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('roles', function(Blueprint $table){
            $table->float('monthly_price')->default(0);
            $table->float('annual_price')->default(0);
        });

        Schema::table('role_addons', function(Blueprint $table){
            $table->integer('trial_days')->default(0);
            $table->float('monthly_price')->default(0);
            $table->float('annual_price')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('roles', function(Blueprint $table){
            $table->dropColumn('monthly_price');
            $table->dropColumn('anual_price');
        });

        Schema::table('role_addons', function(Blueprint $table){
            $table->dropColumn('trial_days'); 
            $table->dropColumn('monthly_price');
            $table->dropColumn('annual_price');
        });
    }
}
