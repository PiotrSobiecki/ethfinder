# Use the official Node.js 18 image as base
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

# Build and export static files
RUN npm run build

# Debug: Check what was generated
RUN echo "=== Checking build output ===" && \
    ls -la /app/ && \
    echo "=== Checking out directory ===" && \
    ls -la /app/out/ && \
    echo "=== Content of out ===" && \
    find /app/out -type f | head -10

# Production image with nginx
FROM nginx:alpine AS runner

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy the static export from builder stage
COPY --from=builder /app/out /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Create a simple health check file
RUN echo "healthy" > /usr/share/nginx/html/health.txt

# Debug: List final contents
RUN echo "=== Final nginx contents ===" && ls -la /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
