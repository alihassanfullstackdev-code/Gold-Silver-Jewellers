<?php

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Vercel storage setup
$storagePath = '/tmp/storage/framework/';
$folders = ['views', 'cache', 'sessions'];

foreach ($folders as $folder) {
    if (!is_dir($storagePath . $folder)) {
        @mkdir($storagePath . $folder, 0755, true);
    }
}

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';

// Force Laravel to use /tmp for all storage
$app->useStoragePath('/tmp/storage');

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response = $kernel->handle(
    $request = Request::capture()
);
$response->send();
$kernel->terminate($request, $response);