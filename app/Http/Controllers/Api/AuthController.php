<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Cache;
use App\Mail\OtpVerificationMail;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'mobile' => ['nullable', 'string', 'max:20'],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'mobile' => $request->mobile,
            'email_verified_at' => null,
        ]);

        // Generate 6-digit OTP
        $otp = rand(100000, 999999);
        
        // Cache OTP for 10 minutes
        Cache::put('user_otp_' . $user->email, $otp, now()->addMinutes(10));
        \Log::info("User OTP generated for {$user->email}: {$otp}");

        // Dispatch OTP verification email
        try {
            Mail::to($user->email)->send(new OtpVerificationMail($otp));
        } catch (\Exception $e) {
            \Log::error('Failed to send user OTP email: ' . $e->getMessage());
        }

        return response()->json([
            'message' => 'Account registered. Please enter the verification code sent to your email.',
            'requires_email_verification' => true,
            'email' => $user->email
        ], 201);
    }

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'otp' => ['required', 'string'],
        ]);

        $cachedOtp = Cache::get('user_otp_' . $request->email);

        if ($cachedOtp && (string)$cachedOtp === (string)$request->otp) {
            Cache::forget('user_otp_' . $request->email);

            $user = User::where('email', $request->email)->firstOrFail();

            if (is_null($user->email_verified_at)) {
                $user->email_verified_at = now();
                $user->save();
            }

            // Check if 2FA (Authenticator app) is enabled
            if ($user->two_factor_secret && $user->two_factor_confirmed_at) {
                $tempToken = \Illuminate\Support\Str::random(60);
                Cache::put('2fa_login_' . $tempToken, $user->id, now()->addMinutes(10));

                return response()->json([
                    'message' => 'Two-factor authentication required',
                    'requires_2fa' => true,
                    'temp_token' => $tempToken
                ]);
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Email verified successfully',
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => $user
            ]);
        }

        return response()->json([
            'message' => 'Invalid or expired verification code.'
        ], 400);
    }

    public function resendOtp(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        $otp = rand(100000, 999999);
        Cache::put('user_otp_' . $user->email, $otp, now()->addMinutes(10));
        \Log::info("Resent User OTP for {$user->email}: {$otp}");

        try {
            Mail::to($user->email)->send(new OtpVerificationMail($otp));
        } catch (\Exception $e) {
            \Log::error('Failed to resend user OTP email: ' . $e->getMessage());
        }

        return response()->json([
            'message' => 'A new verification code has been sent to your email.'
        ]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid email or password.'
            ], 401);
        }

        // Check if email is verified
        if (is_null($user->email_verified_at)) {
            $otp = rand(100000, 999999);
            Cache::put('user_otp_' . $user->email, $otp, now()->addMinutes(10));
            \Log::info("Unverified login OTP generated for {$user->email}: {$otp}");

            try {
                Mail::to($user->email)->send(new OtpVerificationMail($otp));
            } catch (\Exception $e) {
                \Log::error('Failed to send user OTP email on unverified login: ' . $e->getMessage());
            }

            return response()->json([
                'message' => 'Your email is not verified yet. A verification code has been sent to your email.',
                'requires_email_verification' => true,
                'email' => $user->email
            ]);
        }

        // Check if user has 2FA enabled
        if ($user->two_factor_secret && $user->two_factor_confirmed_at) {
            $tempToken = \Illuminate\Support\Str::random(60);
            Cache::put('2fa_login_' . $tempToken, $user->id, now()->addMinutes(10));
            
            return response()->json([
                'message' => 'Two-factor authentication required',
                'requires_2fa' => true,
                'temp_token' => $tempToken
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }

    public function verify2faLogin(Request $request)
    {
        $request->validate([
            'temp_token' => 'required|string',
            'code' => 'required|string'
        ]);

        $userId = Cache::get('2fa_login_' . $request->temp_token);

        if (!$userId) {
            return response()->json(['message' => 'Login session expired. Please try again.'], 401);
        }

        $user = User::findOrFail($userId);
        $google2fa = new \PragmaRX\Google2FA\Google2FA();

        if ($google2fa->verifyKey($user->two_factor_secret, $request->code)) {
            Cache::forget('2fa_login_' . $request->temp_token);
            
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Login successful',
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => $user
            ]);
        }

        return response()->json(['message' => 'Invalid two-factor authentication code.'], 400);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }

    public function user(Request $request)
    {
        return response()->json([
            'user' => $request->user()
        ]);
    }
}
