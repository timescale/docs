---
title: Custom TimescaleDB dashboards
excerpt: Build custom TimescaleDB dashboards with Hasura GraphQL and React
products: [cloud, mst, self_hosted]
keywords: [visualizations, analytics, hasura]
---

# Custom TimescaleDB dashboards

To help you understand what is going on in your database, you can create your
own custom visualizations and dashboards. TimescaleDB allows you to create
custom dashboards for your data, using the full functionality of PostgreSQL
monitoring. Of course, you can always use other commercial tools to monitor
TimescaleDB, just as you can with PostgreSQL, but custom dashboards give you the
most flexibility.

This tutorial shows you how to build a custom visualization that shows how
many chunks a hypertable has, the state of the compression for each chunk, and
the current total size of the database. The front-end is built in React, and
connects to metrics about TimescaleDB using Hasura, a GraphQL service. This
tutorial includes:

*   Concepts within TimescaleDB that work well for visualization
*   How to query TimescaleDB views and functions to get details about
    hypertables and chunks
*   How to generate sample data
*   How Hasura can help to stream data through GraphQL subscriptions
*   How to build your React front-end to visualize the data

The project uses React, connecting to a [Hasura][] GraphQL API to visualize
[hypertable chunks][hypertables] of a [TimescaleDB][] instance.

The easiest way to get a TimescaleDB instance is to
[try for free][timescale-signup] using our hosted service. You can also
[download TimescaleDB for free][timescale-install] and run locally or in your
own cloud infrastructure.

You can get the full code for this project from
[this GitHub repo][repo-example].

This project works on any TimescaleDB instance, but if you're interested
in generating sample data to use, use our
[Simulating IoT sensor data][iot-tutorial] tutorial.

## How TimescaleDB manages time-series data

TimescaleDB uses [hypertables][] to store time-series data. TimescaleDB
automatically partitions data in hypertables into smaller child tables called
chunks. The chunks represent data for a given time period, which makes it easier
to query and manage over time. For example, if you wanted to query data from
10 AM to 11 AM, instead of scanning your entire database, TimescaleDB would scan
the specific chunks that contain data for just that period. All the interaction
with the database still occurs on the hypertable using SQL, but TimescaleDB
partitions the data to make large queries more efficient.

Many features in TimescaleDB rely on chunks, including
[continuous aggregates][caggs], [data retention][], and native [compression][].
Native compression is particularly helpful with large time-series datasets.
Time-series data can be relentless in quantity and speed, and difficult to store
and query without a purpose-built time-series database. You can use TimescaleDB
compression to save as much as 97% of your disk space for the same amount of
data, and usually increase the speed of your queries over time.

Visualizing the state of your hypertables can help you gain a better
understanding of how compression works and possibly even how different types
impact compression efficiently. Visualization can help you see the results of
compression table by table, and chunk by chunk. To do this, TimescaleDB provides
multiple views and functions that can be queried for information about the
state of your hypertables and chunks. Although there is no combined view that
provides exactly the data we need for our visualization, TimescaleDB provides
the building blocks to craft a custom SQL query that returns the data needed
to better visualize the current hypertable and chunk compression state. For
example, this query returns the name and time series range that this chunk
covers:

```sql
tsdb=> SELECT chunk_name, range_start, range_end FROM timescaledb_information.chunks LIMIT 1;
    chunk_name    |      range_start       |       range_end
------------------+------------------------+------------------------
 _hyper_2_2_chunk | 2021-04-29 00:00:00+00 | 2021-05-06 00:00:00+00
(1 row)
```

## Visualizing tables and chunks

Hypertables that have data spanning massive time periods can have thousands of chunks, so visualizing them effectively is important. To provide a visual perspective of the table, the image area represents the total size of all table data before compression. Each circle represents a chunk, and the area of each circle represents the size of the chunk on disk.

Here's an example of what this visualization looks like:

<img class="main-content__illustration" src="https://assets.timescale.com/docs/images/custom-timescaledb-dashboards-hypertables-compression.webp" width={2500} height={1468} alt="Hypertables compression preview"/>

With this visualization, you can see a few things at a glance:

*   How many chunks are currently part of this hypertable
*   The compression state of each chunk
*   How much space has been saved by enabling compression on some chunks

