# Advanced data management
In the final part of this tutorial, you will see some more advanced techniques
to efficiently manage your tick and candlestick data long-term. TimescaleDB
is equipped with multiple features that help you manage your data lifecycle
and reduce your disk storage needs as your data grows.

You will see four examples how you can set up automation policies on your
hypertable (containing tick data) and continuous aggregates (containing
various candlestick aggregations) to save on disk storage and improve the
performance of long-range analytical queries:

* Automatically delete older tick data
* Automatically delete older candlestick data
* Automatically compress tick data
* Automatically compress candlestick data

Before implementing any of these automation policies, it’s important to gain
a high level understanding about chunk time intervals in TimescaleDB
hypertables and continuous aggregates. The chunk time interval you set
for your tick data table directly affects how these automation policies
will work. Hence, we suggest that you should have at least a high level
understanding of [hypertables and chunks][chunks].

## Hypertable chunk time intervals and automation policies
TimescaleDB uses hypertables to provide a high-level and familiar abstraction
layer to interact with PostgreSQL tables. You just need to access one
hypertable to access all of your time-series data.

Under the hood, TimescaleDB creates chunks based on the timestamp column.
Each chunk size is determined by the [`chunk_time_interval`][interval]
parameter you can provide when creating the hypertable or you can also change
this setting afterwards. If you don’t provide this optional parameter, the
chunk time interval will be 7 days, by default. This means that each of the
chunks in the hypertable will contain 7 days worth of data.

Why is this important to be aware of? It’s important because all of the
TimescaleDB automation policies described below depend on this information
and the chunk time interval fundamentally affects how these policies impact
your data.

Let’s look at these specific automation policies and how they work in the
context of financial tick data.

## Automatically delete older tick data
The older most time-series data becomes, the less relevant and useful it is.
This is often the case with tick data as well. As time goes on you might not
need the raw tick data any more because you only want to query the candlestick
aggregations. In this scenario, you can decide to remove old tick data
automatically from your hypertable after it becomes older than a certain time
interval.

TimescaleDB has a built-in way to automatically remove raw data after a
specific time. You can set up this automation using a
[data retention policy][retention]:

```sql
SELECT add_retention_policy('crypto_ticks', INTERVAL '7 days');
```

Running this SQL, it adds a data retention policy to the `crypto_ticks`
hypertable that will remove a chunk after all the data in the chunk gets
older than 7 days. Important to note that all records in the chunk need to be
older than 7 days before the chunk is dropped. 

This is where the knowledge about your hypertable’s chunk time interval
becomes crucial. If you were to set a data retention policy with
`INTERVAL '3 days'`, the policy would NOT remove any data after three days.
Why? Because your chunk time interval is 7 days. Meaning, even after three
days, the most recent chunk would still contain data that is newer than three
days, hence cannot be removed by the data retention policy.

If you want to change this behavior in order to drop chunks more often and
sooner, experiment with different chunk time intervals. For example, if you
set the chunk time interval to be 2 days only, you could create a retention
policy with a 2-day interval which would drop a chunk every other day
(assuming you’re ingesting data in the meantime).

[Read more about data retention.][retention]

<highlight type="warning">
Make sure none of the continuous aggregate policies intersect with a data
retention policy. It’s possible to keep the candlestick data in the continuous
aggregate and drop tick data from the underlying hypertable, but only if you
materialize data in the continuous aggregate first, before the data is dropped
from the underlying hypertable.
</highlight>

## Automatically delete older candlestick data
Deleting older raw tick data from your hypertable while retaining aggregate
views for longer periods is a common way of minimizing disk utilization.
However, deleting older candlestick data from the continuous aggregates can
provide another method for further control over long-term disk usage.
TimescaleDB allows you to create data retention policies on continuous
aggregates as well.

<highlight type="tip">
Continuous aggregates also have chunk time intervals (because they use
hypertables under the hood). By default, the continuous aggregate’s chunk
time interval is 10x what the original hypertable’s chunk time interval is.
For example, if the original hypertable’s chunk time interval is 7 days, the
continuous aggregates that are on top of it will have a 70 day chunk time
interval.
</highlight>

Let’s see how you can set up a data retention policy to remove old data from
your `one_min_candle` continuous aggregate:
```sql
SELECT add_retention_policy('one_min_candle', INTERVAL '70 days');
```

This data retention policy will remove chunks from the continuous aggregate
that are older than 70 days. In TimescaleDB, this is determined by the
`range_end` property of a hypertable (or materialized hypertable in context
of continuous aggregates). In practice, this means that if you were to
define a data retention policy of 30 days for a continuous aggregate that has
a chunk_time_interval of 70 days, data would not be removed from the
continuous aggregates until the `range_end` of a chunk is at least 70
days older than the current time, due to the chunk time interval of the
original hypertable.

## Automatically compress tick data

Going further TimescaleDB allows you to keep your tick data in the hypertable
but still save on storage costs with TimescaleDB’s native compression.
You just need to enable compression on the hypertable and set up a compression
policy to automatically compress old data.

Enable compression on crypto_ticks hypertable:
```sql
ALTER TABLE crypto_ticks SET (
 timescaledb.compress,
 timescaledb.compress_segmentby = 'symbol'
);
```

Set up compression policy to compress data that’s older than 7 days:
```sql
SELECT add_compression_policy('crypto_ticks', INTERVAL '7 days');
```

Executing these two SQL scripts will make sure to compress chunks that are
older than 7 days.

[Read more about compression.][compression]

## Automatically compress candlestick data
Beginning with [TimescaleDB 2.6][release-blog], you can also set up a
compression policy on your continuous aggregates. This is a useful feature
if you store a lot of historical candlestick data that consumes significant
disk space but you still want to retain it for longer periods.

Enable compression on the 1-min candlestick view:
```sql
ALTER MATERIALIZED VIEW one_min_candle set (timescaledb.compress = true);
```

Set compression policy to compress data after 70 days:
```sql
SELECT add_compression_policy('one_min_candle', compress_after=> INTERVAL '70 days');
```

<highlight type="warning">
Before setting up a compression policy on any of the candlestick views, you
should set up a refresh policy first. The compression policy interval should
be set so that actively refreshed time intervals are not compressed.
</highlight>

[Read more about compressing continuous aggregates.][caggs-compress]

[chunks]: https://docs.timescale.com/timescaledb/latest/overview/core-concepts/hypertables-and-chunks/
[interval]: /hypertable/set_chunk_time_interval/
[retention]: /how-to-guides/data-retention/create-a-retention-policy/
[compression]: /how-to-guides/compression/
[release-blog]: https://www.timescale.com/blog/increase-your-storage-savings-with-timescaledb-2-6-introducing-compression-for-continuous-aggregates/
[caggs-compress]: /how-to-guides/continuous-aggregates/compression-on-continuous-aggregates/