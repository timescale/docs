# Building a custom TimescaleDB dashboard

Databases don’t have to be black boxes. With a few simple steps, you can create your own custom visualizations and dashboards to monitor your TimescaleDB instance. TimescaleDB is PostgreSQL with superpowers and makes creating custom dashboards for your data easy. With TimescaleDB you have the full canvas of PostgreSQL monitoring capabilities to hook into. Of course, you can always use commercial tools to monitor TimescaleDB, just as you can with PostgreSQL. But custom dashboards give you the utmost flexibility. Fortunately, it’s not difficult to build these kinds of dashboards.

In this tutorial, we will build a custom visualization that will demonstrate how many chunks a hypertable has, the state of the compression for each chunk, and the current total size of the database. We will build our front-end in React and connect to metrics about TimescaleDB using Hasura, a GraphQL service. In this tutorial, you’ll learn:

* Concepts within TimescaleDB that are easy to visualize
* How to query TimescaleDB views and functions to get details about hypertables and chunks
* How to generate sample data
* How Hasura can help to stream data through GraphQL subscriptions
* How to build your React front-end to visualize the data

The project was bootstrapped with React, connecting to a [Hasura][] GraphQL API to visualize [hypertable chunks][hypertables] of a [TimescaleDB][] instance. 

The easiest way to get a TimescaleDB instance is to [try for free][timescale-signup] using our hosted service. You can also [download TimescaleDB for free][timescale-install] and run locally or in your own cloud infrastructure.

You can get the full code for this project from [this GitHub repo][repo-example].

This project will work on any TimescaleDB instance, but if you’re interested in generating sample data to use, we recommend our tutorial on [Simulating IoT sensor data][iot-tutorial].

## How TimescaleDB manages time-series data

TimescaleDB is PostgreSQL with time-series superpowers. At the core of many features is an abstraction on a regular table called [hypertables][]. When you create a hypertable to store your time-series data, TimescaleDB automatically partitions the incoming data into smaller child tables we call *chunks*. These chunks represent data for a given time period, which makes it easier to query and manage over time. For example, if you wanted to query data from time X to time Y, instead of scanning your entire database, TimescaleDB would scan the specific chunks that contain data for the period between X and Y.  All of the interaction with the database still occurs on the hypertable itself, using full SQL. But TimescaleDB is magically working behind the scenes to partition the data and intelligently query large amounts of data using this high-performance architecture.

Many features in TimescaleDB rely on chunks, including [continuous aggregates][caggs], [data retention][], native [compression][], and more. Native compression is particularly helpful with taming time-series data that can be relentless in quantity and speed, and difficult to store and query without a purpose-built time-series database. Using compression allows TimescaleDB to save as much as 94-97% of your disk space for the same amount of data, while often increasing the speed of your queries over time.

Sometimes, however, knowing that a feature like native compression can achieve 97% compression doesn't mean as much until you can see the results firsthand, table-by-table, and chunk-by-chunk.

To do this, TimescaleDB provides multiple views and functions that can be queried for information about the state of your hypertables and chunks. Although there is no combined view that provides exactly the data we'll need for our visualization, TimescaleDB provides the building blocks to craft a custom SQL query that will return the data we need to better visualize the current state of hypertable and chunk compression state.

For example, the following query would return the name and what is the time series range that this chunk cover:

```sql
tsdb=> SELECT chunk_name, range_start, range_end FROM timescaledb_information.chunks LIMIT 1;
    chunk_name    |      range_start       |       range_end
------------------+------------------------+------------------------
 _hyper_2_2_chunk | 2021-04-29 00:00:00+00 | 2021-05-06 00:00:00+00
(1 row)
```

Visualizing the state of your hypertables can help you gain a better understanding of how  compression works and possibly even how different types impact compression efficiently. 

## Visualizing tables and chunks

As you can imagine, hypertables with data spanning massive time periods can have thousands of chunks, so visualizing them effectively was a key requirement for this simple project. To provide a visual perspective of the table, we decided that the image area would represent the total size of all table data before compression. The area of each circle (representing a chunk) would then take a proportional amount of space within the image. 

Here’s an example of what this visualization will look like:

