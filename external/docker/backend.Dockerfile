FROM imbios/bun-node:1.1.42-22.12.0-debian AS builder
WORKDIR /usr/local

ENV NODE_ENV=production
COPY package.json .
COPY turbo.json .
COPY ./apps/backend ./apps/backend
COPY ./packages ./packages

RUN bun i
RUN cd apps/backend && bun run prisma:generate
RUN bun run build


FROM oven/bun:1.1.42 AS runner
WORKDIR /usr/local

COPY --from=builder /usr/local/apps/backend/dist .
COPY --from=builder /usr/local/apps/backend/src/public ./src/public
COPY --from=builder /usr/local/apps/backend/package.json .
COPY --from=builder /usr/local/node_modules ./node_modules

# copy .env files
COPY --from=builder /usr/local/apps/backend/.env.local .
COPY --from=builder /usr/local/apps/backend/.env.production .

CMD ["bun", "run", "start"]