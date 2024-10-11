<p align="center">
  <h1 align="center">ZDnevnik API</h1>
</p>

ZDnevnik API is a RESTful API made with [Node](https://nodejs.org/en) using [Fastify](https://fastify.dev/). It stores data in a Postgres database and uses a [custom ORM](./src/db/orm.ts) to manage it. The decision to use a custom ORM and Fastify is only for educational purposes.

## Environment variables

Before running the API, you need to set up the ENV variables for it. There is an [`.env.example`](./.env.example) file that you can use as a template. Just make a new `.env.local` file and copy the contents of the `.env.example` file:

```sh
cp .env.example .env.local
```

## Getting started

For the prerequisites, see the list in the root [README](../../README.md#prerequisites).

After starting [docker compose](../../README.md#running-the-app), The API will be running on port 5050.

## Migrations

For migration management, this project is using [node-pg-migrate](https://www.npmjs.com/package/node-pg-migrate). Migrations are run automatically upon building the docker api service. But if you want to run them manually, you can run `pnpm run api:migrate up`.

## Testing

To test the API, run:

```sh
pnpm run api:test
```

This will run the `vitest` test runner.