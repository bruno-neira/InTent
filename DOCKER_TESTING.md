# Docker Testing Setup for InTent Browser Extension

This directory contains Docker configuration for building and testing the InTent browser extension.

## Files Created

- `Dockerfile` - Multi-stage Docker image for building and testing
- `docker-compose.yml` - Docker Compose configuration for different environments
- `.dockerignore` - Optimizes Docker build by excluding unnecessary files

## Usage

### Build the Extension

```bash
# Using the build script
./build_docker.sh

# Or directly with docker-compose
docker-compose run --rm intent-build
```

### Development with Hot Reload

```bash
# Start development server in Docker
npm run dev:docker
# or
docker-compose up intent-dev

# Access at http://localhost:5173
```

### Run Tests

```bash
# Run tests in Docker
npm run test:docker
# or
docker-compose run --rm intent-test
```

### Build for Production

```bash
# Build the extension
docker-compose run --rm intent-build

# The built extension will be in the ./dist directory
# Load ./dist as an unpacked extension in Chrome
```

## Docker Image Features

- Based on Node.js 18 Alpine for smaller size
- Includes Chromium for potential browser testing
- Optimized layer caching with package.json copied first
- Health check to ensure successful builds
- Supports both development and production builds

## Testing Strategy

The Docker setup supports:

1. **Build Testing** - Ensures the extension builds successfully
2. **Development Environment** - Hot reload for development
3. **Unit Testing** - Framework ready for when tests are added
4. **Integration Testing** - Chromium included for browser automation

## Adding Tests

To add actual tests to this project:

1. Install a testing framework (Jest, Vitest, etc.)
2. Add test files in `src/__tests__/` or alongside components
3. Update the test script in package.json
4. Tests will automatically run in the Docker environment

## Environment Variables

Set these in docker-compose.yml or pass to docker run:

- `NODE_ENV` - development/test/production
- `PUPPETEER_EXECUTABLE_PATH` - Path to Chromium (already set)
- Add your OpenAI API key for integration tests if needed
