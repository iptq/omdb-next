## Architecture

This uses a standard Next.js project layout.

## Developer Setup

- Next.js setup

  ```
  npm install
  npx prisma generate
  ```

- Instructions for setting up the old db

  ```
  docker compose up -d
  docker compose exec -T old-db mysql -pexample -e "create database omdb"
  docker compose exec -T old-db mysql omdb -pexample < ~/Downloads/db.sql
  npx prisma db pull --schema=./old-db/schema.prisma
  npx prisma generate --schema=./old-db/schema.prisma
  ```