By using the uncompressed data size to represent the area of the image, you
can quickly get a sense of how much space has been saved by the overall white
space across the image. Smaller yellow chunks are compressed and their size
represents their portion of space within the larger table, while larger dark
chunks are uncompressed and take up more space in the image. You can also make
the visualization interactive, so that you can click on a chunk and compress or
uncompress it manually.

## Create internal views in TimescaleDB to obtain metrics

To build the visualization application, we created some new functions and views to:

*   Extract information from chunks, such as name and time range
*   Get extra details about which chunks are compressed
*   Get compression statistics and fetch the chunk size after compression

### Extract information from chunks

To extract information from chunks, you can use the
`timescaledb_information.chunks` view that the TimescaleDB extension provides.

This query returns the time-series range of each chunk:

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

The chunk name returned with the dataset is unique, and can be used in other
queries to retrieve enhanced details about each chunk. In this example, the
chunk has a `range_start` and `range_end` that spans one week. As new data is
inserted into the table, any data that has a timestamp between 2021-04-29 and
2021-05-06 is stored on this specific chunk for the `conditions` table.

### Get details about compression status for a chunk

When you know the name and time range of each chunk, you need to get more
detail about the compression status and how much disk is being saved by
compressing the data. You can get this additional information by querying the
`chunk_compression_stats` function with the `conditions` hypertable:

```sql
tsdb=> SELECT * FROM chunk_compression_stats('conditions');
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

When the chunk is uncompressed, this query does not show the size of the chunk.
To get the size of uncompressed chunks, use the `chunks_detailed_size` function,
and pass the hypertable name as a parameter:

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

You can use the `total_bytes` information in this function to see that the chunk
is uncompressed.

### Building views for our TimescaleDB metrics

Now that you know how to gather all of the data you need to drive the
visualization, it's time to join it together in a view that can be queried using
SQL (and eventually, our application).

```sql
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

<Highlight type="warning">
The view is dependent on TimescaleDB internals. You might need to drop the view
to upgrade the TimescaleDB extension, and recreate it after the upgrade.
</Highlight>

To test, use the name of a random chunk from the hypertable to query this view
and check that you get all of the information you need. You should see the time
range of the chunk, the hypertable information, and its size before and after
compression.

In this example chunk, the `before_compression_total_bytes` is ten times bigger
than `after_compression_total_bytes`. Compression saved more than 90% of disk
space!

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

In this example, we are using data generated by our
[Simulating IoT sensor data][iot-tutorial] tutorial. This data results in a
simple schema and data that mimics a number of IoT sensors with information on
time, device, and temperature.

By following the tutorial, you have a table named `conditions`, which stores the
temperature of example devices over time.

Use these commands to create the table and generate some sample data:

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

## Connecting to the database and retrieving metrics

When you write a backend application, you need to protect the database and
expose only the required information to an authorized user. The Hasura GraphQL
Engine does this by providing GraphQL APIs over new or existing PostgreSQL
databases. This allows you to create permission rules and dynamically expand
your database resources.

When you have your sample database set up, you can use the
[Hasura cloud][hasura-cloud] to connect the resources that we want to expose
through GraphQL. Hasura is a good option because it connects to our TimescaleDB
database and quickly exposes the tables, views, and functions you need. For
more information about setting up a new data source on Hasura, check out their
wizard.

We're going to use two types of operations:

*   Queries and subscriptions: watch a specific query and keep pulling data
    updates to the client. In this example, you subscribe to the chunks'
    metadata.
*   Mutation: convention for operations that write data. In this example, you
    map the compression and decompression actions as mutations.

### Queries and subscriptions

Hasura allows you to attach any resource and offer it as a query or a
subscription. In this example, you map the `chunks_with_compression` view you
created earlier as a GraphQL resource, so it can be consumed as a query or
subscription. You can then map the changes, or mutations, as you compress and
decompress a chunk. This image describes a SQL view is tracked on Hasura:

