<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (file_exists('C:/xampp/apache/bin/curl-ca-bundle.crt')) {
            @ini_set('openssl.cafile', 'C:/xampp/apache/bin/curl-ca-bundle.crt');
            @ini_set('curl.cainfo', 'C:/xampp/apache/bin/curl-ca-bundle.crt');
        }
    }
}
