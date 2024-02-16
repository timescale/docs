import ExplainPgDumpFlags from "versionContent/_partials/_migrate_explain_pg_dump_flags.mdx";

```sh
pg_dump -d "$SOURCE" \
  --format=plain \
  --quote-all-identifiers \
  --no-tablespaces \
  --no-owner \
  --no-privileges \
  --section=pre-data \
  --file=pre-data-dump.sql \
  --snapshot=$(cat /tmp/pgcopydb/snapshot)
```

- `--section=pre-data` is used to dump only the definition of tables,
  sequences, check constraints and inheritance hierarchy. It excludes
  indexes, foreign key constraints, triggers and rules.

- `--snapshot` is used to specified the synchronized [snapshot][snapshot] when
  making a dump of the database.

<ExplainPgDumpFlags />

[snapshot]: https://www.postgresql.org/docs/current/functions-admin.html#FUNCTIONS-SNAPSHOT-SYNCHRONIZATION
