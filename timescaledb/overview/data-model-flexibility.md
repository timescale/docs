---
title: Data model
excerpt: Learn how to model your data in TimescaleDB, in either a wide or narrow model
keywords: [hypertables]
tags: [model]
---

import RelationalMetadata from 'versionContent/_partials/_data_model_metadata.mdx';

# Data model

With TimescaleDB, you have full flexibility over your data model. You can choose
either a wide-table or narrow-table model to suit your use case.

TimescaleDB offers this flexibility because it's a relational database
supporting full SQL. Most other time-series databases aren't as flexible. They
usually require a narrow-table model for all data, which creates some
limitations.

Because TimescaleDB is a relational database, it also supports `JOIN`s. This
allows you to normalize your data and reduce data bloat.

## Comparing wide-table and narrow-table models

Wide-table and narrow-table models are two ways of storing data when you have
multiple metrics to track. For example, if you're recording sensor data, you
might have the following metrics for each sensor:

*   Average CPU usage per minute: `cpu_1m_avg`
*   Free memory: `free_mem`
*   Temperature: `temperature`

You might also have the following identifier and metadata for each sensor:

*   Identifier: `device_id`
*   Sensor location: `location_id`
*   Device type: `dev_type`

You incoming data looks like this:

|timestamp|device_id|cpu_1m_avg|free_mem|temperature|location_id|dev_type|
|-|-|-|-|-|-|-|
|2017-01-01 01:02:00|abc123|80|500&nbsp;MB|72|335|field|
|2017-01-01 01:02:23|def456|90|400&nbsp;MB|64|335|roof|
|2017-01-01 01:02:30|ghi789|120|0&nbsp;MB|56|77|roof|
|2017-01-01 01:03:12|abc123|80|500&nbsp;MB|72|335|field|
|2017-01-01 01:03:35|def456|95|350&nbsp;MB|64|335|roof|
|2017-01-01 01:03:42|ghi789|100|100&nbsp;MB|56|77|roof|

You can store all the metrics for one timestamp as a single entry. This is a
wide-table model. Alternately, you can store a separate entry for each metric,
and repeat the timestamp. This is a narrow-table model.

Read on to learn about the trade-offs of each model.

## Narrow-table model

Most time-series databases use a narrow-table model. They store each metric
separately. For example, `cpu_1m_avg` and `free_mem` are always stored as two
different entries.

In addition, a tag set is created for every combination of metadata values.
Every entry is associated with a tag set. Different tag sets are also stored as
different entries.

That means you get `n` different time series, where `n` is equal to:

```text
number of metrics
x
number of identifiers
x
number of values for metadata field A
x
number of values for metadata field B
x
...
```

In this example, you get 9 time series. Each time series is defined by a unique
tag set:

```text
1. {name:  cpu_1m_avg,  device_id: abc123,  location_id: 335,  dev_type: field}
2. {name:  cpu_1m_avg,  device_id: def456,  location_id: 335,  dev_type: roof}
3. {name:  cpu_1m_avg,  device_id: ghi789,  location_id:  77,  dev_type: roof}
4. {name:    free_mem,  device_id: abc123,  location_id: 335,  dev_type: field}
5. {name:    free_mem,  device_id: def456,  location_id: 335,  dev_type: roof}
6. {name:    free_mem,  device_id: ghi789,  location_id:  77,  dev_type: roof}
7. {name: temperature,  device_id: abc123,  location_id: 335,  dev_type: field}
8. {name: temperature,  device_id: def456,  location_id: 335,  dev_type: roof}
9. {name: temperature,  device_id: ghi789,  location_id:  77,  dev_type: roof}
```

When you have many tag sets, your data has high cardinality. Cardinality is the
number of possible distinct values for a field. Some time-series databases
have performance problems when cardinality increases. This limits the number of
device types and devices you can store in a single database.

TimescaleDB also supports narrow models. But it doesn't suffer from the same
cardinality limitations. That's because it uses a relational model with
partitioning optimizations for time-series data.

A narrow-table model in TimescaleDB looks like this:

|timestamp|device_id|metric_type|value|
|-|-|-|-|
|2017-01-01 01:02:00|abc123|cpu_1m_avg|80|
|2017-01-01 01:02:00|abc123|free_mem|500|
|2017-01-01 01:02:00|abc123|temperature|72|

Note that the timestamp and device ID are the same for each entry. But the
entries are stored in separate rows because they record different metrics.

<RelationalMetadata />

### When to choose a narrow-table model

A narrow-table model makes sense if you collect each metric independently. For
example, you might collect CPU data and temperature data on different devices or
at different times.

A narrow-table model also gives you the flexibility to add new metrics as you
go. If you now decide to collect disk usage data, you can continue inserting to
the same table by changing the `metric_type` value. You don't need to change the
table schema.

However, if you collect many metrics with the same timestamp, a narrow model
isn't as performant. You need to write many entries with repeated timestamps.
This increases storage and ingest requirements.

Also, if you query multiple metrics at the same time, queries become more
complex. To see both CPU usage and temperature, you need to `JOIN` separate
entries.

In these cases, a wide-table model works better.

## Wide-table model

Wide-table models are the format usually used in relational databases. Because
TimescaleDB is fully compatible with PostgreSQL, it automatically supports
wide-table models.

In this model, each device has a single entry for each timestamp. Each entry
includes values for multiple metrics:

|timestamp|device_id|cpu_1m_avg|free_mem|temperature|
|-|-|-|-|-|
|2017-01-01 01:02:00|abc123|80|500&nbsp;MB|72|
|2017-01-01 01:02:23|def456|90|400&nbsp;MB|64|
|2017-01-01 01:02:30|ghi789|120|0&nbsp;MB|56|
|2017-01-01 01:03:12|abc123|80|500&nbsp;MB|72|
|2017-01-01 01:03:35|def456|95|350&nbsp;MB|64|
|2017-01-01 01:03:42|ghi789|100|100&nbsp;MB|56|

This model preserves relationships within data. The temperature for each device
is stored on the same row as the CPU usage at that time. This makes queries
across multiple metrics easier. No `JOIN`s are required. Also, ingest is faster,
because only one timestamp is written for multiple metrics.

<RelationalMetadata />

## JOINs with relational data

As a relational database, TimescaleDB supports `JOIN`s. You can store additional
metadata in secondary tables, which get joined to the main table at query time.
For example, you might create a `locations` table to store metadata about each
`location_id`:

|location_id|name|latitude|longitude|zip_code|region|
|-|-|-|-|-|-|
|42|Grand Central Terminal|40.7527° N|73.9772° W|10017|NYC|
|77|Lobby 7|42.3593° N|71.0935° W|02139|Massachusetts|

This reduces data bloat, because you don't need to store repetitive values on
every row. For example, you might have 10,000 rows of data for location `42`.
But you only need to define that location `42` is at Grand Central Terminal
once, within your metadata table.

This also lets you update mappings easily. If you change the region for location
`77` from `Massachusetts` to `Boston`, you only need to change a single value in
the metadata table. If you stored this value in your primary table, you would
need to overwrite many rows of historical data to correct all your entries.
