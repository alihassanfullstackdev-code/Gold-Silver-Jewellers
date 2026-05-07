<?php

// Vercel ke liye temporary storage paths - sirf tab banayein agar pehle se na hon
if (!file_exists('/tmp/storage/framework/views')) {
    @mkdir('/tmp/storage/framework/views', 0755, true);
}
if (!file_exists('/tmp/storage/framework/cache')) {
    @mkdir('/tmp/storage/framework/cache', 0755, true);
}
if (!file_exists('/tmp/storage/framework/sessions')) {
    @mkdir('/tmp/storage/framework/sessions', 0755, true);
}

define('LARAVEL_START', microtime(true));

// Composer autoloader load karein
require __DIR__ . '/../vendor/autoload.php';

// Laravel application bootstrap karein
$app = require_once __DIR__ . '/../bootstrap/app.php';

// Vercel ke liye custom storage path set karein
$app->useStoragePath('/tmp/storage');

// Handle the request
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);
$response->send();
$kernel->terminate($request, $response);