#!/usr/bin/env sh
set -euxo pipefail
env
npx prisma migrate deploy

# Because next.js is stupid, it strips env variables and only reads them from .env
echo "DATABASE_URL=${DATABASE_URL}" >> .env
exec node server.js