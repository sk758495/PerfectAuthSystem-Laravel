<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class OtpVerificationMail extends Mailable
{
    use SerializesModels;

    public $otp;

    /**
     * Create a new message instance.
     *
     * @param $otp
     */
    public function __construct($otp)
    {
        $this->otp = $otp;
    }

    /**
     * Build the message.
     *
     * @return \Illuminate\Mail\Mailable
     */
    public function build()
    {
        return $this->subject('Your Email Verification Code - PerfectAuth')
                    ->view('emails.otp-verification')
                    ->with(['otp' => $this->otp]);
    }
}
