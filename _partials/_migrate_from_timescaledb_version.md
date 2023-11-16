It is very important that the version of the TimescaleDB extension is the same
in the source and target databases. This requires upgrading the TimescaleDB
extension in the source database before migrating.

You can determine the version of TimescaleDB in the target database with the
following command:

```bash
psql $TARGET -c "SELECT extversion FROM pg_extension WHERE extname = 'timescaledb';"
```

To update the TimescaleDB extension in your source database, first ensure that
the desired version is installed from your package repository. Then you can
upgrade the extension with the following query:

```bash
psql $SOURCE -c "ALTER EXTENSION timescaledb UPDATE TO '<version here>';"
```
