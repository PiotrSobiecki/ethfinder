# Build statycznego eksportu Next.js, serwowany przez nginx.
# Node 25 nie ma juz corepacka w obrazie - major zostaje na 22 (to samo, co
# weryfikuje CI), dopoki `corepack enable` jest jedynym zrodlem pnpm.
FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
# Wersja pnpm pochodzi z pola "packageManager" w package.json - jedno zrodlo
# prawdy wspolne z CI.
RUN corepack enable

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm run build

FROM nginx:alpine AS runner

RUN rm -rf /usr/share/nginx/html/*

# Wlasna konfiguracja zastepuje domyslna w calosci (nie doklada sie do
# conf.d), zeby naglowki bezpieczenstwa obowiazywaly dla kazdej odpowiedzi.
COPY nginx.conf /etc/nginx/nginx.conf
COPY nginx-security-headers.conf /etc/nginx/snippets/security-headers.conf

COPY --from=builder /app/out /usr/share/nginx/html

EXPOSE 3000
ENV PORT=3000

CMD ["nginx", "-g", "daemon off;"]
