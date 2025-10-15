# Multi-stage build for better optimization
FROM node:20-slim AS base

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt update -y && apt install -y iputils-ping telnet && rm -rf /var/lib/apt/lists/*

# Install PM2 globally
RUN yarn global add pm2

# Dependencies stage
FROM base AS dependencies

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile --production=false

# Build stage
FROM dependencies AS builder

# Copy source code
COPY . .
COPY ecosystem.config.js ./ecosystem.config.js

# Copy the production .env file
# COPY .env.prod .env

# Generate Prisma client without database connection
RUN npx prisma generate --schema=./src/prisma/schema.prisma

# Build the application
RUN yarn build

# Production stage
FROM base AS production

# Copy package files
COPY package.json yarn.lock ./

# Install only production dependencies
RUN yarn install --frozen-lockfile --production=true && yarn cache clean

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/prisma ./src/prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/ecosystem.config.js ./ecosystem.config.js

# Generate Prisma client in production stage
RUN npx prisma generate --schema=./src/prisma/schema.prisma

# Expose the desired port
EXPOSE 80

# Health check
# HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
#   CMD curl -f http://localhost:1080/health || exit 1

# Start the application
CMD ["pm2-runtime", "start", "ecosystem.config.js"]