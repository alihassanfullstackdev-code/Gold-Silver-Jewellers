<?php

use App\Providers\AppServiceProvider;

return [
    AppServiceProvider::class,
    bSecure\UniversalCheckout\CheckoutServiceProvider::class,
    bSecure\UniversalCheckout\SSOServiceProvider::class,
];