# README
This directory includes helper scripts for writing and editing docs content. It
doesn't include scripts for building content; those are in the web-documentation
repo.

## Bulk editing for API frontmatter
API frontmatter metadata is stored with the API content it describes. This makes
sense in most cases, but sometimes you want to bulk edit metadata or compare
phrasing across all API references. There are 2 scripts to help with this. They
are currently written to edit the `excerpts` field, but can be adapted for other
fields.

### `extract_excerpts.sh`
This extracts the excerpt from every API reference into a single file named
`extracted_excerpts.md`. 

To use:
1.  `cd` into the `_scripts/` directory.
1.  If you already have an `extracted_excerpts.md` file from a previous run,
    delete it.
1.  Run `./extract_excerpts.sh`.
1.  Open `extracted_excerpts.md` and edit the excerpts directly within the file.
    Only change the actual excerpts, not the filename or `excerpt: ` label.
    Otherwise, the next script fails.

### `insert_excerpts.sh`
This takes the edited excerpts from `extracted_excerpts.md` and updates the
original files with the new edits. A backup is created so the data is saved if
something goes horribly wrong. (If something goes wrong with the backup, you can
always also restore from git.)

To use:
1.  Save your edited `extracted_excerpts.md`.
1.  Make sure you are in the `_scripts/` directory.
1.  Run `./insert_excerpts.sh`.
1.  Run `git diff` to double-check that the update worked correctly.
1.  Delete the unnecessary backups.
