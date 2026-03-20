# ScreenIt 📸

A lightweight, recipe-based screenshot engine powered by Playwright and TypeScript. `ScreenIt` allows you to define custom "recipes" for different websites to handle complex interactions like cookie banners, lazy-loaded content, and UI cleanup before capturing high-quality, full-page screenshots.

## Features

-   **Recipe-Driven:** Define viewports, user agents, and interaction rules per site.
-   **Intelligent Auto-Scroll:** Automatically scrolls through pages to trigger lazy-loading of images and components.
-   **UI Cleanup:** Remove distracting elements (ads, banners, notices) using CSS selectors before capture.
-   **Interaction Support:** Pre-click elements (like "Accept Cookies") to prepare the page state.
-   **Full-Page Capture:** Captures the entire scrollable area of the page.
-   **Built for Bun:** Optimized for the Bun runtime but compatible with Node.js.

## Getting Started

### Prerequisites

-   [Bun](https://bun.sh/) (recommended) or Node.js
-   Playwright browsers

### Installation

```bash
bun install
bunx playwright install chromium
```

### Usage

You can run the engine directly against a URL:

```bash
bun engine.ts https://example.com
```

Screenshots are saved to the `./output/recipe/` directory with a timestamped filename.

## Recipes

Recipes are defined using the `SiteRecipe` interface:

```typescript
interface SiteRecipe {
  name: string;
  viewport?: { width: number; height: number };
  userAgent?: string;
  waitCondition?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit';
  clickSelectors?: string[];   // Elements to click before screenshot
  removeSelectors?: string[];  // Elements to hide via 'display: none'
  maxScrolls?: number;         // Control how deep the auto-scroll goes
}
```

## Project Structure

-   `engine.ts`: Core logic for browser automation and screenshot capture.
-   `types.ts`: TypeScript definitions for recipes and configurations.
-   `output/`: Default directory for generated images.

## License

MIT
