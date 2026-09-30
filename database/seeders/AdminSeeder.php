<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Admin;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Primary Administrator account (admin@admin.com)
        Admin::updateOrCreate(
            ['email' => 'admin@admin.com'],
            [
                'name' => 'System Administrator',
                'mobile' => '+1555019900',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        // Gmail Administrator account (admin@gmail.com)
        Admin::updateOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'Administrator',
                'mobile' => '+1555019902',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        // Secondary / Domain Administrator account
        Admin::updateOrCreate(
            ['email' => 'admin@perfectauth.io'],
            [
                'name' => 'Lead Administrator',
                'mobile' => '+1555019901',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
    }
}
