<?php

namespace App\Notifications\User;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class NoPostScheduledAfterTenDays extends Notification implements ShouldQueue
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
        $userWithoutPosts = $this->user->has('channels')->whereHas('channels', function ($unit) {
            return $unit->has('scheduledPosts');
        })->get();

        if (
            $userWithoutPosts->count() == 0
            && !\App\Models\Notification::existsForUser($this->user->id, "App\Notifications\User\NoPostScheduledAfterTenDays")
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
        return (new MailMessage)
            ->view('emails.user.no_posts_scheduled')
            ->from('lumi@uniclixapp.com')
            ->subject('Create Your First Post with UniClix');
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
