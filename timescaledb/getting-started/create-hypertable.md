# 3.Create a hypertable
When you've launched your first TimescaleDB instance and accessed your database,
you can create your first hypertable. Hypertables are the heart of TimescaleDB
and are what allows TimescaleDB to work so effectively with time-series data.

## Chunks and hypertables
Chunks and hypertables make storing and querying times-series data blazingly
fast at peta-byte scale. TimescaleDB automatically partitions time-series data
into chunks, or sub-tables, based on time and space. For example, chunks can be
based on hash key, device ID, location or some other distinct key. You can
configure chunk size so that recent chunks fit in memory for faster queries.

A hypertable is an abstraction layer over chunks that hold time-series data.
Hypertables allow you to query and access data from all the chunks as if they
were in a single table. This is because commands issued to the hypertable are
applied to all of the chunks that belong to that hypertable.

Hypertables and chunks enable superior performance for shallow and wide queries,
like those used in real-time monitoring. They are also good for deep and narrow
queries, like those used in time-series analysis.

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/illustration-hypertable-chunk.png" alt="hypertable and chunks"/>

You can interact with chunks individually if you need to, but chunks are created
automatically based on the `chunk_time` and `chunk_size` parameters you specify.

**Create your first hypertable**

```sql
----------------------------------------
-- Hypertable to store weather metrics
----------------------------------------
-- Step 1: Define regular table
CREATE TABLE IF NOT EXISTS weather_metrics (

   time TIMESTAMP WITHOUT TIME ZONE NOT NULL,
   timezone_shift int NULL,
   city_name text NULL,
   temp_c double PRECISION NULL,
   feels_like_c double PRECISION NULL,
   temp_min_c double PRECISION NULL,
   temp_max_c double PRECISION NULL,
   pressure_hpa double PRECISION NULL,
   humidity_percent double PRECISION NULL,
   wind_speed_ms double PRECISION NULL,
   wind_deg int NULL,
   rain_1h_mm double PRECISION NULL,
   rain_3h_mm double PRECISION NULL,
   snow_1h_mm double PRECISION NULL,
   snow_3h_mm double PRECISION NULL,
   clouds_percent int NULL,
   weather_type_id int NULL
);

-- Step 2: Turn into hypertable
SELECT create_hypertable('weather_metrics','time');
```

Creating a hypertable is a two-step process. Start by using a `CREATE TABLE`
statement to create a regular relational table. Then, use a `SELECT`
statement with the `create_hypertable` function to convert the table into a
hypertable. The `SELECT` statement requires the name of the table to convert,
and the name of the time column in that table.

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

## Learn more about hypertables and chunks
See the [Hypertable How To](/how-to-guides/hypertables) to learn more about
hypertables and best practices for configuring chunks.

Next, ingest some sample data into TimescaleDB. You can also use this 
[sample dataset](/getting-started/add-data/#accessing-the-dataset) to 
populate the table you just created. 
