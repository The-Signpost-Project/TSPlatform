FROM oven/bun:1.2.16 AS builder
WORKDIR /usr/local

ENV NODE_ENV=production
COPY package.json .
COPY turbo.json .
COPY ./apps/frontend ./apps/frontend
COPY ./packages ./packages

RUN bun i
RUN bun run build


FROM oven/bun:1.2.16 AS runner
WORKDIR /usr/local

COPY --from=builder /usr/local/apps/frontend/.next ./.next
COPY --from=builder /usr/local/apps/frontend/public ./public
COPY --from=builder /usr/local/apps/frontend/package.json .
COPY --from=builder /usr/local/apps/frontend/next.config.ts .
COPY --from=builder /usr/local/node_modules ./node_modules

# copy .env files
COPY --from=builder /usr/local/apps/frontend/.env.production .

CMD ["bun", "run", "start"]