<img class="main-content__illustration" src="https://assets.timescale.com/images/misc/visualizing-compression/compression-preview.png" alt="Hypertables compression preview"/>


With this visualization, we can glean a few things at-a-glance:

* How many chunks are part of this hypertable currently?
* What is the compression state of each chunk?
* How much space has been saved by enabling compression on some chunks?

This last question is interesting because using the uncompressed data size to represent the area of the image, we can quickly get a sense of how much space has been saved by observing the overall white space across the image. Smaller yellow chunks are compressed (and their size represents their portion of space within the larger table), while larger dark chunks are uncompressed and take more area on the image.

We will also make the visualization interactive by enabling you to click on a chunk (one of the dots on the screen) and compress or uncompress it manually.

## Create internal views in TimescaleDB to obtain metrics

To make it easier to build our application, we had to create some new functions and views to do the following:

* Extract information from chunks like name and time range.
* Get extra details about what chunks are compressed or not.
* Get compression stats and fetch what is the size after compression.

### Extract information from chunks

To address the first item, we can use the timescaledb_information.chunks view that the TimescaleDB extension already provides.

Here is a simple query to get the time-series range of each chunk:

```sql
 SELECT hypertable_schema,
    hypertable_name,
    chunk_name,
    range_start,
    range_end
 FROM timescaledb_information.chunks LIMIT 1;
```

Sample row vertically output to explore:

```sql
-[ RECORD 1 ]-----+-----------------------
hypertable_schema | public
hypertable_name   | conditions
chunk_name        | _hyper_2_2_chunk
range_start       | 2021-04-29 00:00:00+00
range_end         | 2021-05-06 00:00:00+00
```

The chunk name that is returned with the dataset is unique and will be used in other queries to retrieve enhanced details about each chunk for visualization purposes. In this example, you can see that the chunk has a `range_start` and `range_end` that spans one week. As new data is inserted into this table, any data that has a timestamp between 2021-04-29 and 2021-05-06  will be stored on this specific chunk for the `conditions` table.

### Get details about compression status for a chunk

Once we know the name and time range of each chunk, the second challenge is to get more detail about the compression status and how much disk we’re saving by compressing the data. We can get this additional information by querying the `chunk_compression_stats` function with the `conditions` hypertable:

```sql
tsdb=> SELECT * FROM chunks_detailed_size('conditions');
-[ RECORD 1 ]------------------+----------------------
chunk_schema                   | _timescaledb_internal
chunk_name                     | _hyper_6_913_chunk
compression_status             | Compressed
before_compression_table_bytes | 204800
before_compression_index_bytes | 360448
before_compression_toast_bytes | 0
before_compression_total_bytes | 565248
after_compression_table_bytes  | 8192
after_compression_index_bytes  | 16384
after_compression_toast_bytes  | 98304
after_compression_total_bytes  | 122880
node_name                      |
-[ RECORD 2 ]------------------+----------------------
chunk_schema                   | _timescaledb_internal
chunk_name                     | _hyper_6_880_chunk
compression_status             | Uncompressed
before_compression_table_bytes |
before_compression_toast_bytes |
before_compression_total_bytes |
after_compression_table_bytes  |
after_compression_index_bytes  |
after_compression_toast_bytes  |
after_compression_total_bytes  |
node_name                      |
```

### Get compression stats and size

One detail you might notice is that when the chunk is uncompressed, it does not bring the size of the chunk. For the uncompressed data, we need to fall back to the `chunks_detailed_size` function, passing a specific hypertable name as a parameter:

```sql
tsdb=> SELECT * FROM chunks_detailed_size('conditions');
-[ RECORD 1 ]+----------------------
chunk_schema | _timescaledb_internal
chunk_name   | _hyper_6_853_chunk
table_bytes  | 8192
index_bytes  | 40960
toast_bytes  | 98304
total_bytes  | 147456
node_name    |
```

From this function we can use the `total_bytes` when we know that the chunk is not compressed.

### Building views for our TimescaleDB metrics

Now that we know where to get all of the data we need to drive the visualization, it’s time to join it together in a view that can be queried using SQL (and eventually, our application).

