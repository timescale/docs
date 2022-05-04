# Create a hypertable
Hypertables are the core of TimescaleDB functionality that enable TimescaleDB to 
work efficiently with time-series data. Because TimescaleDB 
is PostgreSQL, all the regular PostgreSQL tables, indexes, stored procedures and other objects can be created
alongside your TimescaleDB hypertables. This makes creating and working with TimescaleDB 
tables similar to regular PostgreSQL. 

## Hypertables and chunks
Hypertables and chunks make storing and querying times-series data fast at petabyte 
scale. 

TimescaleDB automatically partitions time-series data into **chunks**, or sub-tables, 
based on time and space. You can configure chunk size so that recent chunks fit in memory 
for faster queries. 

A **hypertable** is an abstraction layer over chunks that hold the time-series data.
Hypertables enable you to query and access data from all the chunks within the hypertable.
You get all the benefits of automatic chunking for time-series data, alongside the simplicity
of working with what looks like a standard, single PostgreSQL table.

Hypertables and chunks enable superior performance for shallow and wide queries,
like those used in real-time monitoring. They are also good for deep and narrow
queries, like those used in time-series analysis.

<img class="main-content__illustration" 
src="https://s3.amazonaws.com/assets.timescale.com/docs/images/getting-started/hypertables-chunks.png" 
alt="hypertable and chunks"/>

For more information, see [ Hypertables and chunks](/timescaledb/latest/overview/core-concepts/hypertables-and-chunks/).


### Create your first hypertable

```sql
CREATE TABLE stocks_real_time (
   time TIMESTAMPTZ NOT NULL,
   symbol TEXT NOT NULL,
   price DOUBLE PRECISION NULL,
   day_volume INT NULL
);

SELECT create_hypertable('stocks_real_time','time');
```

When you create a hypertable, it is automatically partitioned on time. Also, TimescaleDB automatically creates an 
index on the time column. However, you'll often filter your time-series data on other 
columns as well. Using indexes appropriately helps your queries perform better.

Because you will often be querying the stock trade data by the company symbol, you should add 
an index for it. Include the time column because time-series data often looks for 
data in a specific period of time.

```sql
CREATE INDEX ix_symbol_time ON stocks_real_time (symbol, time DESC);
```

Creating a hypertable is a two-step process:
- Create a regular PostgreSQL table with `CREATE TABLE...`
- Convert it to a hypertable by calling the [`create_hypertable()`][create-hypertable] function to convert 
the table into a hypertable. The `create_hypertable()` function requires two 
input parameters: the name of the table and the name of the time column.

## Create regular PostgreSQL tables for relational data
TimescaleDB isn't just for hypertables. Remember, TimescaleDB *is* PostgreSQL. When 
you have other relational data that enhances your time-series data, you can create 
regular PostgreSQL tables just as you would normally. For this dataset, there is one 
other table of data called `company`. 

To add this table to your database, run the following command:

```sql
CREATE TABLE IF NOT EXISTS company (
   symbol TEXT NOT NULL,
   name TEXT NOT NULL
);
```

You now have two tables within your TimescaleDB database: one hypertable named `stocks_real_time`, and one normal PostgreSQL table named `company`. 

## Learn more about hypertables and chunks
To learn more about hypertables and best practices for configuring chunks, see 
[Hypertable How-To](/how-to-guides/hypertables). For information about how hypertables 
help with storing and querying data, see the [hypertables and chunks core concepts page][core-concepts-hypertables].

## Next steps
Ingest some sample stock trade data into TimescaleDB. ['Add time-series data' section][add-data], 
shows you how to populate the tables you just created. 

[add-data]: /getting-started/add-data/
[core-concepts-hypertables]: /overview/core-concepts/hypertables-and-chunks/
[create-hypertable]: /api/:currentVersion:/hypertable/create_hypertable