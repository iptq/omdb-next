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

  How I'm migrating the data

  ```mermaid
  flowchart TD
    F --> E --> D
    A --> B --> C --> D
    A[data dump]
    B[import into a running mysql database]
    C[prisma db pull from database]
    D[import dump script]
    E[kysely type definitions]
    F[clean-room prisma schemas based on the original]
  ```
