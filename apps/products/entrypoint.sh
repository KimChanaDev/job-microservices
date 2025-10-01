#!/bin/bash

# Extract database connection details from DATABASE_URL
# Format: postgresql://username:password@host:port/database
DB_HOST=$(echo $AUTH_DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
DB_PORT=$(echo $AUTH_DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
DB_USER=$(echo $AUTH_DATABASE_URL | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')

# Default values if extraction fails
DB_HOST=${DB_HOST:-postgres}
DB_PORT=${DB_PORT:-5432}
DB_USER=${DB_USER:-postgres}

# Wait for database to be ready
echo "Waiting for database to be ready..."
echo "Checking connection to $DB_HOST:$DB_PORT with user $DB_USER"
until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER"; do
  echo "Database is unavailable - sleeping"
  sleep 1
done

echo "Database is ready!"

# Run database migrations
echo "Running database migrations..."
npm run drizzle-kit:migrate:prod

# Start the application
echo "Starting the application..."
exec "$@"
