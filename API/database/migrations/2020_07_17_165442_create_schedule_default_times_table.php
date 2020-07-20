<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use App\Models\ScheduleDefaultTime;

class CreateScheduleDefaultTimesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('schedule_default_times', function (Blueprint $table) {
            $table->increments('id');
            $table->text("default_time")->nullable();
            $table->timestamps();
        });

        $times = ['9:35', '17:30', '21:47'];
        foreach ($times as $time)
            ScheduleDefaultTime::create(['default_time' => $time]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('schedule_default_times');
    }
}
