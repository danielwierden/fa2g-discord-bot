# Use Node.js 24 (matching volta config)
FROM node:24-alpine

# Install FFmpeg (required for @discordjs/voice audio processing)
# Update package index and install ffmpeg, then verify installation and location
RUN apk update && \
    apk add --no-cache ffmpeg && \
    which ffmpeg && \
    ffmpeg -version

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

# Ensure FFmpeg is in PATH (should already be there, but being explicit)
ENV PATH="/usr/bin:/usr/local/bin:${PATH}"

# Verify FFmpeg is available and working
RUN command -v ffmpeg > /dev/null && ffmpeg -version || (echo "Error: FFmpeg not found in PATH" && exit 1)

# Expose port (if needed for health checks, adjust as necessary)
# EXPOSE 3000

# Run the production command
CMD ["pnpm", "prod"]

