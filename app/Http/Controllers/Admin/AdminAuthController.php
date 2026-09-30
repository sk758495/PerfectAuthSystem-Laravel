<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Admin;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Cache;

class AdminAuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:admins',
            'mobile' => ['required', 'string', 'max:15'],
            'password' => 'required|confirmed|min:6',
        ]);

        $admin = Admin::create([
            'name' => $request->name,
            'email' => $request->email,
            'mobile' => $request->mobile,
            'password' => Hash::make($request->password),
        ]);

        // Generate OTP
        $otp = rand(100000, 999999);
        
        // Store in cache for 5 minutes using email as key
        Cache::put('admin_otp_' . $admin->email, $otp, now()->addMinutes(5));
        \Log::info("Admin registration OTP generated for {$admin->email}: {$otp}");
        
        // Send OTP email
        try {
            Mail::to($admin->email)->send(new \App\Mail\AdminOtpMail($otp));
        } catch (\Exception $e) {
            \Log::error('Failed to send admin registration OTP email: ' . $e->getMessage());
        }

        return response()->json([
            'message' => 'Admin registered successfully. Please verify OTP sent to your email.',
            'email' => $admin->email
        ], 201);
    }

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|string'
        ]);

        $cachedOtp = Cache::get('admin_otp_' . $request->email);

        if ($cachedOtp && (string)$cachedOtp === (string)$request->otp) {
            // OTP is valid
            Cache::forget('admin_otp_' . $request->email);
            
            $admin = Admin::where('email', $request->email)->firstOrFail();
            $token = $admin->createToken('admin_token')->plainTextToken;

            return response()->json([
                'message' => 'OTP verified successfully',
                'access_token' => $token,
                'token_type' => 'Bearer',
                'admin' => $admin
            ]);
        }

        return response()->json([
            'message' => 'Invalid or expired OTP.'
        ], 400);
    }

    public function resendOtp(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        
        $admin = Admin::where('email', $request->email)->first();
        if (!$admin) {
            return response()->json(['message' => 'Admin not found.'], 404);
        }

        $otp = rand(100000, 999999);
        Cache::put('admin_otp_' . $admin->email, $otp, now()->addMinutes(5));
        \Log::info("Resent Admin OTP for {$admin->email}: {$otp}");
        
        try {
            Mail::to($admin->email)->send(new \App\Mail\AdminOtpMail($otp));
        } catch (\Exception $e) {
            \Log::error('Failed to resend admin OTP email: ' . $e->getMessage());
        }

        return response()->json(['message' => 'OTP resent successfully.']);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $admin = Admin::where('email', $request->email)->first();

        if (!$admin || !Hash::check($request->password, $admin->password)) {
            return response()->json([
                'message' => 'Invalid credentials.'
            ], 401);
        }

        // Check if admin email is verified
        if (is_null($admin->email_verified_at)) {
            // Generate and send OTP for unverified admin accounts
            $otp = rand(100000, 999999);
            Cache::put('admin_otp_' . $admin->email, $otp, now()->addMinutes(5));
            \Log::info("Admin OTP generated for {$admin->email}: {$otp}");
            
            try {
                Mail::to($admin->email)->send(new \App\Mail\AdminOtpMail($otp));
            } catch (\Exception $e) {
                \Log::error('Failed to send admin OTP email: ' . $e->getMessage());
            }

            return response()->json([
                'message' => 'Admin email not verified. Please enter the OTP sent to your email.',
                'requires_email_verification' => true,
                'email' => $admin->email
            ]);
        }

        // Verified / Seeded Admin gets direct access
        $token = $admin->createToken('admin_token')->plainTextToken;

        return response()->json([
            'message' => 'Admin login successful',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'admin' => $admin
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Admin logged out successfully'
        ]);
    }
}
