# TSPlatform

## Setup

Make sure to edit `.env.example` in `apps/*`!

### Production
0. Requires docker daemon to be [running](https://docs.docker.com/engine/daemon/start/).
1. `docker compose up -d --build`

### Dev
0. Requires docker daemon to be [running](https://docs.docker.com/engine/daemon/start/). Requires [bun](https://bun.sh/).
1. `bun i` in root directory to install packages.
2. `cd apps/backend && bun run prisma:generate` to generate a prisma (database ORM) client.
3. `bun run prepare` to setup pre-commit hooks.
4. `cd scripts/dev && bun run init-minio` to start a minio container used for image storage.
5. `bun run dev` to start the dev server.

