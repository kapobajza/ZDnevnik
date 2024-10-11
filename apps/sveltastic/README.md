<p align="center">
  <h1 align="center">ZDnevnik Sveltastic</h1>
</p>

ZDnevnik Sveltastic is a web app made with [SvelteKit](https://kit.svelte.dev/), [Tailwind CSS](https://tailwindcss.com/) and [shadcn-svelte](https://www.shadcn-svelte.com/). Right now there is no need to use a dedicated back end API, all of it could've been done with Sveltekit. But I wanted to use Fastify for educational purposes.

## Environment variables

Before running the web app, you need to set up the ENV variables for it. There is an [`.env.example`](./.env.example) file that you can use as a template. Just make a new `.env.local` file and copy the contents of the `.env.example` file:

```sh
cp .env.example .env.local
```

## Getting started

For the prerequisites, see the list in the root [README](../../README.md#prerequisites).

After starting [docker compose](../../README.md#running-the-app), the web app will be running on port 3000.

## Translations

This project uses [typesafe-i18n](https://github.com/ivanhofer/typesafe-i18n) to manage translations. Running

```sh
pnpm run sv:translations
```

will start the translations server, which will enable to you to automatically update translation types when adding new translations to the  [i18n/{{locale}}](./src/i18n/ba/) folder.
