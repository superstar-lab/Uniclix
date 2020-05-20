<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class AfterSixDays extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($user)
    {
        $this->user = $user;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $user = $this->user->name;
        $delivery_time = $this->user->created_at->addHours(3 * 24);
        return $this ->view('emails.user.after_six_days', [ 'user' => $user])
                    ->from('info@uniclixapp.com')
                    ->subject('Have you tried the content finder tool by UniClix?')
                    ->withSwiftMessage(function ($message) use ($delivery_time) {
                        $message->getHeaders()->addTextHeader('X-Mailgun-Deliver-By', $delivery_time->toRfc2822String());
                    });;
    }
}
