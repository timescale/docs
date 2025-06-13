import MigrationPrerequisites from "versionContent/_partials/_migrate_prerequisites.mdx";
import SetupConnectionStrings from "versionContent/_partials/_migrate_live_setup_connection_strings.mdx";
import LivesyncLimitations from "versionContent/_partials/_livesync-limitations.mdx";
import LivesyncConfigureSourceDatabase from "versionContent/_partials/_livesync-configure-source-database.mdx";
import TuneSourceDatabaseAWSRDS from "versionContent/_partials/_migrate_live_tune_source_database_awsrds.mdx";

## Prerequisites

<MigrationPrerequisites />

- Ensure that the source $PG instance and the target $SERVICE_LONG have the same extensions installed.

  $LIVESYNC_CAP does not create extensions on the target. If the table uses column types from an extension,
  first create the extension on the target $SERVICE_LONG before syncing the table.

- [Install Docker][install-docker] on your sync machine.

  You need a minimum of a 4 CPU/16GB EC2 instance to run $LIVESYNC.

- Install the [PostgreSQL client tools][install-psql] on your sync machine.

  This includes `psql`, `pg_dump`, and `pg_dumpall`.


## Limitations

<LivesyncLimitations />

- The schema is not migrated by $LIVESYNC, you use `pg_dump`/`pg_restore` to migrate it.

## Set your connection strings

The `<user>` in the `SOURCE` connection must have the replication role granted in order to create a replication slot.

<SetupConnectionStrings />


## Tune your source database

<Tabs label="Live migration">

<Tab title="From AWS RDS/Aurora">

<Procedure>

<TuneSourceDatabaseAWSRDS />

</Procedure>

</Tab>

<Tab title="From PostgreSQL">
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


## Synchronize data to your $SERVICE_LONG

You use the $LIVESYNC docker image to synchronize changes in real-time from a PostgreSQL database
instance to a $SERVICE_LONG:

<Procedure>

1. **Start $LIVESYNC**

   As you run $LIVESYNC continuously, best practice is to run it as a background process.

   ```shell
   docker run -d --rm --name livesync timescale/live-sync:v0.1.11 run --publication analytics --subscription livesync --source $SOURCE --target $TARGET
   ```

1. **Trace progress**

   Once $LIVESYNC is running as a docker daemon, you can also capture the logs:
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

1. **Stop $LIVESYNC**

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

After the $LIVESYNC docker is up and running, you [`CREATE PUBLICATION`][create-publication] on the SOURCE database to
specify the list of tables which you intend to synchronize. Once you create a PUBLICATION, it is
automatically picked by $LIVESYNC, which starts syncing the tables expressed as part of it.

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

1. **Stop syncing a table in the `PUBLICATION` with a call to `DROP TABLE`**

   ```sql
   ALTER PUBLICATION analytics DROP TABLE tags;
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
