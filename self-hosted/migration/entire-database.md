---
title: Migrate the entire database at once
excerpt: Migrate a small database to self-hosted TimescaleDB in one go with `pg_dump` and `pg_restore`
products: [self_hosted]
keywords: [data migration]
tags: [ingest]
---

# Migrate the entire database at once

Migrate smaller databases by dumping and restoring the entire database at once.
This method works best on databases smaller than 100 GB. For larger
databases, consider [migrating your schema and data
separately][migrate-separately].

<Highlight type="warning">

Depending on your database size and network speed, migration can take a very
long time. You can continue reading from your source database during this time,
though performance could be slower. To avoid this problem, fork your database
and migrate your data from the fork. If you write to tables in your source
database during the migration, the new writes might not be transferred to
$TIMESCALE_DB. To avoid this problem, see [Live migration][migrate-live].

</Highlight>

## Prerequisites

Before you begin, check that you have:

*   Installed the $PG [`pg_dump`][pg_dump] and [`pg_restore`][pg_restore]
    utilities.
*   Installed a client for connecting to $PG. These instructions use
    [`psql`][psql], but any client works.
*   Created a new empty database in your $SELF_LONG instance. For more information, see
    [Install $TIMESCALE_DB][enable-timescaledb]. Provision
    your database with enough space for all your data.
*   Checked that any other $PG extensions you use are compatible with
    Timescale. For more information, see the [list of compatible
    extensions][all-available-extensions]. Install your other $PG extensions.
*   Checked that you're running the same major version of $PG on both
    your target and source databases. For information about upgrading
    $PG on your source database, see the
    [upgrade instructions for $SELF_LONG][upgrading-postgresql-self-hosted].
*   Checked that you're running the same major version of $TIMESCALE_DB on both
    your target and source databases. For more information, see
    [upgrade $SELF_LONG][upgrading-timescaledb].

<Highlight type="note">

To speed up migration, compress your data into the columnstore. You can compress any chunks where
data is not currently inserted, updated, or deleted. When you finish the
migration, you can decompress chunks back to the rowstore as needed for normal operation. For more
information about the rowstore and columnstore compression, see [hypercore][hypercore].

</Highlight>

<Procedure>

### Migrating the entire database at once

1.  Dump all the data from your source database into a `dump.bak` file, using your
    source database connection details. If you are prompted for a password, use
    your source database credentials:

    ```bash
    pg_dump -U <SOURCE_DB_USERNAME> -W \
    -h <SOURCE_DB_HOST> -p <SOURCE_DB_PORT> -Fc -v \
    -f dump.bak <SOURCE_DB_NAME>
    ```

1.  Connect to your $SELF_LONG instance using your connection details:

    ```bash
    psql “postgres://<USERNAME>:<PASSWORD>@<HOST>:<PORT>/<DATABASE>?sslmode=require”
    ```

1.  Prepare your $SELF_LONG instance for data restoration by using
    [`timescaledb_pre_restore`][timescaledb_pre_restore] to stop background
    workers:

    ```sql
    SELECT timescaledb_pre_restore();
    ```

1.  At the command prompt, restore the dumped data from the `dump.bak` file into
    your $SELF_LONG instance, using your connection details. To avoid permissions errors, include the `--no-owner` flag:

    ```bash
    pg_restore -U tsdbadmin -W \
    -h <CLOUD_HOST> -p <CLOUD_PORT> --no-owner \
    -Fc -v -d tsdb dump.bak
    ```

1.  At the `psql` prompt, return your $SELF_LONG instance to normal
    operations by using the
    [`timescaledb_post_restore`][timescaledb_post_restore] command:

    ```sql
    SELECT timescaledb_post_restore();
    ```

1.  Update your table statistics by running [`ANALYZE`][analyze] on your entire
    dataset:

    ```sql
    ANALYZE;
    ```

</Procedure>

[all-available-extensions]: /use-timescale/:currentVersion:/extensions/
[analyze]: https://www.postgresql.org/docs/10/sql-analyze.html
[enable-timescaledb]: /self-hosted/:currentVersion:/install/
[hypercore]: /use-timescale/:currentVersion:/hypercore/
[migrate-live]: /migrate/:currentVersion:/live-migration/
[migrate-separately]: /self-hosted/:currentVersion:/migration/schema-then-data/
[pg_dump]: https://www.postgresql.org/docs/current/app-pgdump.html
[pg_restore]: https://www.postgresql.org/docs/current/app-pgrestore.html
[psql]: /integrations/:currentVersion:/psql/
[timescaledb_post_restore]: /api/:currentVersion:/administration/#timescaledb_post_restore
[timescaledb_pre_restore]: /api/:currentVersion:/administration/#timescaledb_pre_restore
[upgrading-postgresql-self-hosted]: /self-hosted/:currentVersion:/upgrades/upgrade-pg/
[upgrading-timescaledb]: /self-hosted/:currentVersion:/upgrades/major-upgrade/
