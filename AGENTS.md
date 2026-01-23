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

## Releasing

### Creating a Release

1. Update version in `manifest.json` and `package.json`
2. Commit and push to main
3. Create a GitHub release:
   - Tag must match version in `manifest.json` exactly (e.g., `1.0.0`, no `v` prefix)
   - Attach `main.js` and `manifest.json` as release assets

### Publishing to Obsidian Community Plugins

Prerequisites (all met for this repo):
- Public GitHub repository
- `manifest.json` with required fields: `id`, `name`, `version`, `minAppVersion`, `description`, `author`
- GitHub release with `main.js` and `manifest.json` attached

To submit:
1. Fork https://github.com/obsidianmd/obsidian-releases
2. Add entry to `community-plugins.json` (alphabetically by id):
   ```json
   {
     "id": "title-sync",
     "name": "Title Sync",
     "author": "Igor Kupczyński",
     "description": "Sync the first H1 header with the filename via a manual command.",
     "repo": "igor-kupczynski/obsidian-title-sync-plugin"
   }
   ```
3. Submit PR to `obsidianmd/obsidian-releases`

## Obsidian Plugin Guidelines

Reference: https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines

### General
- **No global app**: Use `this.app` not global `app` or `window.app`
- **No unnecessary logging**: Console should only show errors in production
- **Organize code**: Use folders if multiple `.ts` files
- **Rename placeholders**: Don't use `MyPlugin`, `MyPluginSettings`, `SampleSettingTab`

### Mobile
- **No Node/Electron APIs**: These crash on mobile
- **No lookbehind regex**: Only supported on iOS 16.4+

### UI Text
- **Sentence case**: "Template folder location" not "Template Folder Location"
- **No redundant headings**: Avoid "Settings" in settings headings
- **Use setHeading()**: Not `<h1>`, `<h2>` for consistent styling

### Security
- **No innerHTML/outerHTML/insertAdjacentHTML**: Use DOM API or `createEl()`, `createDiv()`, `createSpan()`
- **Use el.empty()** to cleanup HTML element contents

### Resource Management
- **Clean up on unload**: Use `registerEvent()`, `addCommand()` for automatic cleanup
- **Don't detach leaves in onunload**: Breaks leaf position on plugin update

### Commands
- **No default hotkeys**: May conflict with user/plugin hotkeys
- **Use appropriate callback**: `callback` for unconditional, `checkCallback` for conditional, `editorCallback`/`editorCheckCallback` for editor commands

### Workspace
- **No `workspace.activeLeaf`**: Use `getActiveViewOfType()` or `activeEditor`
- **No custom view references**: Use `getActiveLeavesOfType()` instead

### Vault
- **Use Editor API**: Not `Vault.modify()` for active file (preserves cursor, selection)
- **Use Vault.process()**: Not `Vault.modify()` for background file edits (atomic)
- **Use FileManager.processFrontMatter()**: For frontmatter edits (atomic, consistent YAML)
- **Use Vault API**: Not Adapter API (`app.vault` not `app.vault.adapter`)
- **Use getFileByPath()**: Not iterating `getFiles()` to find by path
- **Use normalizePath()**: For user-defined paths

### Editor
- **Use updateOptions()**: To reconfigure editor extensions after registration

### Styling
- **No hardcoded styles**: Use CSS classes and CSS variables
- **Use Obsidian CSS variables**: For consistency with themes

### TypeScript
- **Use const/let**: Not `var`
- **Use async/await**: Not raw Promises
