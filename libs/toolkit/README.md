<p align="center">
  <h1 align="center">ZDnevnik Toolkit</h1>
</p>

ZDnevnik Toolkit is a common/shared tools and libraries for the projects. It mainly consists of [zod](https://github.com/colinhacks/zod) schemas, which are shared between the API and web app. It also contains scripts which are used to make the development process easier.

## Scripting

All of the utilities and tools related to scripts are located in the [scripting](./scripting) folder. Whilst the actual scripts are located in the [scripts](./scripts) folder.

## Scripts

Here's a list of all the scripts:

- [generate_project_name_types](./scripts/generate_project_name_types.ts) - This script is used to generate all of the pnpm workspace names (`api`, `sveltastic` and `toolkit`) and generate [an enum](./scripting/types/project.types.ts) for them. This makes working with project paths more type-safe.