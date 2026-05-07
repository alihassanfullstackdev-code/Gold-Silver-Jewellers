<?php

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Warnings block karein taake Laravel clean start ho sake
error_reporting(0);
ini_set('display_errors', 0);

// Storage folders in /tmp
$storagePath = '/tmp/storage/framework/';
foreach (['views', 'cache', 'sessions'] as $folder) {
    if (!is_dir($storagePath . $folder)) {
        @mkdir($storagePath . $folder, 0755, true);
    }
}

// Absolute paths use karein
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';

// Vercel specific storage config
$app->useStoragePath('/tmp/storage');

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response = $kernel->handle(
    $request = Request::capture()
);
$response->send();
$kernel->terminate($request, $response);