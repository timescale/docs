import SourceTargetNote from "versionContent/_partials/_migrate_source_target_note.mdx";

# timescaledb-backfill

The `timescaledb-backfill` tool is a command-line utility designed to support
migrations from Timescale instances by copying historic data from one database
to another ("backfilling"). `timescaledb-backfill` efficiently copies
hypertable chunks directly, without the need for intermediate storage or
decompressing compressed chunks. It operates transactionally, ensuring data
integrity throughout the migration process. It is designed to be used in the
[dual-write and backfill][dual-write-backfill] migration procedure.

## Limitations

- The tool only supports backfilling of hypertables. Schema migrations and
  non-hypertable migrations should be handled separately before using this
  tool.
- The tool is optimized for append-only workloads. Other scenarios may not
  be fully supported.
- To prevent continuous aggregates from refreshing with incomplete data, any
  refresh and retention policies targeting the tables that are going to be
  backfilled should be turned off.

## Installation

The tool performs best when executed in an instance located close to the target
database. The ideal scenario is an EC2 instance located in the same region as
the Timescale service. Use a Linux-based distribution on x86_64.

[//]: # (TODO: Recommended spec for the instance.)

With the instance that will run the timescaledb-backfill ready, log in and
download the tool's binary:

```sh
wget https://assets.timescale.com/releases/timescaledb-backfill-x86_64-linux.tar.gz
tar xf timescaledb-backfill-x86_64-linux.tar.gz
sudo mv timescaledb-backfill /usr/local/bin/
```

## How to use

The timescaledb-backfill tool offers four main commands: `stage`, `copy`,
`verify` and `clean`. The workflow involves creating tasks, copying chunks,
verifying data integrity and cleaning up the administrative schema after the
migration.

<SourceTargetNote />

- **Stage Command:** is used to create copy tasks for hypertable chunks based
  on the specified completion point (`--until`). An optional filter
  (`--filter`) can be used to refine the hypertables and continuous aggregates
  targeted for staging.

  ```sh
  timescaledb-backfill stage --source $SOURCE --target $TARGET --until '2016-01-02T00:00:00' 
  ```

  The tables to be included in the stage can be controlled by providing
  filtering options:

  `--filter`: this option accepts a POSIX regular expression to match schema-qualified hypertable names or continuous aggregate view names. Only hypertables and/or continuous aggregates matching the filter are staged.

  By default, the filter includes only the matching objects, and does not
  concern itself with dependencies between objects. Depending on what is intended, this could be problematic for
  continuous aggregates, as they form a dependency hierarchy. This behaviour
  can be modified through cascade options.
 
  For example, assuming a hierarchy of continuous aggregates for hourly, daily,
  and weekly rollups of data in an underlying hypertable called `raw_data` (all
  in the `public` schema). This could look as follows:

  ```
  raw_data -> hourly_agg -> daily_agg -> monthly_agg
  ```

  If the filter `--filter='^public\.raw_data$'` is applied, then no data from the
  continuous aggregates is staged. If the filter
  `--filter='^public\.daily_agg$'` is applied, then only materialized data in the
  continuous aggregate `daily_agg` is staged. 

  `--cascade-up`: when activated, this option ensures that any continuous
  aggregates which depend on the filtered object are included in the staging
  process. It is called "cascade up" because it cascades up the hierarchy.
  Using the example from before, if the filter
  `--filter='^public\.raw_data$' --cascade up` is applied, the data in `raw_data`,
  `hourly_agg`, `daily_agg`, and `monthly_agg` is staged.

  `--cascade-down`: when activated, this option ensures that any objects which
  the filtered object depends on are included in the staging process. It is
  called "cascade down" because it cascades down the hierarchy.
  Using the example from before, if the filter
  `--filter='^public\.daily_agg$' --cascade-down` is applied, the data in
  `daily_agg`, `hourly_agg`, and `raw_data` is staged.

  The `--cascade-up` and `--cascade-down` options can be combined. Using the
  example from before, if the filter
  `--filter='^public\.daily_agg$' --cascade-up --cascade-down` is applied, data in
  all objects in the example scenario is staged.

  ```sh
  timescaledb-backfill stage --source $SOURCE --target $TARGET \
    --until '2016-01-02T00:00:00' \
    --filter '^public\.daily_agg$' \
    --cascade-up \
    --cascade-down
  ```

- **Copy Command:** processes the tasks created during the staging phase and
  copies the corresponding hypertable chunks to the target Timescale service.

   ```sh 
   timescaledb-backfill copy --source $SOURCE --target $TARGET
   ```

- **Verify Command:** checks for discrepancies between the source and target
  chunks' data. It compares the results of the count for each chunk's table, as
  well as per-column count, max, min, and sum values (when applicable,
  depending on the column data type).


   ```sh 
   timescaledb-backfill verify --source $SOURCE --target $TARGET
   ```

- **Refresh Continuous Aggregates Command:** refreshes the continuous
  aggregates of the target system. It covers the period from the last refresh
  in the target to the last refresh in the source, solving the problem of
  continuous aggregates being outdated beyond the coverage of the refresh
  policies.

  ```sh
  timescaledb-backfill refresh-caggs --source $SOURCE --target $TARGET
  ```

  To refresh the continuous aggregates, the command executes the following SQL
  statement for all the matched continuous aggregates:

  ```sql
  CALL refresh_continuous_aggregate({CAGG NAME}, {TARGET_WATERMARK}, {SOURCE_WATERMARK})
  ```

  The continuous aggregates to be refreshed can be controlled by providing
  filtering options:

  `--filter`: this option accepts a POSIX regular expression to match
  schema-qualified hypertable continuous aggregate view names.

  By default, the filter includes only the matching objects, and does not
  concern itself with dependencies between objects. Depending on what is
  intended, this could be problematic as continuous aggregates form a
  dependency hierarchy. This behaviour can be modified through cascade options.
 
  For example, assuming a hierarchy of continuous aggregates for hourly, daily,
  and weekly rollups of data in an underlying hypertable called `raw_data` (all
  in the `public` schema). This could look as follows:

  ```
  raw_data -> hourly_agg -> daily_agg -> monthly_agg
  ```

  If the filter `--filter='^public\.daily_agg$'` is applied, only
  materialized data in the continuous aggregate `daily_agg` will be updated.
  However, this approach can lead to potential issues. For example, if
  `hourly_agg` is not up to date, then `daily_agg` won't be either, as it
  requires the missing data from `hourly_agg`. Additionally, it's important to
  remember to refresh `monthly_agg` at some point to ensure its data remains
  current. In both cases, relying solely on refresh policies may result in data
  gaps if the policy doesn't cover the entire required period.

  `--cascade-up`: when activated, this option ensures that any continuous
  aggregates which depend on the filtered object are refreshed. It is called
  "cascade up" because it cascades up the hierarchy. Using the example from
  before, if the filter `--filter='^public\.daily_agg$' --cascade up` is
  applied, the `hourly_agg`, `daily_agg`, and `monthly_agg` will be refreshed.

  `--cascade-down`: when activated, this option ensures that any continuous
  aggregates which the filtered object depends on are refreshed. It is called
  "cascade down" because it cascades down the hierarchy. Using the example from
  before, if the filter `--filter='^public\.daily_agg$' --cascade-down` is
  applied, the data in `daily_agg` and `hourly_agg` will be refreshed.

  The `--cascade-up` and `--cascade-down` options can be combined. Using the
  example from before, if the filter `--filter='^public\.daily_agg$'
  --cascade-up --cascade-down` is applied, then all the continuous aggregates
  will be refreshed.

- **Clean Command:** removes the administrative schema (`__backfill`) that was
  used to store the tasks once the migration is completed successfully.

  ```sh 
  timescaledb-backfill clean --target $TARGET
  ```

### Usage examples 

- Backfilling with a filter and until date: 

  ```sh
  timescaledb-backfill stage --source $SOURCE_DB --target $TARGET_DB \
    --filter '.*\.my_table.*' \
    --until '2016-01-02T00:00:00'

  timescaledb-backfill copy --source $SOURCE --target $TARGET

  timescaledb-backfill refresh-caggs --source $SOURCE --target $TARGET

  timescaledb-backfill verify --source $SOURCE --target $TARGET

  timescaledb-backfill clean --target $TARGET
  ```

- Running multiple stages with different filters and until dates: 

  ```sh
  timescaledb-backfill stage --source $SOURCE --target $TARGET \
    --filter '^schema1\.table_with_time_as_timestampz$' \
    --until '2015-01-01T00:00:00'

  timescaledb-backfill stage --source $SOURCE --target $TARGET \
    --filter '^schema1\.table_with_time_as_bigint$' \
    --until '91827364'

  timescaledb-backfill stage --source $SOURCE --target $TARGET \
    --filter '^schema2\..*' \
    --until '2017-01-01T00:00:00'

  timescaledb-backfill copy --source $SOURCE --target $TARGET

  timescaledb-backfill refresh-caggs --source $SOURCE --target $TARGET

  timescaledb-backfill verify --source $SOURCE --target $TARGET

  timescaledb-backfill clean --target $TARGET
  ```

- Refreshing a continuous aggregates hierarchy

```sh
  timescaledb-backfill refresh-caggs --source $SOURCE --target $TARGET \
    --filter='^public\.daily_agg$' --cascade-up --cascade-down
```


### Stop and resume

The `copy` command can be safely stopped by sending an interrupt signal
(SIGINT) to the process. This can be achieved by using the Ctrl-C keyboard
shortcut from the terminal where the tool is currently running.

When the tool receives the first signal, it interprets it as a request for a
graceful shutdown. It then notifies the copy workers that they should exit once
they finish copying the chunk they are currently processing. Depending on the
chunk size, this could take many minutes to complete.

When a second signal is received, it forces the tool to shut down immediately,
interrupting all ongoing work. Due to the tool's usage of transactions, there
is no risk of data inconsistency when using forced shutdown.

While a graceful shutdown waits for in-progress chunks to finish copying, a
force shutdown rolls back the in-progress copy transactions. Any data
copied into those chunks is lost, but the database is left in a transactional
consistent state, and the backfill process can be safely resumed.

### Inspect tasks progress

Each hypertable chunk that's going to be backfilled has a corresponding task
stored in the target's database `__backfill.task` table. You can use this
information to inspect the backfill's progress:

```sql
select
    hypertable_schema,
    hypertable_name,
    count(*) as total_chunks,
    count(worked) as finished_chunks,
    count(worked is null) pending_chunks
from __backfill.task
group by
    1,
    2
```

[dual-write-backfill]: /migrate/:currentVersion:/dual-write-and-backfill/
