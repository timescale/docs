---
title: Tables and hypertables
excerpt: Create tables and hypertables in your Timescale account
products: [cloud, mst, self_hosted]
keywords: [hypertables, create]
---

import HypertableIntro from "versionContent/_partials/_hypertables-intro.mdx";

# Tables and hypertables

<HypertableIntro />

For more information, see
[the hypertables section][hypertable-how-to].

## Create your first hypertable

When you create a hypertable, it is automatically partitioned on the time column
you provide as the second parameter to `create_hypertable()`. Also, Timescale
automatically creates an index on the time column. However, you'll often filter
your time-series data on other columns as well. Using indexes appropriately helps
your queries perform better.

Because you often query the stock trade data by the company symbol, you
can also add an index for it. Include the time column because time-series data
typically looks for data in a specific period of time.

<Procedure>

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
    using the `create_hypertable()` function provided by Timescale. You must
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

</Procedure>

## Create regular PostgreSQL tables for relational data

Timescale isn't just for hypertables. When you have other relational data that
enhances your time-series data, you can create regular PostgreSQL tables just as
you would normally. For this dataset, there is one other table of data called
`company`.

<Procedure>

### Creating regular PostgreSQL tables

1.  Add a table to store the company name and symbol for the stock trade data:

    ```sql
    CREATE TABLE company (
      symbol TEXT NOT NULL,
      name TEXT NOT NULL
    );
    ```

1.  You now have two tables within your Timescale database. One hypertable
    named `stocks_real_time`, and one normal PostgreSQL table named `company`.

</Procedure>

<Video url="https://www.youtube.com/embed/MpMw7yIjauI"></Video>

## Next steps

Ingest some sample stock trade data into Timescale. The next section,
['Add time-series data'][add-data],
shows you how to populate the tables you just created.

## Learn more about hypertables and chunks

For more information about hypertables and chunks, see
[the hypertables section][hypertable-how-to].

[add-data]: /getting-started/:currentVersion:/add-data/
[hypertable-how-to]: /use-timescale/:currentVersion:/hypertables/
