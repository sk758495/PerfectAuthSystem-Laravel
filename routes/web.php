<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

require __DIR__.'/auth.php';
require __DIR__.'/Admin/auth.php';


use App\Http\Controllers\Auth\OtpVerificationController;


Route::get('auth/otp/verify', [OtpVerificationController::class, 'show'])->name('auth.otp.verify');
Route::post('auth/otp/verify', [OtpVerificationController::class, 'verify']);
Route::post('auth/otp/resend', [OtpVerificationController::class, 'resend'])->name('auth.otp.resend');

