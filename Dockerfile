# Use Node.js 24 (matching volta config)
FROM node:24-alpine

# Install FFmpeg (required for @discordjs/voice audio processing)
RUN apk add --no-cache ffmpeg

# Install pnpm globally
RUN npm install -g pnpm@10.27.0

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Expose port (if needed for health checks, adjust as necessary)
# EXPOSE 3000

# Run the production command
CMD ["pnpm", "prod"]

