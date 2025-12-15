import MigrationPrerequisites from "versionContent/_partials/_migrate_prerequisites.mdx";
import SetupConnectionStrings from "versionContent/_partials/_migrate_live_setup_connection_strings.mdx";
import LivesyncLimitations from "versionContent/_partials/_livesync-limitations.mdx";
import LivesyncConfigureSourceDatabase from "versionContent/_partials/_livesync-configure-source-database.mdx";
import TuneSourceDatabaseAWSRDS from "versionContent/_partials/_migrate_live_tune_source_database_awsrds.mdx";

## Prerequisites

<MigrationPrerequisites />

- Ensure that the source $PG instance and the target $SERVICE_LONG have the same extensions installed.

  The $PG_CONNECTOR does not create extensions on the target. If the table uses column types from an extension,
  first create the extension on the target $SERVICE_LONG before syncing the table.

- [Install Docker][install-docker] on your sync machine.

  For a better experience, use a 4 CPU/16GB EC2 instance or greater to run the $PG_CONNECTOR.

- Install the [$PG client tools][install-psql] on your sync machine.

  This includes `psql`, `pg_dump`, `pg_dumpall`, and `vacuumdb` commands.

## Limitations

- The schema is not migrated by the $PG_CONNECTOR, you use `pg_dump`/`pg_restore` to migrate it.

<LivesyncLimitations />

## Set your connection strings

The `<user>` in the `SOURCE` connection must have the replication role granted in order to create a replication slot.

<SetupConnectionStrings />

## Tune your source database

<Tabs label="Live migration" persistKey="tune-database">

<Tab title="From AWS RDS/Aurora" label="aws-rds">

<Procedure>

<TuneSourceDatabaseAWSRDS />

</Procedure>

</Tab>

<Tab title="From Postgres" label="postgres">
<Procedure>

<LivesyncConfigureSourceDatabase />

</Procedure>

</Tab>
</Tabs>

## Migrate the table schema to the $SERVICE_LONG

Use `pg_dump` to:

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
events data, and tables that are already partitioned using $PG declarative partition into
[hypertables][about-hypertables].

<Procedure>

1. **Convert tables to hypertables**

   Run the following on each table in the target $SERVICE_LONG to convert it to a hypertable:

   ```shell
   psql -X -d $TARGET -c "SELECT public.create_hypertable('<table>', by_range('<partition column>', '<chunk interval>'::interval));"
   ```

   For example, to convert the *metrics* table into a hypertable with *time* as a partition column and
   *1 day* as a partition interval:

   ```shell
   psql -X -d $TARGET -c "SELECT public.create_hypertable('public.metrics', by_range('time', '1 day'::interval));"
   ```

1. **Convert $PG partitions to hypertables**

   Rename the partition and create a new regular table with the same name as the partitioned table, then
   convert to a $HYPERTABLE:

   ```shell
   psql $TARGET -f - <<'EOF'
      BEGIN;
      ALTER TABLE public.events RENAME TO events_part;
      CREATE TABLE public.events(LIKE public.events_part INCLUDING ALL);
      SELECT create_hypertable('public.events', by_range('time', '1 day'::interval));
      COMMIT;
EOF
   ```

</Procedure>


## Specify the tables to synchronize

After the schema is migrated, you [`CREATE PUBLICATION`][create-publication] on the source database that
specifies the tables to synchronize.

<Procedure>

1. **Create a publication that specifies the table to synchronize**

   A `PUBLICATION` enables you to synchronize some or all the tables in the schema or database.

   ```sql
   CREATE PUBLICATION <publication_name> FOR TABLE <table_name>, <table_name>;
   ```

    To add tables after to an existing publication, use [ALTER PUBLICATION][alter-publication]**

   ```sql
   ALTER PUBLICATION <publication_name> ADD TABLE <table_name>;
   ```

