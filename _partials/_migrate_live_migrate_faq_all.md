### ERROR: relation "xxx.yy" does not exist

This may happen when a relation is removed after executing the `snapshot` command. A relation can be
a table, index, view, or materialized view. When you see you this error:

- Do not perform any explicit DDL operation on the source database during the course of migration.

- If you are migrating from self-hosted TimescaleDB or MST, disable the chunk retention policy on your source database 
  until you have finished migration. 

### FATAL: remaining connection slots are reserved for non-replication superuser connections

This may happen when the number of connections exhaust `max_connections` defined in your target Timescale Cloud
service. By default, live-migration needs around ~10 connections on the source and ~20 connections on the target. 
For information on tuning the number of connections during migration, see [Tune the target Timescale Cloud service][tune-connections].


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

### ERROR:  invalid snapshot identifier: "xxxxxx" (or) SSL SYSCALL error: EOF detected on RDS

This rare phenomenon may happen when:

- The snapshot becomes stale due to network connection interruption between the snapshot process and your source database.

  When you see you this error you need to tune the tcp parameter tuning on your source RDS instance. Update the
  following GUCs to the recommended values on the source RDS instance.

   ```shell
   psql -X -d $SOURCE -c 'alter system set tcp_keepalives_count=60'
   psql -X -d $SOURCE -c 'alter system set tcp_keepalives_idle=10'
   psql -X -d $SOURCE -c 'alter system set tcp_keepalives_interval=10'
   psql -X -d $SOURCE -c 'alter system set wal_sender_timeout=30m'
   ```

  For more information, see [https://github.com/dimitri/pgcopydb/issues/773#issuecomment-2139093365](https://github.com/dimitri/pgcopydb/issues/773#issuecomment-2139093365)

- Either your source database or target Timescale Cloud service is under CPU/Memory/Disk/Network pressure:

  Upgrade to better instances types until migration completes.


[tune-connections]: /migrate/:currentVersion:/live-migration/#tune-the-target-timescale-cloud-service
[align-versions]: /migrate/:currentVersion:/live-migration/#align-the-version-of-timescaledb-on-the-source-and-target
