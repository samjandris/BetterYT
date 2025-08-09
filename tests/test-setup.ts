/**
 * Global test setup for BetterYT Playwright tests
 */

import { test as base } from "@playwright/test";

// Extend the base test to include common setup
export const test = base.extend({
  // Add any custom fixtures here if needed
});

export { expect } from "@playwright/test";
