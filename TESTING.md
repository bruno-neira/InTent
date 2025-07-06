# Testing Guide for InTent Browser Extension

This guide covers the comprehensive testing strategy for the InTent browser extension, including unit tests, integration tests, and end-to-end tests.

## Testing Stack

- **Unit Testing**: Vitest + Testing Library
- **Mocking**: Vitest built-in mocking
- **Browser Testing**: Puppeteer
- **Coverage**: Vitest coverage reports
- **CI/CD**: Docker support for consistent testing

## Test Types

### 1. Unit Tests

Test individual components and functions in isolation.

**Location**: `src/**/*.test.{ts,tsx}`

**Examples**:
- React component behavior (`ChatInterface.test.tsx`)
- Content script logic (`content.test.ts`)
- Background script functionality (`background.test.ts`)

**Run tests**:
```bash
npm test                    # Run all tests
npm run test:ui            # Run with UI
npm run test:coverage      # Run with coverage report
```

### 2. Integration Tests

Test how different parts of the extension work together.

**What we test**:
- Message passing between content script and background
- Chrome API interactions
- OpenAI API integration
- Storage operations

### 3. End-to-End Tests

Test the complete user workflow in a real browser environment.

**Location**: `tests/e2e/`

**What we test**:
- Extension loading in Chrome
- Chat interface injection on LinkedIn
- Feed hiding functionality
- Keyboard shortcuts
- Extension popup

**Run E2E tests**:
```bash
npm run test:e2e           # Full E2E test suite
```

## Test Setup

### Mocking Strategy

#### Chrome Extension APIs
```typescript
// Automatic global chrome mock in tests/setup.ts
const mockChrome = {
  runtime: {
    sendMessage: vi.fn(),
    onMessage: { addListener: vi.fn() }
  },
  storage: {
    sync: { get: vi.fn(), set: vi.fn() }
  }
}
global.chrome = mockChrome
```

#### DOM APIs
```typescript
// DOM mocking for content script tests
const mockDocument = {
  createElement: vi.fn(),
  querySelector: vi.fn(),
  addEventListener: vi.fn()
}
vi.stubGlobal('document', mockDocument)
```

#### Network Requests
```typescript
// Mock fetch for OpenAI API calls
const mockFetch = vi.fn().mockResolvedValue({
  ok: true,
  json: () => Promise.resolve({ choices: [{ message: { content: 'AI response' } }] })
})
vi.stubGlobal('fetch', mockFetch)
```

## Running Tests

### Local Development

```bash
# Install dependencies
npm install

# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests with UI (great for debugging)
npm run test:ui

# Run E2E tests (requires built extension)
npm run test:e2e
```

### Docker Testing

```bash
# Run all tests in Docker
npm run test:docker

# Or with docker-compose
docker-compose run --rm intent-test
```

### Continuous Integration

The Docker setup makes CI/CD easy:

```yaml
# Example GitHub Actions
- name: Run Tests
  run: |
    docker-compose run --rm intent-build
    docker-compose run --rm intent-test
```

## Test Coverage

### Current Coverage Goals

- **Unit Tests**: >80% line coverage
- **Integration Tests**: Critical user flows
- **E2E Tests**: Main extension features

### Viewing Coverage

```bash
npm run test:coverage
# Opens coverage report in browser
```

Coverage reports include:
- Line coverage
- Function coverage
- Branch coverage
- Statement coverage

## Writing Tests

### Unit Test Example

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ChatInterface from './ChatInterface'

