import ExplainPgDumpFlags from "versionContent/_partials/_migrate_explain_pg_dump_flags.mdx";

```sh
pg_dump -d "$SOURCE" \
  --format=plain \
  --quote-all-identifiers \
  --no-tablespaces \
  --no-owner \
  --no-privileges \
  --section=post-data \
  --file=post-data-dump.sql \
  --snapshot=$(cat /tmp/pgcopydb/snapshot)
```

- `--section=post-data` is used to dump post-data items include definitions of
   indexes, triggers, rules, and constraints other than validated check
   constraints.

- `--snapshot` is used to specified the synchronized [snapshot][snapshot] when
  making a dump of the database.

<ExplainPgDumpFlags />

[snapshot]: https://www.postgresql.org/docs/current/functions-admin.html#FUNCTIONS-SNAPSHOT-SYNCHRONIZATION
