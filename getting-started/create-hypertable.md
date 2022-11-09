---
title: Create a hypertable
excerpt: Create a hypertable to store your time-series data
keywords: [hypertables, create]
---

# Create a hypertable

<TutorialCheckoff id="getting-started" />

Hypertables are the core of TimescaleDB. Hypertables enable TimescaleDB to work
efficiently with time-series data. Because TimescaleDB is PostgreSQL, all the
regular PostgreSQL tables, indexes, stored procedures and other objects can be
created alongside your TimescaleDB hypertables. This makes creating and working
with TimescaleDB tables similar to regular PostgreSQL.

## Hypertables and chunks

Hypertables and chunks make storing and querying times-series data fast at
petabyte scale.

TimescaleDB automatically partitions time-series data into **chunks**, or
sub-tables, based on time and space. You can configure chunk size so that recent
chunks fit in memory for faster queries.

A **hypertable** is an abstraction layer over chunks that hold the time-series
data. Hypertables enable you to query and access data from all the chunks within
the hypertable. You get all the benefits of automatic chunking for time-series
data, alongside the simplicity of working with what looks like a standard,
single PostgreSQL table.

Hypertables and chunks enable superior performance for shallow and wide queries,
like those used in real-time monitoring. They are also good for deep and narrow
queries, like those used in time-series analysis.

<img class="main-content__illustration"
src="https://s3.amazonaws.com/assets.timescale.com/docs/images/getting-started/hypertables-chunks.png"
alt="hypertable and chunks"/>

For more information, see [Hypertables and chunks](/timescaledb/latest/overview/core-concepts/hypertables-and-chunks/).

<procedure>

### Creating your first hypertable

1.  Create a regular PostgreSQL table to store the real-time stock trade data
    using `CREATE TABLE`:

    ```sql
    CREATE TABLE stocks_real_time (
      time TIMESTAMPTZ NOT NULL,
      symbol TEXT NOT NULL,
      price DOUBLE PRECISION NULL,
      day_volume INT NULL
    );
    ```

1.  Convert the regular table into a hypertable partitioned on the `time` column
    using the `create_hypertable()` function provided by TimescaleDB. You must
    provide the name of the table (`stocks_real_time`) and the column in that
    table that holds the timestamp data to use for partitioning (`time`):

    ```sql
    SELECT create_hypertable('stocks_real_time','time');
    ```

1.  Create an index to support efficient queries on the `symbol` and `time`
    columns:

    ```sql
    CREATE INDEX ix_symbol_time ON stocks_real_time (symbol, time DESC);
    ```

<highlight type="note">
When you create a hypertable, it is automatically partitioned on the time column
you provide as the second parameter to `create_hypertable()`. Also, TimescaleDB
automatically creates an index on the time column. However, you'll often filter
your time-series data on other columns as well. Using indexes appropriately helps
your queries perform better.

Because you often query the stock trade data by the company symbol, you
should add an index for it. Include the time column because time-series data
typically looks for data in a specific period of time.
</highlight>

</procedure>

## Create regular PostgreSQL tables for relational data

TimescaleDB isn't just for hypertables. Remember, TimescaleDB *is* PostgreSQL.
When you have other relational data that enhances your time-series data, you can
create regular PostgreSQL tables just as you would normally. For this dataset,
there is one other table of data called `company`.

<procedure>

### Creating regular PostgreSQL tables

1.  Add a table to store the company name and symbol for the stock trade data:

    ```sql
    CREATE TABLE company (
      symbol TEXT NOT NULL,
      name TEXT NOT NULL
    );
    ```

1.  You now have two tables within your TimescaleDB database. One hypertable
    named `stocks_real_time`, and one normal PostgreSQL table named `company`.

</procedure>

<video url="https://www.youtube.com/embed/MpMw7yIjauI"></video>

## Next steps

Ingest some sample stock trade data into TimescaleDB. The next section, ['Add time-series data'][add-data],
shows you how to populate the tables you just created.

## Learn more about hypertables and chunks

To learn more about hypertables and best practices for configuring chunks, see
[Hypertable How-To][hypertable-how-to]. For information about how hypertables
help with storing and querying data, see the [hypertables and chunks core concepts page][core-concepts-hypertables].

[add-data]: /getting-started/:currentVersion:/add-data/
[core-concepts-hypertables]: /timescaledb/:currentVersion:/overview/core-concepts/hypertables-and-chunks/
[create-hypertable]: /api/:currentVersion:/hypertable/create_hypertable
[hypertable-how-to]: /timescaledb/:currentVersion:/how-to-guides/hypertables/
