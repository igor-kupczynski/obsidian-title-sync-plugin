# CLAUDE.md

This file provides guidance for AI assistants working on this codebase.

## Project Overview

This is an Obsidian plugin that syncs the first H1 header with the filename via a manual command.

## Build Commands

```bash
npm run build      # Build for production (TypeScript check + esbuild)
npm run dev        # Development mode with watch
npm test           # Run unit tests
npm run lint       # Run ESLint
npm run format     # Format code with Prettier
npm run check      # Run all checks (lint, format, build, test)
```

## Project Structure

```
src/
  main.ts          # Plugin entry point, command registration
  utils.ts         # Core functions: extractFirstH1(), titleToFilename()
tests/
  utils.test.ts    # Unit tests for utility functions
```

## Key Implementation Details

### extractFirstH1(content: string): string | null

Extracts the first H1 header from markdown content:
- Skips YAML frontmatter (delimited by `---` or `...`)
- Skips H1 headers inside fenced code blocks (``` or ~~~)
- Returns the header text without the `#` prefix
- Returns null if no H1 found

### titleToFilename(title: string): string

Transforms a title to a valid filename:
1. Strips markdown formatting (bold, italic, links, etc.)
2. Replaces illegal filename chars `* " \ / < > : | ? # ^ [ ]` with `-`
3. Collapses multiple dashes; collapses space-dash-space to space
4. Trims leading/trailing dashes and spaces
5. Truncates to 200 characters

## Testing

Tests use Vitest. Run with `npm test` or `npm run test:watch` for watch mode.

## Code Quality

- ESLint with TypeScript-ESLint for strict linting
- Prettier for formatting
- Strict TypeScript configuration
- Husky pre-commit hook runs full check
- GitHub Actions CI on push/PR