```
CREATE OR REPLACE VIEW chunks_with_compression AS
SELECT DISTINCT ch.chunk_name,
                ccs.chunk_schema,
                ch.hypertable_schema,
                ch.hypertable_name,
                ch.range_start,
                ch.range_end,
                COALESCE(ccs.before_compression_total_bytes, NULL, cds.total_bytes) AS before_compression_total_bytes,
                ccs.after_compression_total_bytes
FROM (
 SELECT hypertable_schema,
    hypertable_name,
    chunk_name,
    range_start,
    range_end
 FROM  timescaledb_information.chunks) AS ch
  LEFT OUTER JOIN LATERAL chunk_compression_stats(ch.hypertable_name::regclass) ccs
    ON ch.chunk_name = ccs.chunk_name
  LEFT OUTER JOIN LATERAL chunks_detailed_size(ch.hypertable_name::regclass) cds
    ON ccs.chunk_schema = cds.chunk_schema
    AND ch.chunk_name = cds.chunk_name;
```

Using the name of a random chunk from the hypertable, we can query this view and see that we now get all of the information we need, including the time range of the chunk, it's size before compression, and the size after compression if applicable.

Notice in this sample chunk from our test dataset that `before_compression_total_bytes` is 10 times bigger than `after_compression_total_bytes`. We save more than 90% of disk space with compression!

```sql
SELECT * FROM  chunks_with_compression;
...
-[ RECORD 96 ]-----------------+-----------------------
chunk_name                     | _hyper_2_37_chunk
chunk_schema                   | _timescaledb_internal
hypertable_schema              | public
hypertable_name                | conditions
range_start                    | 2021-05-27 00:00:00+00
range_end                      | 2021-06-03 00:00:00+00
before_compression_total_bytes | 90112
after_compression_total_bytes  | 8192
```


## Setting up your database

In this project, we use data generated by our tutorial on [Simulating IoT sensor data][iot-tutorial]. This data will result in a simple schema and data that mimics a number of IoT sensors with information on time, device, and temperature.

If you follow the tutorial, you will get a table named conditions, which stores the temperature of fake devices over time.

Here’s a set of commands to create the table and generate some sample data:

```sql
CREATE TABLE conditions (
      time TIMESTAMPTZ NOT NULL,
      device INTEGER NOT NULL,
      temperature FLOAT NOT NULL,
      PRIMARY KEY(time, device)
);

SELECT * FROM create_hypertable('conditions', 'time', 'device', 3);

INSERT INTO conditions
  SELECT time, (random()*30)::int, random()*80 - 40
  FROM generate_series(TIMESTAMP '2020-01-01 00:00:00',
                       TIMESTAMP '2020-01-01 00:00:00' + INTERVAL '1 month',
             INTERVAL '1 min') AS time;

```


## Connecting to our database and retrieving metrics

One of the most trivial aspects of a backend application is to protect the database and expose only the information that is accessible to the authorized user. The Hasura GraphQL Engine solves this issue providing GraphQL APIs over new or existing PostgreSQL databases. Allowing you to create permission rules and dynamically expand your database resources.

Now that we have a database example, we can jump into the [Hasura cloud][hasura-cloud] to connect the resources that we want to expose through the GraphQL.

We chose Hasura because of the flexibility to simply connect our TimescaleDB database and quickly expose the tables, views, and functions we needed in a few clicks. We’re not going to dive into all the steps to set up a new data source on Hasura as the wizard will guide you there.

We’re going to use two types of operations:

* Queries and subscriptions: watch a specific query and keep pulling data updates to the client. We’re going to "subscribe" to the chunks metadata’.
* Mutation: convention for operations that are writing data. We’ll map the compression and decompression actions as mutations.

### Queries and subscriptions

Hasura has great flexibility to plug any resource and offer it as a query or a subscription. For this example, we’ll be mapping the *chunks_with_compression* view we created earlier as a GraphQL resource. It can be consumed as a query or subscription.

