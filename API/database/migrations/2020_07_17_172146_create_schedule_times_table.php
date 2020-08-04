<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use App\Models\User;
use App\Models\ScheduleTime;
use App\Models\ScheduleDefaultTime;

class CreateScheduleTimesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('schedule_times', function (Blueprint $table) {
            $table->increments('id');
            $table->integer("user_id")->unsigned();
            $table->text("time_id")->nullable();
            $table->integer("schedule_week")->unsigned();
            $table->text("schedule_time")->nullable();
            $table->boolean("posted")->default(0);
            $table->timestamps();

            $table->foreign("user_id")->references("id")->on("users")->onDelete("cascade");
        });

        $users = User::all()->pluck("id");
        $defaultTimes = ScheduleDefaultTime::all()->pluck("default_time");

        foreach ($users as $user) {
            for ($i = 0; $i < 7; $i++) {
                foreach ($defaultTimes as $defaultTime) {
                    ScheduleTime::create([
                        'user_id' => $user,
                        'time_id' => uniqid(),
                        'schedule_week' => $i,
                        'schedule_time' => $defaultTime,
                    ]);
                }
            }
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('schedule_times');
    }
}
