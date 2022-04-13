# Create a hypertable
Hypertables are the heart of TimescaleDB functionality and allows TimescaleDB to 
work efficiently with time-series data. It's good to remember that since TimescaleDB 
is PostgreSQL, all the regular PostgreSQL tables, indexes, etc. can be created right 
alongside your TimescaleDB hypertables. This makes creating and working with TimescaleDB 
tables fairly similar to how you would with just vanilla PostgreSQL. 

## Hypertables and chunks
Hypertables and chunks make storing and querying times-series data fast at petabyte 
scale. 

TimescaleDB automatically partitions time-series data into **chunks**, or sub-tables, 
based on time and space. You can configure chunk size so that recent chunks fit in memory 
for faster queries. 

A **hypertable** is an abstraction layer over chunks that hold the time-series data.
Hypertables allow you to query and access data from all the chunks within the hypertable.
You get all the benefits of automatic chunking for time-series data, alongside the simplicity
of working with what looks like a standard, single PostgreSQL table.

Hypertables and chunks enable superior performance for shallow and wide queries,
like those used in real-time monitoring. They are also good for deep and narrow
queries, like those used in time-series analysis.

<img class="main-content__illustration" 
src="https://s3.amazonaws.com/assets.timescale.com/docs/images/getting-started/hypertables-chunks.png" 
alt="hypertable and chunks"/>

<highlight type="note">
For more detailed information, check out the [Overview page on 'Hypertables and chunks'](/timescaledb/latest/overview/core-concepts/hypertables-and-chunks/).
</highlight>


**Create your first hypertable**

```sql
CREATE TABLE stocks_real_time (
   time TIMESTAMPTZ NOT NULL,
   symbol TEXT NOT NULL,
   price DOUBLE PRECISION NULL,
   day_volume INT NULL
);

SELECT create_hypertable('stocks_real_time','time');
```

Creating a hypertable is a two-step process:
- Create a regular PostgreSQL table with `CREATE TABLE...`
- Convert it to a hypertable by calling the [`create_hypertable()`][create-hypertable] function to convert 
the table into a hypertable. The `create_hypertable()` function requires two 
input parameters - the name of the table, and the name of the time column.

## Create regular PostgreSQL tables for relational data
TimescaleDB isn't just for hypertables. Remember, TimescaleDB _is_ PostgreSQL. When 
you have other relational data that enhances your time-series data, you can create 
regular PostgreSQL tables just like you would normally. For this dataset, we have one 
other table of data called `company`. 

To add this table to your data base, run the following command:

```sql
CREATE TABLE IF NOT EXISTS company (
   symbol text NOT NULL,
   name text NOT NULL
);
```

Once run, you will then officially have two tables within your TimescaleDB database. One hypertable named `stocks_real_time`, and a normal PostgreSQL table named `company`. 

## Learn more about hypertables and chunks
To learn more about hypertables and best practices for configuring chunks, see 
[Hypertable How-To](/how-to-guides/hypertables). To learn more about why hypertables 
help with storing and querying data, seethe [hypertables and chunks core concepts page][core-concepts-hypertables].

## Next steps
Next, ingest some sample stock trade data into TimescaleDB! Step 4, ['Add time-series data' section][add-data], 
will show you how to populate the tables you just created. 

[core-concepts-hypertables]: /getting-started/add-data/
[add-data]: /overview/core-concepts/hypertables-and-chunks/
[create-hypertable]: /api/:currentVersion:/hypertable/create_hypertable