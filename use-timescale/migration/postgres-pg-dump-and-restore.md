---
title: Migrate from Postgres using pg_dump and pg_restore
excerpt: Migrate a entire database with native PostgreSQL commands
products: [cloud, self_hosted]
keywords: [dump, restore]
tags: [recovery, pg_dump, pg_restore]
---

import ConsiderCloud from "versionContent/_partials/_consider-cloud.mdx";

# Migrate to Timescale Cloud using `pg_dump` and `pg_restore`

You can backup and restore an entire database using
the native PostgreSQL [`pg_dump`][pg_dump] and [`pg_restore`][pg_restore]
commands.

## Back up your entire database

You can perform a backup using the `pg_dump` command at the command prompt. For
example, to backup a database named `tsdb`:

```bash
pg_dump -Fc -f tsdb.bak tsdb
```

To backup a database named `tsdb` hosted on a remote server:

```bash
pg_dump -h <REMOTE_HOST> -p 55555 -U tsdbadmin -Fc -f tsdb.bak tsdb
```

You might see some errors when running `pg_dump`. To learn if they can be safely
ignored, see the [troubleshooting section][troubleshooting].

## Restore your entire database from backup

<Procedure>

### Restoring an entire database from backup

1.  Run [timescaledb_pre_restore][timescaledb_pre_restore] to put your database
    in the right state for restoring:

    ```sql
    SELECT timescaledb_pre_restore();
    ```

1.  Restore the database:

    ```sql
    \! pg_restore -Fc -d tsdb tsdb.bak

1.  Run [`timescaledb_post_restore`][timescaledb_post_restore] to return your
    database to normal operations:

    ```sql
    SELECT timescaledb_post_restore();
    ```

</Procedure>

[parallel importer]: https://github.com/timescale/timescaledb-parallel-copy
[pg_dump]: https://www.postgresql.org/docs/current/static/app-pgdump.html
[pg_restore]: https://www.postgresql.org/docs/current/static/app-pgrestore.html
[timescaledb_pre_restore]: /api/:currentVersion:/administration/timescaledb_pre_restore/
[timescaledb_post_restore]: /api/:currentVersion:/administration/timescaledb_post_restore/
[timescaledb-upgrade]: /self-hosted/:currentVersion:/upgrades/
[troubleshooting]: /self-hosted/:currentVersion:/troubleshooting/#versions-are-mismatched-when-dumping-and-restoring-a-database
[postgres-docs]: https://www.postgresql.org/docs/current/app-pg-dumpall.html
