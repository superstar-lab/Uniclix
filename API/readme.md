1. composer update
2. php artisan migrate --seed (if you forget to seed the permissions will throw an error)
3. php artisan config:cache (just to make sure)
4. php artisan passport:install (copy one of the keys then and use as client secret on the client)
