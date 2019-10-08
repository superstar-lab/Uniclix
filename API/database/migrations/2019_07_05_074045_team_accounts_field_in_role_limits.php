<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class TeamAccountsFieldInRoleLimits extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('role_limits', function (Blueprint $table) {
            $table->integer("team_accounts")->after("accounts_per_platform")->default(1);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('role_limits', function (Blueprint $table) {
            $table->dropColumn("team_accounts");
        });
    }
}
