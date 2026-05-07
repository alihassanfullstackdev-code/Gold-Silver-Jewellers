<?php

use Illuminate\Http\Request;

// Vercel ke liye temporary storage paths set karna
mkdir('/tmp/storage/framework/views', 0755, true);
mkdir('/tmp/storage/framework/cache', 0755, true);
mkdir('/tmp/storage/framework/sessions', 0755, true);

define('LARAVEL_START', microtime(true));

// Composer autoloader load karein
require __DIR__ . '/../vendor/autoload.php';

// Laravel application bootstrap karein
$app = require_once __DIR__ . '/../bootstrap/app.php';

// Vercel ke liye custom storage path set karein
$app->useStoragePath('/tmp/storage');

$app->handleRequest(Request::capture());