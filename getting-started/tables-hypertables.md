---
title: Tables and hypertables
excerpt: Create tables and hypertables in your Timescale account
products: [cloud]
keywords: [hypertables, create]
layout_components: [next_prev_large]
content_group: Getting started
---

import HypertableIntro from "versionContent/_partials/_hypertables-intro.mdx";

# Tables and $HYPERTABLEs

<HypertableIntro />

Databases are made up of tables that contain your data. In PostgreSQL, these
tables are relational, so the data in one table relates to the data in another
table. In $COMPANY, you use regular PostgreSQL relational tables, in addition
to special time-series $HYPERTABLEs.

$HYPERTABLE_CAPs are designed specifically for time-series data, so they have a few
special qualities that make them different from a regular PostgreSQL table. A
$HYPERTABLE is always partitioned on time, but can also be partitioned on
additional columns as well. The other special thing about $HYPERTABLEs is that
they are broken down into smaller tables called $CHUNKs.

In this section, you create a $HYPERTABLE for time-series data, and regular
PostgreSQL tables for relational data. You also create an index on your
$HYPERTABLE, which isn't required, but can help your queries run more efficiently.
One of the other special qualities of $HYPERTABLEs is that you can also create
indexes later on, if you need to.

For more information, see
[the $HYPERTABLEs section][hypertable-how-to].

## Create your first $HYPERTABLE

For the financial dataset used in this guide, create a $HYPERTABLE named
`stocks_real_time` that contains second-by-second stock-trade data for the top
100 most-traded symbols.

<Procedure>

### Creating your first $HYPERTABLE

1.  At the command prompt, use the `psql` connection string from the cheat sheet
    you downloaded to connect to your database.
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

1.  Convert the regular table into a $HYPERTABLE partitioned on the `time` column
    using the `create_hypertable()` function provided by $COMPANY. You must
    provide the name of the table (`stocks_real_time`) and the column in that
    table that holds the timestamp data to use for partitioning (`time`):

    <CodeBlock canCopy={true} showLineNumbers={false} children={`
    SELECT create_hypertable('stocks_real_time', by_range('time'));
    `} />

1.  Create an index to support efficient queries on the `symbol` and `time`
    columns:

    <CodeBlock canCopy={true} showLineNumbers={false} children={`
    CREATE INDEX ix_symbol_time ON stocks_real_time (symbol, time DESC);
    `} />

</Procedure>

## Create regular PostgreSQL tables for relational data

$COMPANY isn't just for $HYPERTABLEs. When you have other relational data that
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

1.  You now have two tables within your $COMPANY database. One $HYPERTABLE named
    `stocks_real_time`, and one normal PostgreSQL table named `company`. You can
    check this by running this command at the `psql` prompt:

    <CodeBlock canCopy={true} showLineNumbers={false} children={`
    \\dt
    `} />

    This command returns information about your tables, like this:

    <CodeBlock canCopy={false} showLineNumbers={true} children={`
                           List of relations
     Schema |       Name       | Type  |   Owner
    --------+------------------+-------+-----------
     public | company          | table | tsdbadmin
     public | stocks_real_time | table | tsdbadmin
    (2 rows)
    `} />

</Procedure>

[hypertable-how-to]: /use-timescale/:currentVersion:/hypertables/
