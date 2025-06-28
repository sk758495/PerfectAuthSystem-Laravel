<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Illuminate\View\View;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): View
    {
        return view('auth.register');
    }

    /**
     * Handle an incoming registration request.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:' . User::class],
            'mobile' => ['required', 'string', 'max:15'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'mobile' => $request->mobile,
            'password' => Hash::make($request->password),
        ]);

        Auth::login($user); // Log in the user immediately after registration

        event(new Registered($user));

        // Generate OTP
        $otp = rand(100000, 999999); // Generate a 6-digit OTP

        // Store OTP in the session (or database if you prefer)
        session(['otp' => $otp, 'otp_expiration' => now()->addMinutes(5)]); // OTP expires in 5 minutes

        // Send OTP to user's email
        Mail::to($user->email)->send(new \App\Mail\OtpVerificationMail($otp));

        // Redirect to OTP verification page
        return redirect()->route('auth.otp.verify');
    }
}
