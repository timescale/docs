# 3.Create a hypertable

Now that you’ve launched your first TimescaleDB instance and accessed your database, it's time to create your first hypertable. Hypertables are the heart of TimescaleDB and are what allows TimescaleDB to work so effectively with time-series data. 

## Chunks and Hypertables

Chunks and Hypertables are TimescaleDB’s secret weapon that make storing and querying times-series data blazing fast at peta-byte scale. 

TimescaleDB automatically partitions time-series data into **chunks** (or sub-tables), based on time and and space (hash key, device ID, location or some distinct key). You can configure chunk size such that recent chunks fit memory for faster queries. 

A **Hypertable** is an abstraction over all chunks which hold time-series data. Hypertables enable you to query and access data from all the chunks as if it's in a single table. This is because commands made to the hypertable automatically propagate changes down to all of the chunks belonging to that hypertable.

Hypertables and Chunks enable superior performance for shallow and wide queries common in real-time monitoring, as well as deep and narrow queries, common in time-series analysis.

[https://assets.iobeam.com/images/docs/illustration-hypertable-chunk.svg](https://assets.iobeam.com/images/docs/illustration-hypertable-chunk.svg)

You can also interact with chunks individually if needed, but they will be created automatically based on the `chunk_time` and `chunk_size` parameters you specify.

<highlight type="tip">
> See the [Hypertable basics](https://docs.timescale.com/latest/using-timescaledb/hypertables#react-docs) page to learn more about hypertables and best practices for configuring chunk times.
</highlight>

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

Creating a hypertable is a two step process.
First we execute a `CREATE TABLE` statement to create a regular relational table. Second, we execute a SELECT statement using the function `create_hypertable` and specifying the name of the table we want to turn into a hypertable, as well as the name of the time column in that table, which is a required parameter.

## How Hypertables help with times-series data

**Hypertables help speed up ingest rates**, since data is only inserted into the current chunk, leaving data in the other chunks untouched. Contrast this with inserting data into a single table, which will become bigger and more bloated as more data is ingested.

**Hypertables help speed up queries**, since **only** specific chunks are queried thanks to the automatic indexing by time and/or space.

<highlight type="tip">
For technically interested readers, the value of the Hypertable is how data is partitioned on disk. The index value is automatically augmented by the time dependency of the data to allow more focused use of memory and query planning resources. While in PostgreSQL (and other Relational Database Management Systems) you can build indexes on one or more values, the data must still be retrieved. Retrieval is in most cases, from portions of the physical layer (memory or disk), which doesn’t always result in effective use of memory and disk resources. By automatically partitioning on time, transparently, Hypertables improve the resource usages grouping data into smaller chunks based on time, so that queries and data-stores are much more efficient with time-series data.
</highlight>

Next, we’ll get ingest some sample data into TimescaleDB.
