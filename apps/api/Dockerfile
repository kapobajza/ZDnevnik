FROM node:20.10.0
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /app

RUN corepack enable

COPY . .

RUN --mount=type=cache,target=${PNPM_HOME} pnpm install --frozen-lockfile

CMD ["sh", "-c", "pnpm run api:migrate up && pnpm run api:dev"]