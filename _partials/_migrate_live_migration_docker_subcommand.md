Next, download the live migration docker image:

```sh
docker run --rm -it --name live-migration \
    -e PGCOPYDB_SOURCE_PGURI=$SOURCE \
    -e PGCOPYDB_TARGET_PGURI=$TARGET \
    --pid=host \
    -v ~/live-migration:/opt/timescale/ts_cdc \
    timescale/live-migration:v0.0.7 --help

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
    timescale/live-migration:v0.0.7 snapshot
```

### 3.b Perform live-migration

Next, open a new terminal and initiate the live migration. Allow it to
run uninterrupted.

```sh
docker run --rm -it --name live-migration-migrate \
    -e PGCOPYDB_SOURCE_PGURI=$SOURCE \
    -e PGCOPYDB_TARGET_PGURI=$TARGET \
    --pid=host \
    -v ~/live-migration:/opt/timescale/ts_cdc \
    timescale/live-migration:v0.0.7 migrate
```
<Highlight type="note">
If the migrate command stops for any reason during execution, you can resume
the migration from where it left off by adding a `--resume` flag. This is only
possible if the `snapshot` command is intact and if a volume mount, such
as ~/live-migration, is utilized. Note that the `snapshot` command is required
only if you want to resume live migration in event of a crash.
</Highlight>