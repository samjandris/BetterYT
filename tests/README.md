# BetterYT End-to-End Tests

This directory contains Playwright tests for the BetterYT browser extension, specifically focusing on the mini player functionality.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Install Playwright browsers:

   ```bash
   npx playwright install
   ```

3. Build the extension:
   ```bash
   npm run build:chrome
   ```

## Running Tests

### Basic test execution:

```bash
npm test
```

### Run tests with browser visible (headed mode):

```bash
npm run test:headed
```

### Run tests with interactive UI:

```bash
npm run test:ui
```

### Debug tests step by step:

```bash
npm run test:debug
```

## Test Structure

### `mini-player.spec.ts`

Comprehensive tests for the mini player functionality, including:

- **Watch Page Behavior**: Tests that verify the mini player shows/hides correctly on YouTube watch pages
- **Non-Watch Page Behavior**: Tests that ensure the mini player doesn't appear on other YouTube pages
- **Navigation Between Pages**: Tests for proper state management when navigating between pages
- **Scroll Threshold Behavior**: Tests for precise scroll-based trigger behavior

### Test Helper Class: `MiniPlayerTestHelper`

The `MiniPlayerTestHelper` class provides utility methods for:

- Extension initialization and setup
- Navigation to different YouTube page types
- Mini player visibility detection
- Scroll position management
- Player bounds calculation

## Test Coverage

The tests verify these key requirements:

1. ✅ **Page Restriction**: Mini player only appears on YouTube watch pages (`/watch` URLs)
2. ✅ **Scroll Trigger**: Mini player only shows when scrolled below the main video player
3. ✅ **Hide on Scroll Up**: Mini player hides when scrolling back to the top
4. ✅ **Non-Watch Pages**: Mini player never appears on home, search, or channel pages
5. ✅ **Navigation**: Mini player state is properly managed during page navigation
6. ✅ **Threshold Behavior**: Mini player appears exactly at the scroll threshold

## Extension Testing Notes

### Chrome Extension Loading

The tests automatically load the built extension in Chrome using these launch arguments:

- `--disable-extensions-except=${dist-directory}`
- `--load-extension=${dist-directory}`

### Extension Initialization

Each test waits for the extension to load and enables the mini player feature before running assertions.

### Test Video

Tests use a default YouTube video ID (`dQw4w9WgXcQ`) for consistent testing. This can be overridden in individual tests if needed.

## Debugging

### Common Issues

1. **Extension not loading**: Ensure the extension is built (`npm run build:chrome`) before running tests
2. **Timing issues**: The tests include appropriate waits for extension initialization and YouTube page loads
3. **Scroll detection**: Tests wait for scroll events to be processed before checking mini player state

### Debug Mode

Use `npm run test:debug` to step through tests interactively and inspect the browser state.

### Screenshots and Videos

Failed tests automatically capture screenshots and videos in the `test-results` directory.

## CI/CD Integration

The tests are configured to run in CI environments with:

- Retry logic for flaky tests
- Parallel execution disabled in CI
- Comprehensive reporting with HTML output

## Adding New Tests

When adding new mini player tests:

1. Use the `MiniPlayerTestHelper` class for common operations
2. Follow the existing test structure with descriptive test groups
3. Include both positive and negative test cases
4. Test edge cases around scroll thresholds
5. Verify behavior across different YouTube page types
