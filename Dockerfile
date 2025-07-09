# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install system dependencies for potential testing tools
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    && rm -rf /var/cache/apk/*

# Set Chromium path for Puppeteer (if used for testing)
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Copy package files first for better Docker layer caching
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production=false

# Copy source code
COPY . .

# Create dist directory
RUN mkdir -p dist

# Build the extension
RUN npm run build

# Expose port for development server (if needed)
EXPOSE 5173

# Default command - can be overridden
CMD ["npm", "run", "build"]

# For testing, you can override with:
# docker run -it <image-name> npm test
# docker run -it <image-name> npm run dev

# Health check to ensure the build succeeded
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD test -d /app/dist || exit 1