1. **Publish the $PG declarative partitioned table**

   ```sql
   ALTER PUBLICATION <publication_name> SET(publish_via_partition_root=true);
   ```

   To convert partitioned table to hypertable, follow [Convert partitions and tables with time-series data into hypertables](#convert-partitions-and-tables-with-time-series-data-into-hypertables).

1. **Stop syncing a table in the `PUBLICATION`, use `DROP TABLE`**

   ```sql
   ALTER PUBLICATION <publication_name> DROP TABLE <table_name>;
   ```

</Procedure>


## Synchronize data to your $SERVICE_LONG

You use the $PG_CONNECTOR docker image to synchronize changes in real time from a $PG database
instance to a $SERVICE_LONG:

<Procedure>

1. **Start the $PG_CONNECTOR**

   As you run the $PG_CONNECTOR continuously, best practice is to run it as a Docker daemon.

   ```shell
   docker run -d --rm --name livesync timescale/live-sync:v0.4.0 run \
      --publication <publication_name> --subscription <subscription_name> \
      --source $SOURCE --target $TARGET --table-map <table_map_as_json>
   ```

   `--publication`: The name of the publication as you created in the previous step. To use multiple publications, repeat the `--publication` flag.

   `--subscription`: The name that identifies the subscription on the target $SERVICE_LONG.

   `--source`: The connection string to the source $PG database.

   `--target`: The connection string to the target $SERVICE_LONG.

   `--table-map`: (Optional) A JSON string that maps source tables to target tables. If not provided, the source and target table names are assumed to be the same.
   For example, to map the source table `metrics` to the target table `metrics_data`:

   `--table-sync-workers`: (Optional) The number of parallel workers to use for initial table sync. Default is 4.

   `--copy-data`: (Optional) By default, the initial table data is copied from source to target before starting logical replication. Set to `false` so only changes made after replication slot creation are replicated.
   Best practice is to set to `false` during dry-run livesync so you do not copy table data.

   ```
   --table-map '{"source": {"schema": "public", "table": "metrics"}, "target": {"schema": "public", "table": "metrics_data"}}'
   ```
   To map only the schema, use:

   ```
   --table-map '{"source": {"schema": "public"}, "target": {"schema": "analytics"}}'
   ```
   This flag can be repeated for multiple table mappings.

1. **Capture logs**

   Once the $PG_CONNECTOR is running as a docker daemon, you can also capture the logs:
   ```shell
   docker logs -f livesync
   ```

1. **View the progress of tables being synchronized**

   List the tables being synchronized by the $PG_CONNECTOR using the `_ts_live_sync.subscription_rel` table in the target $SERVICE_LONG:

   ```bash
   psql $TARGET -c "SELECT * FROM _ts_live_sync.subscription_rel"
   ```

   You see something like the following:

   | subname  | pubname | schemaname | tablename | rrelid | state |    lsn     |          updated_at           |                                  last_error                                   |          created_at           | rows_copied | approximate_rows | bytes_copied | approximate_size | target_schema | target_table |
   |----------|---------|-------------|-----------|--------|-------|------------|-------------------------------|-------------------------------------------------------------------------------|-------------------------------|-------------|------------------|--------------|------------------|---------------|-------------|
 |livesync | analytics | public     | metrics   |  20856 | r     | 6/1A8CBA48 | 2025-06-24 06:16:21.434898+00 |                                                                               | 2025-06-24 06:03:58.172946+00 |    18225440 |         18225440 |   1387359359 |       1387359359 | public        | metrics  |

   The `state` column indicates the current state of the table synchronization.
   Possible values for `state` are:

   | state | description |
   |-------|-------------|
   | d | initial table data sync |
   | f | initial table data sync completed |
   | s | catching up with the latest changes |
   | r | table is ready, syncing live changes |

   To see the replication lag, run the following against the SOURCE database:

   ```bash
   psql $SOURCE -f - <<'EOF'
   SELECT
      slot_name,
      pg_size_pretty(pg_current_wal_flush_lsn() - confirmed_flush_lsn) AS lag
   FROM pg_replication_slots
   WHERE slot_name LIKE 'live_sync_%' AND slot_type = 'logical'
EOF
   ```

1. **Add or remove tables from the publication**

   To add tables, use [ALTER PUBLICATION .. ADD TABLE][alter-publication]**

   ```sql
   ALTER PUBLICATION <publication_name> ADD TABLE <table_name>;
   ```

   To remove tables, use [ALTER PUBLICATION .. DROP TABLE][alter-publication]**

   ```sql
   ALTER PUBLICATION <publication_name> DROP TABLE <table_name>;
   ```

1. **Update table statistics**

   If you have a large table, you can run `ANALYZE` on the target $SERVICE_LONG
   to update the table statistics after the initial sync is complete.

   This helps the query planner make better decisions for query execution plans.

   ```bash
   vacuumdb --analyze --verbose --dbname=$TARGET
   ```

1. **Stop the $PG_CONNECTOR**

   ```shell
   docker stop live-sync
   ```

1. **(Optional) Reset sequence nextval on the target $SERVICE_LONG**

   The $PG_CONNECTOR does not automatically reset the sequence nextval on the target
   $SERVICE_LONG.

   Run the following script to reset the sequence for all tables that have a
   serial or identity column in the target $SERVICE_LONG:

   ```bash
   psql $TARGET -f - <<'EOF'
      DO $$
   DECLARE
     rec RECORD;
   BEGIN
     FOR rec IN (
       SELECT
         sr.target_schema  AS table_schema,
         sr.target_table   AS table_name,
         col.column_name,
         pg_get_serial_sequence(
           sr.target_schema || '.' || sr.target_table,
           col.column_name
         ) AS seqname
       FROM _ts_live_sync.subscription_rel AS sr
       JOIN information_schema.columns AS col
         ON col.table_schema = sr.target_schema
        AND col.table_name   = sr.target_table
       WHERE col.column_default LIKE 'nextval(%'  -- only serial/identity columns
     ) LOOP
       EXECUTE format(
         'SELECT setval(%L,
            COALESCE((SELECT MAX(%I) FROM %I.%I), 0) + 1,
            false
          );',
         rec.seqname,       -- the sequence identifier
         rec.column_name,   -- the column to MAX()
         rec.table_schema,  -- schema for MAX()
         rec.table_name     -- table for MAX()
       );
     END LOOP;
   END;
   $$ LANGUAGE plpgsql;
EOF
   ```

1. **Clean up**

   Use the `--drop` flag to remove the replication slots created by the $PG_CONNECTOR on the source database.

   ```shell
   docker run -it --rm --name livesync timescale/live-sync:v0.4.0 run \
      --publication <publication_name> --subscription <subscription_name> \
      --source $SOURCE --target $TARGET \
      --drop
   ```

</Procedure>

[create-publication]: https://www.postgresql.org/docs/current/sql-createpublication.html
[alter-publication]: https://www.postgresql.org/docs/current/sql-alterpublication.html
[install-docker]: https://docs.docker.com/engine/install/
[about-hypertables]: /use-timescale/:currentVersion:/hypertables/
[lives-sync-specify-tables]: /migrate/:currentVersion:/livesync-for-postgresql/#specify-the-tables-to-synchronize
[compression]: /use-timescale/:currentVersion:/compression/about-compression
[caggs]: /use-timescale/:currentVersion:/continuous-aggregates/about-continuous-aggregates/
[join-livesync-on-slack]: https://app.slack.com/client/T4GT3N2JK/C086NU9EZ88
[install-psql]: /integrations/:currentVersion:/psql/
