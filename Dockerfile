# Multi-stage build for better optimization
FROM node:22-slim AS base

# Set working directory
WORKDIR /app

# Install system dependencies including Chrome/Puppeteer requirements
RUN apt update -y && apt install -y \
    iputils-ping \
    telnet \
    wget \
    gnupg \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libatspi2.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libxss1 \
    libxtst6 \
    xdg-utils \
    libglib2.0-0 \
    libnss3-dev \
    libatk-bridge2.0-dev \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libxss1 \
    libasound2 \
    && rm -rf /var/lib/apt/lists/*

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