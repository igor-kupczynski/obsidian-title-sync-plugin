# Title Sync Plugin for Obsidian

Sync the first H1 header of a markdown file with its filename using a manual command.

> **Note:** This plugin is currently [under review](https://github.com/obsidianmd/obsidian-releases/pull/9752) for inclusion in the Obsidian Community Plugins directory. In the meantime, you can install it manually.

## Features

- **Single command**: "Title Sync: Sync title to filename"
- Extracts the first H1 header after frontmatter (skips code blocks)
- Transforms the title to a valid filename:
  - Strips markdown formatting (bold, italic, links)
  - Replaces illegal filename characters with dashes
  - Truncates to 200 characters for cross-platform compatibility
- Shows notification on success/failure

## Installation

### From Obsidian Community Plugins

_Coming soon_ — the plugin is [under review](https://github.com/obsidianmd/obsidian-releases/pull/9752). Once approved:

1. Open Obsidian Settings
2. Go to Community Plugins and disable Safe Mode
3. Click Browse and search for "Title Sync"
4. Install and enable the plugin

### Manual Installation (recommended for now)

1. Download `main.js` and `manifest.json` from the [latest release](https://github.com/igor-kupczynski/obsidian-title-sync-plugin/releases)
2. Create a folder `title-sync` in your vault's `.obsidian/plugins/` directory
3. Copy `main.js` and `manifest.json` into the folder
4. Reload Obsidian
5. Enable the plugin in Settings > Community Plugins

## Usage

1. Open a markdown file with an H1 header (e.g., `# My Title`)
2. Open the command palette (Cmd/Ctrl + P)
3. Search for "Title Sync: Sync title to filename"
4. Run the command

The file will be renamed to match the H1 header.

### Setting Up a Keyboard Shortcut

1. Open Obsidian Settings
2. Go to Hotkeys
3. Search for "Title Sync: Sync title to filename"
4. Click the plus icon and set your preferred shortcut
   - Suggested: `Cmd+Option+T` (Mac) or `Ctrl+Alt+T` (Windows/Linux)

## Examples

| H1 Header | Resulting Filename |
|-----------|-------------------|
| `# My Title` | `My Title.md` |
| `# My **Bold** Title` | `My Bold Title.md` |
| `# Title: Subtitle` | `Title- Subtitle.md` |
| `# Is This Valid?` | `Is This Valid.md` |
| `# Link to [[Page]]` | `Link to Page.md` |

## Comparison with obsidian-filename-heading-sync

This plugin is inspired by [obsidian-filename-heading-sync](https://github.com/dvcrn/obsidian-filename-heading-sync) but takes a different approach:

| Feature | Title Sync | filename-heading-sync |
|---------|------------|----------------------|
| Sync trigger | Manual command only | Automatic (file open/save hooks) |
| Direction | H1 → filename | Bidirectional |
| Auto-insert heading | No | Yes |
| Configuration | None needed | Multiple options |
| Philosophy | Simple, opinionated | Feature-rich |

**When to choose Title Sync:**
- You want full control over when syncing happens
- You prefer explicit actions over automatic behavior
- You don't need bidirectional sync or auto-insertion of headings

**When to choose filename-heading-sync:**
- You want automatic syncing without manual intervention
- You need bidirectional sync (filename changes update heading)
- You want the plugin to auto-insert H1 headers in new files

## Development

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Run tests
npm test

# Run linting
npm run lint

# Run all checks
npm run check

# Development mode (watch)
npm run dev
```

## License

MIT
