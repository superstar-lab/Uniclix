<?php

namespace App\Notifications\User;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class AfterSevenDaysSecond extends Notification implements ShouldQueue
{
    use Queueable;

    private $user;
    public $tries = 3;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($user)
    {
        $this->user = $user;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        if (
            $this->user->channels->count() <=2
            && !\App\Models\Notification::existsForUser($this->user->id, "App\Notifications\User\AfterSevenDaysSecond")
        ) {
            return ['database', 'mail'];
        } else {
            return [];
        }
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        $username = $this->user->name;
        return (new MailMessage)
            ->view('emails.user.after_seven_days_second', [ 'user' => $username])
            ->subject('Let’s get this party started - fire up the Uniclix Social Media Growth Engine');
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            //
        ];
    }
}
