import ExplainPgDumpFlags from "versionContent/_partials/_migrate_explain_pg_dump_flags.mdx";

```sh
pg_dump -d "$SOURCE" \
  --format=plain \
  --quote-all-identifiers \
  --no-tablespaces \
  --no-owner \
  --no-privileges \
  --schema-only \
  --file=dump.sql \
  --snapshot=$(cat /tmp/pgcopydb/snapshot)
```

- `--schema-only` is used to dump only the object definitions (schema), not
  data.

- `--snapshot` is used to specified the synchronized [snapshot][snapshot] when
  making a dump of the database.

<ExplainPgDumpFlags />