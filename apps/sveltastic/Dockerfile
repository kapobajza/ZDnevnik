FROM node:20.10.0 AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /app

RUN corepack enable

COPY . .

RUN --mount=type=cache,id=pnpm-store,target=${PNPM_HOME}/store pnpm install --frozen-lockfile


FROM base AS local
COPY ./apps/sveltastic/scripts/update_local_hosts.sh /usr/local/bin/update_local_hosts.sh
RUN chmod +x /usr/local/bin/update_local_hosts.sh

# Set the entrypoint to run the script
ENTRYPOINT ["/usr/local/bin/update_local_hosts.sh"]

CMD ["pnpm", "run", "sv:dev"]

FROM base AS prod
CMD ["pnpm", "run", "sv:build"]
CMD ["node", "apps/sveltastic/build"]