<?php

namespace App\Notifications\User;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class AfterThreeDays extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    protected $username;
    public function __construct($username)
    {
        $this->username = $username;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        // if (
        //     $this->user->isOld(3 * 24)
        //     && !\App\Models\Notification::existsForUser($this->user->id, "App\Notifications\User\AfterThreeDaysAfterSignUp")
        // ) {
            return ['database', 'mail'];
        // } else {
        //     return [];
        // }
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        $user = $this->username;
        return (new MailMessage)
            ->view('emails.user.after_three_days', [ 'user' => $user])
            ->from('info@uniclixapp.com')
            ->subject('Scheduling an appointment with you for Uniclix');
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
