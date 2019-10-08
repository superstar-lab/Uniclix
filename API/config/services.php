<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Stripe, Mailgun, SparkPost and others. This file provides a sane
    | default location for this type of information, allowing packages
    | to have a conventional place to find your various credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
    ],

    'ses' => [
        'key' => env('SES_KEY'),
        'secret' => env('SES_SECRET'),
        'region' => env('SES_REGION', 'us-east-1'),
    ],

    'sparkpost' => [
        'secret' => env('SPARKPOST_SECRET'),
    ],

    'stripe' => [
        'model' => App\Models\User::class,
        'key' => env('STRIPE_KEY'),
        'secret' => env('STRIPE_SECRET'),
    ],
    'twitter' => [
        'client_id'        => function_exists('env') ? env('TWITTER_CONSUMER_KEY', '') : '',
        'client_secret'     => function_exists('env') ? env('TWITTER_CONSUMER_SECRET', '') : '',
        'redirect'        => '/',
    ],
    'facebook' => [
        'client_id'        => function_exists('env') ? env('FACEBOOK_APP_ID', '') : '',
        'client_secret'     => function_exists('env') ? env('FACEBOOK_APP_SECRET', '') : '',
        'redirect'        => '/',
    ],
    'linkedin' => [
        'client_id'        => function_exists('env') ? env('LINKEDIN_CLIENT_ID', '') : '',
        'client_secret'     => function_exists('env') ? env('LINKEDIN_CLIENT_SECRET', '') : '',
        'redirect'        => '/',
    ],
    'pinterest' => [
        'client_id' => function_exists('env') ? env('PINTEREST_KEY', '') : '',
        'client_secret' => function_exists('env') ? env('PINTEREST_SECRET', '') : '',
        'redirect' => '/'
    ],
];
