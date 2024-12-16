import CleanupData from "versionContent/_partials/_migrate_live_migration_cleanup.mdx";

### ERROR: relation "xxx.yy" does not exist

This may happen when a relation is removed after executing the `snapshot` command. A relation can be
a table, index, view, or materialized view. When you see you this error:

- Do not perform any explicit DDL operation on the source database during the course of migration.

- If you are migrating from self-hosted TimescaleDB or MST, disable the chunk retention policy on your source database 
  until you have finished migration. 

### FATAL: remaining connection slots are reserved for non-replication superuser connections

This may happen when the number of connections exhaust `max_connections` defined in your target Timescale Cloud
service. By default, live-migration needs around ~6 connections on the source and ~12 connections on the target.

### Migration seems to be stuck with “x GB copied to Target DB (Source DB is y GB)”

When you are migrating a lot of data involved in aggregation, or there are many materialized views taking time
to complete the materialization, this may be due to `REFRESH MATERIALIZED VIEWS` happening at the end of initial 
data migration.
 
To resolve this issue:

1. See what is happening on the target Timescale Cloud service:
   ```shell
   psql $TARGET -c "select * from pg_stat_activity where application_name ilike '%pgcopydb%';"
   ```

1. When you run the `migrate`, add the following flags to exclude specific materialized views being materialized:
   ```shell
   --skip-table-data <matview1> <matview2>” 
   ```

1. When `migrate` has finished, manually refresh the materialized views you excluded.


### Restart migration from scratch after a non-resumable failure

If the migration halts due to a failure, such as a misconfiguration of the source or target database, you may need to restart the migration from scratch. In such cases, you can reuse the original Timescale target instance created for the migration by utilizing the `--drop-if-exists` flag with the migrate command.

This flag ensures that the existing target objects created by the previous migration are dropped, allowing the migration to proceed without trouble.

Here’s an example command to restart the migration:

```shell
docker run --rm -it --name live-migration-migrate \
    -e PGCOPYDB_SOURCE_PGURI=$SOURCE \
    -e PGCOPYDB_TARGET_PGURI=$TARGET \
    --pid=host \
    -v ~/live-migration:/opt/timescale/ts_cdc \
    timescale/live-migration:latest migrate --drop-if-exists
```

This approach provides a clean slate for the migration process while reusing the existing target instance.
### Inactive or lagging replication slots

If you encounter an “Inactive or lagging replication slots” warning on your cloud provider console after using live-migration, it might be due to lingering replication slots created by the live-migration tool on your source database.

<CleanupData />


### Role passwords

Because of issues dumping passwords from various managed service providers, Live-migration 
migrates roles without passwords. You have to migrate passwords manually.


### Table privileges

Live-migration does not migrate table privileges. After completing Live-migration: 

1. Grant all roles to `tsdbadmin`.
   ```shell
   psql -d $SOURCE -t -A -c "SELECT FORMAT('GRANT %I TO tsdbadmin;', rolname) FROM 
   pg_catalog.pg_roles WHERE rolname not like 'pg_%' AND rolname != 'tsdbadmin' 
   AND NOT rolsuper" | psql -d $TARGET -f -  
   ```
   
1. On your migration machine, edit `/tmp/grants.psql` to match table privileges on your source database.
   ```shell
   pg_dump --schema-only --quote-all-identifiers 
   --exclude-schema=_timescaledb_catalog --format=plain --dbname "$SOURCE" | grep 
   "(ALTER.*OWNER.*|GRANT|REVOKE)"  > /tmp/grants.psql 
   ```
   
1. Run `grants.psql` on your target Timescale Cloud service. 
   ```shell
   psql -d $TARGET -f /tmp/grants.psql
   ```

### Postgres to Timescale: “live-replay not keeping up with source load”

1. Go to the Timescale cloud console -> Insights tab and find the query which takes significant time
2. If the query is either UPDATE/DELETE, make sure the columns used on the WHERE clause have necessary indexes.
3. If the query is either UPDATE/DELETE on the tables which are converted as hypertables, make sure the REPLIDA IDENTITY(defaults to primary key) on the source is compatible with the target primary key. If not, create an UNIQUE index source database by including the hypertable partition column and make it as a REPLICA IDENTITY. Also, create the same UNIQUE index on target.

### ERROR: out of memory (or) Failed on request of size xxx in memory context "yyy" on Timescale instance

This error occurs when the Out of Memory (OOM) guard is triggered due to memory allocations exceeding safe limits. It typically happens when multiple concurrent connections to the TimescaleDB instance are performing memory-intensive operations. For example, during live migrations, this error can occur when large indexes are being created simultaneously.

The live-migration tool includes a retry mechanism to handle such errors. However, frequent OOM crashes may significantly delay the migration process.

One of the following can be used to avoid the OOM errors:

1. Upgrade to Higher Memory Spec Instances: To mitigate memory constraints, consider using a TimescaleDB instance with higher specifications, such as an instance with 8 CPUs and 32 GB RAM (or more). Higher memory capacity can handle larger workloads and reduce the likelihood of OOM errors.

1. Reduce Concurrency: If upgrading your instance is not feasible, you can reduce the concurrency of the index migration process using the `--index-jobs=<value>` flag in the migration command. By default, the value of `--index-jobs` matches the GUC max_parallel_workers. Lowering this value reduces the memory usage during migration but may increase the total migration time.

By taking these steps, you can prevent OOM errors and ensure a smoother migration experience with TimescaleDB.

[align-versions]: /migrate/:currentVersion:/live-migration/#align-the-version-of-timescaledb-on-the-source-and-target
