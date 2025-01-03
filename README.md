# carbon-nexus

testing. this is a test

fullstack boilerplate with turborepo integration

- nextjs
- nestjs (+ prisma)
- devtools and stuff (biome, turborepo)
- login/logout, oauth, email integration
- (WIP) tests

## Setup

### Production
0. Requires docker daemon to be [running](https://docs.docker.com/engine/daemon/start/).
1. `docker compose up -d --build`

### Dev
0. Requires [bun](https://bun.sh/). In the root directory, run `bun i`.
1. `cd apps/backend && bun run prisma:generate` to generate a prisma client.
2. `bun run dev`

## Known Issues
'Failed to find server action' workaround: https://github.com/vercel/next.js/discussions/58431#issuecomment-2339327871
