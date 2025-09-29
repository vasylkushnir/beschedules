## Description
API for train schedules

http://localhost:3000/docs#/

## Prerequisites

- Node.js 20
- npm (bundled with Node)
- Docker (latest stable)
- Docker Compose

## Get the code & install dependencies

```sh
git clone <REPO_URL> <PROJECT_DIR>
cd <PROJECT_DIR>
npm i
```

## Environment
1. Create a .env file next to your docker-compose.yml
2. Copy/paste and adjust values as needed
```sh
NODE_ENV=development
PORT=3000

DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=app_db
DB_SSL=false

# JWT
JWT_SECRET=change_me_to_a_long_random_string_at_least_32_chars
JWT_EXPIRES_IN=15m
```

## First-time setup (clean DB → generate & run migrations → start app)
1. Build the API image
2. Start only the DB and wait until it’s healthy
3. Generate the initial migration from TS entities
4. Apply migrations
5. Start the full stack

```sh
docker compose build api
docker compose up -d db
docker compose logs -f db    # wait for: "accepting connections"
docker compose run --rm api npm run migration:generate
docker compose run --rm api npm run migration:run
docker compose up -d
```

## Everyday usage
1. Start (create if missing, run in background)
2. Stop / Start without recreating
3. Restart only API
4. Shut down (keep data)
5. Shut down and delete DB data (volume)
   
```sh
docker compose up -d --build
docker compose stop
docker compose start
docker compose restart api
docker compose down
docker compose down -v
```