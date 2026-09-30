<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\AdminController;

use App\Http\Controllers\Api\TwoFactorAuthController;

// User Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/otp/verify', [AuthController::class, 'verifyOtp']);
Route::post('/otp/resend', [AuthController::class, 'resendOtp']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/login/2fa', [AuthController::class, 'verify2faLogin']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    // 2FA Management
    Route::post('/2fa/enable', [TwoFactorAuthController::class, 'enable']);
    Route::post('/2fa/confirm', [TwoFactorAuthController::class, 'confirm']);
    Route::post('/2fa/disable', [TwoFactorAuthController::class, 'disable']);
});

// Admin Routes
Route::prefix('admin')->group(function () {
    Route::post('/register', [AdminAuthController::class, 'register']);
    Route::post('/login', [AdminAuthController::class, 'login']);
    Route::post('/otp/verify', [AdminAuthController::class, 'verifyOtp']);
    Route::post('/otp/resend', [AdminAuthController::class, 'resendOtp']);
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AdminAuthController::class, 'logout']);
        Route::get('/dashboard', [AdminController::class, 'index']);
    });
});