describe('ChatInterface', () => {
  it('renders welcome message', () => {
    render(<ChatInterface onClose={vi.fn()} />)
    expect(screen.getByText(/Hi! I'm your Intentional LinkedIn assistant/)).toBeInTheDocument()
  })
})
```

### E2E Test Example

```typescript
import puppeteer from 'puppeteer'

describe('Extension E2E', () => {
  it('should inject chat interface', async () => {
    const browser = await puppeteer.launch({ /* extension config */ })
    const page = await browser.newPage()
    await page.goto('https://www.linkedin.com/feed/')
    
    const chatInterface = await page.$('#intentional-linkedin-chat')
    expect(chatInterface).toBeTruthy()
  })
})
```

## Testing Best Practices

### 1. Test Structure
- **Arrange**: Set up test data and mocks
- **Act**: Execute the functionality
- **Assert**: Verify the expected outcome

### 2. Mocking Guidelines
- Mock external dependencies (Chrome APIs, network calls)
- Keep mocks simple and focused
- Reset mocks between tests

### 3. Test Naming
- Use descriptive names: `should render welcome message when component loads`
- Group related tests with `describe` blocks
- Test both happy path and edge cases

### 4. Async Testing
```typescript
// Use waitFor for async operations
await waitFor(() => {
  expect(screen.getByText('AI response')).toBeInTheDocument()
})
```

## Common Testing Scenarios

### Testing React Components
- Rendering
- User interactions
- Props handling
- State changes

### Testing Content Scripts
- DOM manipulation
- Event listeners
- Chrome API calls
- LinkedIn page detection

### Testing Background Scripts
- Message handling
- API calls
- Storage operations
- Error handling

### Testing Extension Integration
- Message passing
- Storage sync
- Popup interactions
- Keyboard shortcuts

## Debugging Tests

### Using Test UI
```bash
npm run test:ui
```
Provides a visual interface for:
- Running individual tests
- Viewing test output
- Debugging failures

### Browser DevTools for E2E
Set `headless: false` in Puppeteer config to see browser during E2E tests.

### Log Debugging
```typescript
// Add debug logs in tests
console.log('Current state:', await page.evaluate(() => document.body.innerHTML))
```

## Performance Testing

### Bundle Size
Monitor extension size impact:
```bash
npm run build
du -sh dist/
```

### Memory Usage
Test for memory leaks in E2E tests:
```typescript
// Monitor memory in Puppeteer
const metrics = await page.metrics()
console.log('Memory usage:', metrics.JSHeapUsedSize)
```

## Accessibility Testing

### Automated A11y Tests
```typescript
import { axe } from 'jest-axe'

it('should be accessible', async () => {
  const { container } = render(<ChatInterface onClose={vi.fn()} />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

## Security Testing

### Content Security Policy
Test CSP compliance in E2E tests:
```typescript
// Check for CSP violations
page.on('console', msg => {
  if (msg.type() === 'error' && msg.text().includes('CSP')) {
    throw new Error('CSP violation detected')
  }
})
```

## Test Data Management

### Mock Data
Keep test data in separate files:
```typescript
// tests/fixtures/messages.ts
export const mockMessages = [
  { id: '1', content: 'Hello', sender: 'user' },
  { id: '2', content: 'Hi there!', sender: 'assistant' }
]
```

### Environment Variables
```bash
# .env.test
OPENAI_API_KEY=test-key-for-testing
LINKEDIN_TEST_URL=https://www.linkedin.com/feed/
```

## Troubleshooting

### Common Issues

1. **Chrome extension not loading in tests**
   - Ensure extension is built (`npm run build`)
   - Check manifest.json syntax
   - Verify file permissions

2. **Tests timing out**
   - Increase timeout in vitest config
   - Add proper waits for async operations

3. **Puppeteer issues**
   - Check Chrome/Chromium installation
   - Verify extension loading arguments

4. **Mock not working**
   - Ensure mocks are set up before imports
   - Check mock reset in setup files

### Getting Help

- Check test output for detailed error messages
- Use `npm run test:ui` for visual debugging
- Review browser console in E2E tests
- Check the test setup files for mock configurations

## Contributing

When adding new features:

1. **Write tests first** (TDD approach)
2. **Update this documentation** if adding new test patterns
3. **Ensure coverage** doesn't drop below thresholds
4. **Test in both Docker and local environments**

## Future Improvements

- [ ] Visual regression testing
- [ ] Performance benchmarking
- [ ] Multi-browser E2E testing
- [ ] Accessibility automation
- [ ] Security scanning integration
