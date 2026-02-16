# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Repository Overview

This is the Tiger Data documentation repository, containing the source content for https://www.tigerdata.com/docs/. Tiger Data (formerly Timescale) is a modern Postgres data platform for time series, events, analytics, and vector search. The documentation is written in Markdown with custom components and is built separately in a private Gatsby-based repository.

## Development Workflow

### Link Checking
Run link checker locally:
```bash
npx markdown-link-check <file.md> --config mlc_config.json
```

### Linting Documentation
The repository uses Vale for prose linting:
```bash
vale --glob='["_partials/**/*", "_troubleshooting/**/*", "about/**/*", "api/**/*", "getting-started/**/*", "mst/**/*", "navigation/**/*", "self-hosted/**/*", "tutorials/**/*", "use-timescale/**/*", "ai/**/*"]'
```

Vale configuration is in `.vale.ini` and uses Vale + Google style guides.

### Markdown Linting
Custom markdownlint rules are in `.vscode/markdownlint/` and configured via `.markdownlint.json` and `.markdownlint-cli2.jsonc`. These enforce documentation-specific patterns like:
- Proper blank lines around `<Highlight>` blocks
- Correct `<Procedure>` formatting
- Proper frontmatter structure

### Creating Hyperfunction Documentation
Use the template generator script for new two-step aggregate hyperfunction groups:
```bash
npm run template:hyperfunction
```

This interactive script creates the directory structure and template files in `api/_hyperfunctions/`.

### Bulk Editing API Excerpts
Helper scripts in `.helper-scripts/` for bulk frontmatter editing:
```bash
cd .helper-scripts
./extract-excerpts.sh  # Extract excerpts to single file
# Edit extracted_excerpts.md
./insert-excerpts.sh   # Update original files
```

## Architecture

### Navigation Hierarchy
Navigation structure is governed by `page-index/page-index.js` files throughout the repository. The top-level `page-index/page-index.js` imports and combines all section-level navigation files.

**Page index structure:**
- `href`: URL segment, must match markdown filename (without extension)
- `title`: Page name in left TOC
- `excerpt`: Short description (up to 100 chars) for page cards
- `type`: Optional - `directory`, `placeholder`, `redirect-to-child-page`
- `children`: Array of child pages
- `pageComponents`: Display style for child pages - `['featured-cards']` or `['content-list']`
- `index`: Specify alternative file if not `index.md`

Major documentation sections:
- `getting-started/` - Getting started guides
- `use-timescale/` - Product usage documentation
- `api/` - API references and hyperfunctions
- `tutorials/` - Step-by-step tutorials
- `integrations/` - Integration guides
- `self-hosted/` - Self-hosted deployment docs
- `mst/` - Timescale MST documentation
- `ai/` - AI and vector search features
- `migrate/` - Migration guides
- `about/` - Company and product information

### Content Organization

**Partials (`_partials/`):** Reusable content snippets. Create files starting with underscore. Import into target `.mdx` pages.

**Troubleshooting (`_troubleshooting/`):** Individual troubleshooting entries (not full pages). Each file contains frontmatter with:
- `title`: Entry title
- `section`: Must be `troubleshooting`
- `products` and/or `topics`: Where entry appears (at least one required)
- `errors`: Optional error display with `language` and `message`
- `keywords`: Displayed at bottom, link to related pages
- `tags`: Affect related page calculations (not displayed)

Troubleshooting pages are programmatically assembled during build. If page doesn't exist, add entry in page-index with `type: "placeholder"`.

**API Documentation (`api/`):** Function references include:
- Function name with empty parentheses if takes arguments
- Brief description with warnings
- Usage samples demonstrating argument syntax
- Argument table: `Name`, `Type`, `Default`, `Required`, `Description`
- Return table: `Column`, `Type`, `Description`

Hyperfunctions are organized in `api/_hyperfunctions/` with subdirectories for two-step aggregation pattern functions.

### Custom Components

Available formatting beyond standard Markdown:
- `<Procedure>`: Step-by-step instructions with bold step summaries
- `<Highlight>`: Note/warning/caution blocks (use sparingly)
- Tabs: Multi-option content display
- Multi-tab code blocks
- Tags

See `_partials/_formatting_examples.md` for syntax and examples.

### Variables
Documentation uses variables for product names and UI elements with syntax `$VARIABLE_NAME`. Variables don't work in:
- Page frontmatter
- HTML tables and tabs

Internal links: use `:currentVersion:` instead of `latest` in URLs, no need for full domain `https://www.tigerdata.com/docs`.

## Style Guidelines

Follow [Google Developer Documentation Style Guide](https://developers.google.com/style) with exceptions:
- Do NOT capitalize first word after a colon
- Use code font (backticks) for UI elements instead of semi-bold

### SEO Optimization
Include at top of pages:
- `title`: Up to 60 characters, variation of page title
- `excerpt`: Under 200 characters, variation of intro

Summarize paragraph content in first sentence. Include main keywords in meta tags, page title, first header, and intro.

## Deployment

### Preview Builds
PRs from this repository automatically trigger preview builds (allow 10 minutes). Preview URLs follow pattern: `https://docs-dev.timescale.com/docs-<branch-name-with-hyphens>`

Build occurs in private `timescale/web-documentation` repository using Gatsby.

### Production
Production deployment triggered by changes to appropriate branch.

## Git Workflow

Branch from `latest` for all changes. PRs target `latest` branch.

## Important Notes

- Only commit when explicitly asked by user
- Never include secrets or sensitive information in documentation
- Sign CLA on first PR (automated)
- Large codebases can be excluded from indexing using `.warpindexingignore`