![Tracking a SQL view on Hasura cloud](https://assets.timescale.com/images/misc/visualizing-compression/hasura-cloud-track-view.png)

We need to map those mutations to compress and decompress a chunk. To accomplish that, we need to take a look at how Hasura types work.

### Mutations

Hasura can easily map custom types that come from table structures. To create the necessary mutations, our functions should also return types that inherit from table structures.

To easily create a new structure of the table from a query, we can call the query with limit 0:

#### Compress chunk mutation

```sql
CREATE TABLE compressed_chunk AS
SELECT compress_chunk((c.chunk_schema ||'.' ||c.chunk_name)::regclass)
FROM   timescaledb_information.chunks c
WHERE  NOT c.is_compressed limit 0;
```

Hasura needs some function to be tracked as a mutation. In this case, let's create the function to just rewrap the default compress_chunk from the TimescaleDB extension.

Now, we can return the "compressed_chunk" in our function that will compress the chunk:
```sql
CREATE OR REPLACE FUNCTION compress_chunk_named(varchar) returns setof compressed_chunk AS $$
  SELECT compress_chunk((c.chunk_schema ||'.' ||$1)::regclass)
  FROM   timescaledb_information.chunks c
  WHERE  NOT c.is_compressed
  AND    c.chunk_name = $1 limit 1
$$ LANGUAGE SQL VOLATILE;
```

Note that the function adds an extra where clause to not compress what is already compressed.

![Tracking compress chunk mutation on Hasura cloud](https://assets.timescale.com/images/misc/visualizing-compression/hasura-cloud-compress-chunk-mutation.png)

#### Decompress chunk mutation

We'll need a similar function for the decompression:

```sql
CREATE OR REPLACE FUNCTION decompress_chunk_named(varchar) returns setof compressed_chunk AS $$
  SELECT decompress_chunk((c.chunk_schema ||'.' ||$1)::regclass)
  FROM   timescaledb_information.chunks c
  WHERE  c.is_compressed
  AND    c.chunk_name = $1 limit 1
$$ LANGUAGE SQL VOLATILE;
```
Now, the next step is to jump into the Hasura cloud and connect the database as a new data source.

In the data panel, after setting up the PostgreSQL URI of your database, you can track each function as a query or mutation in a single click. Here is an example of compress_chunk_named function:

In our case, the subscription goes to the chunks_with_compression, and here is what it looks like:

You should also track decompress_chunk_named and compress_chunk_named as GQL mutations with a single argument.

## Build the front-end visualization

You can consult [the GitHub repo][repo-example] for the full code of our front-end application. The front-end application will connect to the Hasura GraphQL layer we created earlier, which, in turn, connects to our TimescaleDB database to retrieve information about chunks and compression status. The front-end application will then render the "dots" for our visualization.

As a summary, in the front-end, we will do the following:

1. Subscribe to the API via GraphQL
2. Create an SVG component
3. Iterate over all the chunks and add circles in the previous component
4. Style the circle and add events to interact with it

## Summary

TimescaleDB is a powerful relational database for time-series data. But TimescaleDB is also built on top of PostgreSQL, the fastest growing database in the world. As a result, you can not only leverage the full spectrum of tools and dashboards available for PostgreSQL, but you can also build your own custom tools and dashboards to connect to PostgreSQL.

The easiest way to get a TimescaleDB instance is to [try for free][timescale-signup] using our hosted service. You can also [download TimescaleDB for free][timescale-install] and run locally or in your own cloud infrastructure.

You can get the full code for this project from [this GitHub repo][repo-example].

We hope you find new ways to explore your data and make your decisions smarter and data-driven. If you get any interesting results or have any questions about this tutorial, drop us a line on our [community Slack channel][timescale-slack].

[TimescaleDB]: https://timescale.com/
[timescale-signup]: https://www.timescale.com/timescale-signup
[timescale-slack]: https://slack.timescale.com
[timescale-install]: /timescaledb/latest/how-to-guides/install-timescaledb
[repo-example]: https://github.com/jacobprall/compression-presentation-app
[hypertables]: /timescaledb/latest/how-to-guides/hypertables/
[caggs]: /timescaledb/latest/how-to-guides/continuous-aggregates/
[data retention]: /timescaledb/latest/how-to-guides/data-retention/
[compression]: /timescaledb/latest/how-to-guides/compression/compression-basics/
[iot-tutorial]: /timescaledb/latest/tutorials/simulate-iot-sensor-data/
[Hasura]: http://hasura.io/
[hasura-cloud]: https://cloud.hasura.io/
