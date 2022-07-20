---
title: Wide-table model
excerpt: Learn how to model your data in a wide-table model
keywords: [data, hypertables]
tags: [model]
---

## Wide-table model

TimescaleDB easily supports wide-table models. Queries across multiple metrics are
easier in this model, since they do not require JOINs. Also, ingest is faster
since only one timestamp is written for multiple metrics.

A typical wide-table model would match
a typical data stream in which multiple metrics are collected at a given timestamp:

timestamp | device_id | cpu_1m_avg | free_mem | temperature | location_id | dev_type
---:|---:|---:|---:|---:|---:|---:
2017-01-01 01:02:00 | abc123 | 80 | 500&nbsp;MB | 72 | 42 | field
2017-01-01 01:02:23 | def456 | 90 | 400&nbsp;MB | 64 | 42 | roof
2017-01-01 01:02:30 | ghi789 | 120 | 0&nbsp;MB | 56 | 77 | roof
2017-01-01 01:03:12 | abc123 | 80 | 500&nbsp;MB | 72 | 42 | field
2017-01-01 01:03:35 | def456 | 95 | 350&nbsp;MB | 64 | 42 | roof
2017-01-01 01:03:42 | ghi789 | 100 | 100&nbsp;MB | 56 | 77 | roof

Here, each row is a new reading, with a set of measurements and metadata at a
given time. This allows us to preserve relationships within the data, and
ask more interesting or exploratory questions than before.

Of course, this is not a new format: it's what one would commonly find within
a relational database.

## JOINs with relational data

TimescaleDB's data model also has another similarity with relational
databases: it supports JOINs. Specifically, one can store additional
metadata in a secondary table, and then utilize that data at query time.

In our example, one could have a separate locations table,
mapping `location_id` to additional metadata for that location. For example:

location_id | name | latitude | longitude | zip_code | region
---:|---:|---:|---:|---:|---:
42 | Grand Central Terminal | 40.7527° N | 73.9772° W | 10017 | NYC
77 | Lobby 7 | 42.3593° N | 71.0935° W | 02139 | Massachusetts

Then at query time, by joining our two tables, one could ask questions
like: what is the average `free_mem` of our devices in `zip_code` 10017?

Without joins, one would need to denormalize their data and store
all metadata with each measurement row. This creates data bloat,
and makes data management more difficult.

With JOINs, you can store metadata independently, and update mappings more
easily. For example, to change the `region` for `location_id` 77 from
"Massachusetts" to "Boston," one can change the metadata without overwriting
historical data in the time-series table.
