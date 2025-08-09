#!/bin/bash

# BetterYT Extension Test Runner
# This script builds the extension and runs the Playwright tests

set -e

echo "🔧 Building BetterYT extension..."
npm run build:chrome

echo "📁 Checking build output..."
if [ ! -f "build/manifest.json" ]; then
    echo "❌ Build failed - manifest.json not found in build directory"
    exit 1
fi
echo "✅ Extension built successfully"

echo "🧪 Running Playwright tests..."
# Note: npm test already includes the build step, but we build separately for validation
npx playwright test

echo "✅ Tests completed! Check test-results/ for any failure details."