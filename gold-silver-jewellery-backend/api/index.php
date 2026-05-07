<?php

use Illuminate\Http\Request;

// Vercel ke liye temporary storage paths - sirf tab banayein agar pehle se na hon
$storagePaths = [
    '/tmp/storage/framework/views',
    '/tmp/storage/framework/cache',
    '/tmp/storage/framework/sessions',
];

foreach ($storagePaths as $path) {
    if (!file_exists($path)) {
        @mkdir($path, 0755, true);
    }
}

define('LARAVEL_START', microtime(true));

// Composer autoloader load karein
require __DIR__ . '/../vendor/autoload.php';

// Laravel application bootstrap karein
$app = require_once __DIR__ . '/../bootstrap/app.php';

// Vercel ke liye custom storage path set karein
$app->useStoragePath('/tmp/storage');

// Handle the request (Laravel 11 stable way)
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response = $kernel->handle(
    $request = Request::capture()
);
$response->send();
$kernel->terminate($request, $response);