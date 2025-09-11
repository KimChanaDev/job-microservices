#!/bin/bash

# Wait for database to be ready
echo "Waiting for database to be ready..."
until pg_isready -h postgres -p 5432 -U jobber; do
  echo "Database is unavailable - sleeping"
  sleep 1
done

echo "Database is ready!"

# Run database migrations
echo "Running database migrations..."
npx prisma migrate deploy --schema ./prisma/schema.prisma

# Start the application
echo "Starting the application..."
exec "$@"
