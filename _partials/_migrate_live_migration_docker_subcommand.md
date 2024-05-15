Next, download the live migration docker image:

```sh
docker run --rm -it --name live-migration \
    -e PGCOPYDB_SOURCE_PGURI=$SOURCE \
    -e PGCOPYDB_TARGET_PGURI=$TARGET \
    --pid=host \
    -v ~/live-migration:/opt/timescale/ts_cdc \
    timescale/live-migration:v0.0.16 --help

Live migration moves your PostgreSQL/TimescaleDB to Timescale Cloud with minimal downtime.

options:
  -h, --help            Show this help message and exit
  -v, --version         Show the version of live-migration tool

Subcommands:
  {snapshot,clean,migrate}
                        Subcommand help
    snapshot            Create a snapshot
    clean               Clean up resources
    migrate             Start the migration
```

Live-migration contains 3 subcommands:
1. Snapshot
1. Clean
1. Migrate

On a high-level,

the `snapshot` subcommand creates a Postgres snapshot connection to the source
database along with a replication slot. This is pre-requisite before running
the `migrate` subcommand.

The `migrate` subcommand carries out the live-migration process by taking help
of the snapshot and replication slot created by the `snapshot` subcommand.

The `clean` subcommand is designed to remove resources related to live migration.
It should be run once the migration has successfully completed or, if you need
to restart the migration process from the very start. You should not run `clean`
if you want to resume the last interrupted live migration.

### 3.a Create a snapshot

Execute this command to establish a snapshot connection; do not interrupt the process.
For convenience, consider using a terminal multiplexer such as `tmux` or `screen`, which
enables the command to run in the background.

```sh
docker run --rm -it --name live-migration-snapshot \
    -e PGCOPYDB_SOURCE_PGURI=$SOURCE \
    -e PGCOPYDB_TARGET_PGURI=$TARGET \
    --pid=host \
    -v ~/live-migration:/opt/timescale/ts_cdc \
    timescale/live-migration:v0.0.16 snapshot
```

In addition to creating a snapshot, this process also validates prerequisites on the source and target to ensure the database instances are ready for replication.

For example, it checks if all tables on the source have either a PRIMARY KEY or REPLICA IDENTITY set. If not, it displays a warning message listing the tables without REPLICA IDENTITY and waits for user confirmation before proceeding with the snapshot creation.

```sh
2024-03-25T12:40:40.884 WARNING: The following tables in the Source DB have neither a primary key nor a REPLICA IDENTITY (FULL/INDEX)
2024-03-25T12:40:40.884 WARNING: UPDATE and DELETE statements on these tables will not be replicated to the Target DB
2024-03-25T12:40:40.884 WARNING:        - public.metrics
Press 'c' and ENTER to continue
```

### 3.b Perform live-migration

The `migrate` subcommand supports following flags

```sh
docker run --rm -it --name live-migration-migrate \
    -e PGCOPYDB_SOURCE_PGURI=$SOURCE \
    -e PGCOPYDB_TARGET_PGURI=$TARGET \
    --pid=host \
    -v ~/live-migration:/opt/timescale/ts_cdc \
    timescale/live-migration:v0.0.16 migrate --help
usage: main.py migrate [-h] [--dir DIR] [--resume] [--skip-roles] [--table-jobs TABLE_JOBS] [--index-jobs INDEX_JOBS]
                       [--skip-extensions [SKIP_EXTENSIONS ...]] [--skip-table-data SKIP_TABLE_DATA [SKIP_TABLE_DATA ...]]

options:
  -h, --help            Show this help message and exit
  --resume              Resume the migration
  --skip-roles          Skip roles migration
  --table-jobs TABLE_JOBS
                        Number of parallel jobs to copy "existing data" from source db to target db (Default: 8)
  --index-jobs INDEX_JOBS
                        Number of parallel jobs to create indexes in target db (Default: 8)
  --skip-extensions [SKIP_EXTENSIONS ...]
                        Skips the given extensions during migration. Empty list skips all extensions.
  --skip-table-data SKIP_TABLE_DATA [SKIP_TABLE_DATA ...]
                        Skips data from the given table during migration. However, the table schema will be migrated. To skip data from a
                        Hypertable, you will need to specify a list of schema qualified chunks belonging to the Hypertable. Currently, this
                        flag does not skip data during live replay from the specified table. Values for this flag must be schema qualified. Eg:
                        --skip-table-data public.exclude_table_1 public.exclude_table_2
```

Next, we will start the migration process. Open a new terminal and initiate the live migration, and allow it to
run uninterrupted.

```sh
docker run --rm -it --name live-migration-migrate \
    -e PGCOPYDB_SOURCE_PGURI=$SOURCE \
    -e PGCOPYDB_TARGET_PGURI=$TARGET \
    --pid=host \
    -v ~/live-migration:/opt/timescale/ts_cdc \
    timescale/live-migration:v0.0.16 migrate
```
<Highlight type="note">
If the migrate command stops for any reason during execution, you can resume
the migration from where it left off by adding a `--resume` flag. This is only
possible if the `snapshot` command is intact and if a volume mount, such
as `~/live-migration`, is utilized.
</Highlight>
