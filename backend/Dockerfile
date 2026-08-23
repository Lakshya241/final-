# AURA Backend — Production Dockerfile (Render-ready, SQLite)
FROM php:8.3-cli

# System deps + SQLite extension (pdo_sqlite is bundled in the image)
RUN apt-get update \
    && apt-get install -y --no-install-recommends git unzip libsqlite3-dev \
    && docker-php-ext-install pdo pdo_sqlite \
    && rm -rf /var/lib/apt/lists/*

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Install PHP deps (cached layer)
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader

# Copy app source
COPY . .

# Create the SQLite file if it doesn't exist
RUN mkdir -p database && touch database/database.sqlite

# Storage permissions
RUN chmod -R 775 storage bootstrap/cache

EXPOSE 10000

# On startup: copy .env if missing, migrate, seed, cache config, then serve
CMD ["sh", "-c", \
  "[ -f .env ] || cp .env.example .env && \
   php artisan key:generate --force && \
   php artisan migrate --force && \
   php artisan db:seed --class=ProductSeeder --force && \
   php artisan config:cache && \
   php artisan route:cache && \
   php artisan serve --host=0.0.0.0 --port=${PORT:-10000}"]
