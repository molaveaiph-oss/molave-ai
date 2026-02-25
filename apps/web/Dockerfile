# ── build stage ──────────────────────────────────────────────────────────────
FROM node:20-slim AS builder
RUN npm install -g pnpm@9
WORKDIR /app

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY packages/types/package.json ./packages/types/
COPY apps/api/package.json       ./apps/api/
COPY apps/workers/package.json   ./apps/workers/
COPY apps/web/package.json       ./apps/web/

RUN pnpm install --frozen-lockfile

COPY packages/types ./packages/types
COPY apps/web       ./apps/web

RUN pnpm --filter @molave/types build
RUN pnpm --filter web build

# ── runtime stage: nginx ──────────────────────────────────────────────────────
FROM nginx:alpine AS runner

# Static assets from Vite build
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

# nginx config template (API_URL is substituted at container startup)
COPY apps/web/nginx.conf.template /etc/nginx/conf.d/nginx.conf.template

# Custom entrypoint: runs envsubst then starts nginx
COPY apps/web/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Remove the default nginx config (we provide our own via entrypoint)
RUN rm -f /etc/nginx/conf.d/default.conf

EXPOSE 8080

ENTRYPOINT ["/docker-entrypoint.sh"]
