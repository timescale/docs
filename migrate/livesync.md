---
title: Livesync from Postgres to Timescale Cloud
excerpt: Synchronize updates to a primary postgres database instance to Timescale Cloud service in real-time
products: [cloud]
keywords: [migration, low-downtime, backup]
tags: [recovery, logical backup, replication]
---

import MigrationPrerequisites from "versionContent/_partials/_migrate_prerequisites.mdx";
import SetupConnectionStrings from "versionContent/_partials/_migrate_live_setup_connection_strings.mdx";


# Livesync from PostgreSQL to Timescale Cloud

You use the Livesync Docker image to synchronize all data, or specific tables, from a PostgreSQL database 
instance to a $SERVICE_LONG in real-time. You run Livesync continuously, turning PostgreSQL into a primary database 
with a $SERVICE_LONG as a logical replica. This enables you to leverage $CLOUD_LONG’s real-time analytics capabilities 
on your replica data.

<Highlight type="warning">
You use Livesync for for data synchronization, rather than migration. It is in alpha and is not recommended for 
production use.
</Highlight>

Livesync leverages the PostgreSQL logical replication protocol, a well-established and widely 
understood feature in the PostgreSQL ecosystem. By relying on this protocol, Livesync ensures 
compatibility, familiarity, and a broader knowledge base, making it easier for you to adopt and 
integrate.

You use Livesync to:
* Copy existing data from a PostgreSQL instance to a $SERVICE_LONG:
  - Copy data at up to 150 GB/hr. You need at least a 4 CPU/16GB source database, and a 4 CPU/16GB target $SERVICE_SHORT.
  - Copy the publication tables in parallel. However, large tables are still copied using a single connection. 
    Parallel copying is in the backlog.
  - Forget foreign key relationships. Livesync disables foreign key validation during the sync. For example, if a 
    `metrics` table refers to the `id` column on the `tags` table, you can still sync only the `metrics` table 
     without worrying about their foreign key relationships.
  - Track progress. PostgreSQL expose `COPY` progress under in `pg_stat_progress_copy`.
