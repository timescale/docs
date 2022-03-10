# Create a hypertable
Now that you've launched your first TimescaleDB instance and accessed your database,
you can create your first hypertable. Hypertables are the heart of TimescaleDB functionality
and allow TimescaleDB to work efficiently with time-series data.

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
----------------------------------------
-- Hypertable to store real-time stock trades
----------------------------------------
-- Step 1: Define regular table
CREATE TABLE IF NOT EXISTS stocks_real_time (
   time TIMESTAMPTZ NOT NULL,
   symbol TEXT NOT NULL,
   price DOUBLE PRECISION NULL,
   day_volume INT NULL
);

-- Step 2: Turn into hypertable
SELECT create_hypertable('stocks_real_time','time');
```

Creating a hypertable is a two-step process:
- Create a regular PostgreSQL table with `CREATE TABLE...`
- Convert it to a hypertable by calling the [`create_hypertable()`][create-hypertable] function to convert 
the table into a hypertable. The `create_hypertable()` function requires two 
input parameters - the name of the table, and the name of the time column.

<!-- 
## How hypertables help with times-series data
**Hypertables speed up ingest rates:** Because data is only inserted into
the current chunk, data in the other chunks remains untouched. If you use a
single table, every time you ingest data into the table, it becomes bigger and
more bloated.

**Hypertables speed up queries:** Because only specific chunks are queried
thanks to the automatic indexing by time or space.

The value of hypertables is in how data is partitioned on disk. The index value
is automatically augmented by the time dependency of the data to allow more
focused use of memory and query planning resources. In PostgreSQL (and other
relational database management systems), you can build indexes on one or more
values, but the data must still be retrieved. Retrieval is in most cases, from
portions of the physical layer (memory or disk), which doesn't always result in
effective use of memory and disk resources. By automatically and transparently
partitioning on time, hypertables improve resource use. Queries and
data-stores become more efficient.

   COMMENT:
   I feel like we probably don't need this section but wherever this section is, 
   I think it would be cool to include a graphic that shows these benefits 
   https://iobeam.slack.com/archives/C0J94TE4F/p1646682667481189?thread_ts=1646682487.374619&cid=C0J94TE4F
-->

## Learn more about hypertables and chunks
To learn more about hypertables and best practices for configuring chunks, see 
[Hypertable How-To](/how-to-guides/hypertables). To learn more about why hypertables 
help with storing and querying data, seethe [hypertables and chunks core concepts page][core-concepts-hypertables].

## Next steps
Next, ingest some sample stock trade data into TimescaleDB! Step 4, ['Add time-series data' section][add-data], 
will show you how to populate the hypertable you just created. 

[core-concepts-hypertables]: /getting-started/add-data/
[add-data]: /overview/core-concepts/hypertables-and-chunks/
[create-hypertable]: /api/:currentVersion:/hypertable/create_hypertable