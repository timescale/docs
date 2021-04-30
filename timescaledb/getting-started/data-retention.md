# 8. Create a data retention policy

An intrinsic part of working with time-series data is that the relevance of highly granular data diminishes over time. New data is accumulated and old data is rarely, if ever, updated. It is therefore often desirable to delete old raw data to save disk space.

> Note: In practice old data is often downsampled first such that a summary of it is retained (e.g in a continuous aggregate), while the raw data points are then discarded, via data retention policies.

Just like for Continuous Aggregates and Compression, TimescaleDB provides an automated policy to drop data according to a schedule and defined rules. Automated data retention policies (along with compression and continuous aggregates) give you more control over how much the amount of data you retain at specific granularities and for specific time periods. These policies are "set it and forget it" in nature, meaning less hassle for maintenance and upkeep. 

For example, here is a data retention policy which drops chunks consisting of data older than 25 years from the hypertable `weather_metrics`:

```sql
-- Data retention policy
-- Drop data older than 25 years
SELECT add_retention_policy('weather_metrics', INTERVAL '25 years');
```


And just like with continuous aggregates and compression policies, we can see see information about retention policies and statistics about their jobs from the following informational views:

```sql
-- Informational view for policy details
SELECT * FROM timescaledb_information.jobs;
-- Informational view for stats from run jobs
SELECT * FROM timescaledb_information.job_stats;
```


## Manual Data Retention

Dropping chunks is also useful when done on a one-off basis. One such case is deleting large swaths of data from tables -- this can be costly and slow if done row-by-row using the standard DELETE command. Instead, TimescaleDB provides a function `drop_chunks` that quickly drop data at the granularity of chunks without incurring the same overhead.

```sql
-- Manual data retention
SELECT drop_chunks('weather_metrics', INTERVAL '25 years');
```


This will drop all chunks from the hypertable conditions *that only include data older than the specified duration* of 25 years, and will *not* delete any individual rows of data in chunks.

## Downsampling

We can combine continuous aggregation and data retention policies to implement downsampling on our data. We can downsample high fidelity raw data into summaries via continuous aggregation and then discard the underlying raw observations from our hypertable, while retaining our aggregated version of the data.

We can also take this a step further, by applying data retention policies (or using drop_chunks) on continuous aggregates themselves, since they are a special kind of hypertable. The only restrictions at this time is that you cannot apply compression or continuous aggregation to these hypertables.

For more details and best practices on data retention and automated data retention policies, see the [Data Retention docs.](https://docs.timescale.com/latest/using-timescaledb/data-retention)