![Tracking a SQL view on Hasura cloud](https://assets.timescale.com/docs/images/tutorials/visualizing-compression/hasura-cloud-track-view.png)

### Mutations

Hasura can map custom types that come from table structures. To create the
necessary mutations, functions need to return types that inherit from table
structures. To create a new structure of the table from a query, call the query
with limit 0:

#### Compress chunk mutation

```sql
CREATE TABLE compressed_chunk AS
SELECT compress_chunk((c.chunk_schema ||'.' ||c.chunk_name)::regclass)
FROM   timescaledb_information.chunks c
WHERE  NOT c.is_compressed limit 0;
```

Hasura needs a function to be tracked as a mutation. Create a function to rewrap
the default `compress_chunk` from the TimescaleDB extension, and return the
"compressed_chunk" in a function that compresses the chunk:

```sql
CREATE OR REPLACE FUNCTION compress_chunk_named(varchar) returns setof compressed_chunk AS $$
  SELECT compress_chunk((c.chunk_schema ||'.' ||$1)::regclass)
  FROM   timescaledb_information.chunks c
  WHERE  NOT c.is_compressed
  AND    c.chunk_name = $1 limit 1
$$ LANGUAGE SQL VOLATILE;
```

Note that the function adds an extra `where` clause so that it does not compress
a chunk that is already compressed.

![Tracking compress chunk mutation on Hasura cloud](https://assets.timescale.com/docs/images/tutorials/visualizing-compression/hasura-cloud-compress-chunk-mutation.png)

#### Decompress chunk mutation

You also need a similar function for decompression:

```sql
CREATE OR REPLACE FUNCTION decompress_chunk_named(varchar) returns setof compressed_chunk AS $$
  SELECT decompress_chunk((c.chunk_schema ||'.' ||$1)::regclass)
  FROM   timescaledb_information.chunks c
  WHERE  c.is_compressed
  AND    c.chunk_name = $1 limit 1
$$ LANGUAGE SQL VOLATILE;
```

The next step is to go to the Hasura cloud and connect the database as a new
data source. In the data panel, set up the PostgreSQL URI of your database, and
then you can track each function as a query or mutation. This is an example of
the `compress_chunk_named` function. In our case, the subscription goes to the
`chunks_with_compression` function. You can also track `decompress_chunk_named`
and `compress_chunk_named` as GQL mutations with a single argument.

## Build the front-end visualization

For the full code of our front-end application, see our
[GitHub repo][repo-example]. The front-end application connects to the Hasura
GraphQL layer you created, then connects to the TimescaleDB database to retrieve
information about chunks and compression status. The front-end application then
renders the image for the visualization.

As a summary, the front-end:

1.  Subscribes to the API with GraphQL
1.  Creates an SVG component
1.  Iterates over all the chunks, and adds circles in the previous component
1.  Styles the circle and adds events to interact with the image

## Summary

TimescaleDB is a powerful relational database for time-series data, bringing the
full spectrum of tools and dashboards available for PostgreSQL.

In this tutorial you learned how to collect hypertables metadata from
TimescaleDB internals. Expose it through GraphQL and fetch the data using a
React client.

You can get the full code for this project from
[this GitHub repo][repo-example].

This tutorial was originally created for HasuraCon 2021.

[![Click here to watch the video](https://assets.timescale.com/docs/images/tutorials/visualizing-compression/hasuracon-talk-thumbnail.png)](https://hasura.io/events/hasura-con-2021/talks/visualizing-timescale-db-%20compression-status-in-real-time-with-hasura/ "Watch compression status in real time with Hasura")

We hope you find new ways to explore your data and make your decisions smarter
and data-driven. If you get any interesting results or have any questions about
this tutorial, drop us a line on our [community Slack channel][timescale-slack].

[Hasura]: http://hasura.io/
[TimescaleDB]: https://timescale.com/
[caggs]: /use-timescale/:currentVersion:/continuous-aggregates/
[compression]: /use-timescale/:currentVersion:/compression/
[data retention]: /use-timescale/:currentVersion:/data-retention/
[hasura-cloud]: https://cloud.hasura.io/
[hypertables]: /use-timescale/:currentVersion:/hypertables/
[iot-tutorial]: /tutorials/:currentVersion:/simulate-iot-sensor-data/
[repo-example]: https://github.com/timescale/examples/tree/master/compression-preview
[timescale-install]: /getting-started/latest/
[timescale-signup]: https://www.timescale.com/timescale-signup
[timescale-slack]: https://slack.timescale.com
