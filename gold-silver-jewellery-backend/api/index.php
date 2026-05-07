<?php

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Vercel storage setup
$storagePath = '/tmp/storage/framework/';
foreach (['views', 'cache', 'sessions'] as $folder) {
    if (!is_dir($storagePath . $folder)) {
        @mkdir($storagePath . $folder, 0755, true);
    }
}

// Autoloader load karein
require __DIR__ . '/../vendor/autoload.php';

// Bootstrap application
$app = require_once __DIR__ . '/../bootstrap/app.php';

// Vercel storage fix
$app->useStoragePath('/tmp/storage');

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$response = $kernel->handle(
    $request = Request::capture()
);

$response->send();

$kernel->terminate($request, $response);