* Synchronize real-time changes from a PostgreSQL instance to a $SERVICE_LONG.
* Add and remove tables on demand using the [PostgreSQL PUBLICATION interface](https://www.postgresql.org/docs/current/sql-createpublication.html).
* Enable features such as [hypertables][about-hypertables], [columnstore][compression], and 
   [continuous aggregates][caggs] on your logical replica.  

If you have an questions or feedback, talk to us in [#livesync in Timescale Community][join-livesync-on-slack].

# Prerequisites

<MigrationPrerequisites />

- [Install Docker][install-docker] on your sync machine.
  You need a minimum of a 4 CPU/16GB EC2 instance to run Livesync

- Install the PostgreSQL client tools on your sync machine.

  This includes `psql`, `pg_dump`, and `pg_dumpall`.

## Limitations

* The Schema is not migrated by Livesync, you use pg_dump/restore to migrate schema
* Schema changes must be co-ordinated. Make compatible changes to the schema in your $SERVICE_LONG first, then make 
  the same changes to the source PostgreSQL instance. 
* There is WAL volume growth on the source PostgreSQL instance during large table copy.
* This works for PostgreSQL databases only as source. Timescaledb is not yet supported.

## Set your connection strings

The `<user>` in the `SOURCE` connection must have the replication role granted in order to create a replication slot. 

<SetupConnectionStrings />

## Configure the source database

You need to tune the Write Ahead Log (WAL) on the PostgreSQL source database:
* PostgreSQL[ GUC “wal_level” as “logical”](https://www.postgresql.org/docs/current/runtime-config-wal.html#GUC-WAL-LEVEL)
* PostgreSQL[GUC “max_wal_senders” as 10](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-MAX-WAL-SENDERS)

To do this: 

```sql
psql $SOURCE -c "SET wal_level=’logical’;"
psql $SOURCE -c "SET max_wal_sender=10;"
```

## Enable update and delete replication on the source database

Replica identity assists data replication by identifying the rows being modified. 
By default each table and hypertable in the source database defaults to the primary key of the table being replicated.
However, you can also have: 

- **A viable unique index**: each table has a unique, non-partial, non-deferrable index that includes only columns 
   marked as `NOT NULL`. If a `UNIQUE` index does not exists, create one to assist the migration. You can delete it after 
   live sync. For each table, set `REPLICA IDENTITY` to the viable unique index:

   ```sql
    psql -X -d $SOURCE -c 'ALTER TABLE <table name> REPLICA IDENTITY USING INDEX <_index_name>'
   

- **No primary key or viable unique index**: use brute force. For each table, set `REPLICA IDENTITY` to `FULL`:

  ```sql
  psql -X -d $SOURCE -c 'ALTER TABLE <table name> REPLICA IDENTITY FULL'
  ```
  For each `UPDATE` or `DELETE` statement, PostgreSQL reads the whole table to find all matching rows. 
  This results in significantly slower replication. If you are expecting a large number of `UPDATE` or `DELETE` 
  operations on the table, best practice is to not use `FULL`

To capture only `INSERT` and ignore `UPDATE`s and `DELETE`s, use a 
[publish config](https://www.postgresql.org/docs/current/sql-createpublication.html#SQL-CREATEPUBLICATION-PARAMS-WITH-PUBLISH) 
while [creating the publication][lives-sync-specify-tables].

## Migrate the table schema to the $SERVICE_LONG

Use pg_dump to:

<Procedure>

1. **Download the schema from the source database**

  ```shell
  pg_dump $SOURCE \
  --no-privileges \
  --no-owner \
  --no-publications \
  --no-subscriptions \
  --no-table-access-method \
  --no-tablespaces \
  --schema-only \
  --file=schema.sql
  ```

1. **Apply the schema on the target $SERVICE_SHORT**
  ```shell
  psql $TARGET -f schema.sql
  ```

</Procedure>

## Convert partitions and tables with time-series data into hypertables

For efficient querying and analysis, you can convert tables which contain time-series or
events data, and tables that are already partitioned using PostgreSQL declarative partition into
[hypertables][about-hypertables].

<Procedure>

1. **Convert tables to hyperatables**

   Run the following on each table in the target $SERVICE_LONG to convert it to a hypertable:

   ```shell
   psql -X -d $TARGET -c "SELECT create_hypertable('<table>', by_range('<partition column>', '<chunk interval>'::interval));"
   ```

   For example, to convert the *metrics* table into a hypertable with *time* as a partition column and
   *1 day* as a partition interval:

   ```shell
   psql -X -d $TARGET -c "SELECT create_hypertable('public.metrics', by_range('time', '1 day'::interval));"
   ```

1. **Convert PostgreSQL partitions to hyperatables**

   Rename the partition and create a new normal table with the same name as the partitioned table, then
   convert to a hypertable:

   ```shell
   psql $TARGET -f - <<EOF
   BEGIN;
   ALTER TABLE public.events RENAME TO events_part;
   CREATE TABLE public.events(LIKE public.events_part INCLUDING ALL);
   SELECT create_hypertable('public.events', by_range('time', '1 day'::interval));
   COMMIT;
   EOF
   ```
   
</Procedure>


## Syncronize data from your source database to the $SERVICE_LONG

You use the Livesync docker image to synchronize changes in real-time from a PostgreSQL database
instance to a $SERVICE_LONG:

<Procedure>

1. **Start Livesync**

   As you run Livesync continuously, best practice is to run it as a background process.

   ```shell
   docker run -d --rm --name livesync timescale/live-sync:v0.0.0-alpha.1-amd64 start --publication analytics --subscription livesync --source $SOURCE --target $TARGET
   ```

1. **Trace progress**

   Once Livesync is running as a docker daemon, you can also capture the logs:
   ```shell
   docker logs -f livesync
   ```

1. **View the tables being synchronized**

   ```bash
   psql $TARGET -c "SELECT * FROM _ts_live_sync.subscription_rel"

   subname  | schemaname | tablename | rrelid | state | lsn
   ----------+------------+-----------+--------+-------+-----
   livesync | public     | metrics  |  17261 | d     |
   ```
   Possible values for `state` are:

      - d: initial table data sync
    
      - f: initial table data sync completed
    
      - s: catching up with the latest change
    
      - r: table is ready, synching live changes

1. **Stop Livesync**

   ```shell
   docker stop live-sync
   ```

1. **Cleanup**

   You need to manually execute a SQL snippet to cleanup replication slots created by the live-migration.

   ```shell
   psql $SOURCE -f - <<EOF
   select pg_drop_replication_slot(slot_name) from pg_stat_replication_slots where slot_name like 'livesync%';
   select pg_drop_replication_slot(slot_name) from pg_stat_replication_slots where slot_name like 'ts%';
   EOF
   ``` 
   A command to clean up is coming shortly.

</Procedure>


## Specify the tables to synchronize

After the Livesync docker is up and running, you [`CREATE PUBLICATION`][create-publication] on the SOURCE database to
specify the list of tables which you intend to synchronize. Once you create a PUBLICATION, it is
automatically picked by Livesync, which starts synching the tables expressed as part of it.

For example:

<Procedure>

1. **Create a publication named `analytics` which publishes `metrics` and `tags` tables**

   `PUBLICATION` enables you to add all the tables in the schema or even all the tables in the database. However, it
   requires superuser privileges on most of the managed PostgreSQL offerings.

   ```sql
   CREATE PUBLICATION analytics FOR TABLE metrics, tags;
   ```

1. **Add tables after to an existing publication with a call to [ALTER PUBLICATION][alter-publication]**

   ```sql
   ALTER PUBLICATION analytics ADD TABLE events;
   ```

1. **Publish PostgreSQL declarative partitioned table**

   To publish declaratively partitioned table changes to your $SERVICE_LONG, set the `publish_via_partition_root` 
   special `PUBLICATION` config to `true`:
  
   ```sql
   ALTER PUBLICATION analytics SET(publish_via_partition_root=true);
   ```

1. **Stop synching a table in the `PUBLICATION` with a call to `DROP TABLE`**

   ```sql
   ALTER PUBLICATION analytics DROP TABLE tags;
   ```

</Procedure>


[create-publication]: https://www.postgresql.org/docs/current/sql-createpublication.html
[alter-publication]: https://www.postgresql.org/docs/current/sql-alterpublication.html
[install-docker]: https://docs.docker.com/engine/install/
[about-hypertables]: /use-timescale/:currentVersion:/hypertables/about-hypertables/
[lives-sync-specify-tables]: /migrate/:currentVersion:/livesync/#specify-the-tables-to-synchronize
[compression]: /use-timescale/:currentVersion:/compression/about-compression
[caggs]: /use-timescale/:currentVersion:/continuous-aggregates/about-continuous-aggregates/
[join-livesync-on-slack]: https://app.slack.com/client/T4GT3N2JK/C086NU9EZ88
