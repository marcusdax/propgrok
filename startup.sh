#!/bin/sh
set -eu
cd /workspace

# Stop any running preview
node scripts/preview.mjs stop || true

# Check if app is already running
if curl -sf -o /dev/null --max-time 2 http://127.0.0.1:8080/; then
  exit 0
fi

# If running in Docker, wait for database
if [ -n "$DATABASE_URL" ]; then
  echo "Waiting for database connection..."
  for i in 1 2 3 4 5 6 7 8 9 10; do
    if node -e "require('pg').default || require('pg')" 2>/dev/null; then
      break
    fi
    sleep 1
  done
fi

# Run database migrations if in production mode
if [ "$NODE_ENV" = "production" ]; then
  echo "Running database migrations..."
  npm run db:migrate || echo "Migrations failed or already applied"
fi

# Start the application
npm run dev >>/tmp/app-startup.log 2>&1 &

# Wait for it to be ready
for i in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20; do
  if curl -sf -o /dev/null --max-time 2 http://127.0.0.1:8080/; then
    echo "Application is ready"
    exit 0
  fi
  sleep 1
done

echo "Application did not start within 20 seconds"
exit 1