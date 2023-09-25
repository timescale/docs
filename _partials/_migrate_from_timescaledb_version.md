It is very important that the version of the TimescaleDB extension in the
target database is the same as it was in the source database.

You can determine the version of TimescaleDB in the source database with the
following command:

```bash
psql $SOURCE -c "SELECT extversion FROM pg_extension WHERE extname = 'timescaledb';"
```

You can alter the extension version in Timescale with the following query:

```bash
psql $TARGET -c "ALTER EXTENSION timescaledb UPDATE TO '<version here>';"
```

The extension version must be present on Timescale in order for this to be
successful. The following table gives an overview of the PostgreSQL version and
lowest available TimescaleDB extension version:

| pg12  | pg13  | pg14  | pg15  |
|-------|-------|-------|-------|
| 1.7.5 | 2.1.0 | 2.5.0 | 2.9.0 |

[//]: # (Note: to update this table, consult https://timescale.slab.com/posts/migrations-and-version-compatibility-5red287x)

By default, Timescale instances run on PostgreSQL version 15. If you require a
lower version for a migration, open a support request.

<OpenSupportRequest />
