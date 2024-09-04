---
title: Advanced data management
excerpt: Learn advanced techniques for managing your tick and candlestick data long-term
keywords: [finance, analytics]
tags: [candlestick]
---

# Advanced data management

The final part of this tutorial shows you some more advanced techniques
to efficiently manage your tick and candlestick data long-term. TimescaleDB
is equipped with multiple features that help you manage your data lifecycle
and reduce your disk storage needs as your data grows.

This section contains four examples of how you can set up automation policies on your
tick data hypertable and your candlestick continuous aggregates. This can help you
save on disk storage and improve the performance of long-range analytical queries by
automatically:
{/* vale Google.LyHyphens = NO */}
*   [Deleting older tick data](#automatically-delete-older-tick-data)
*   [Deleting older candlestick data](#automatically-delete-older-candlestick-data)
*   [Compressing tick data](#automatically-compress-tick-data)
*   [Compressing candlestick data](#automatically-compress-candlestick-data)
{/* vale Google.LyHyphens = YES */}

Before you implement any of these automation policies, it's important to have
a high-level understanding of chunk time intervals in TimescaleDB
hypertables and continuous aggregates. The chunk time interval you set
for your tick data table directly affects how these automation policies
work. For more information, see the
[hypertables and chunks][chunks] section.

## Hypertable chunk time intervals and automation policies

TimescaleDB uses hypertables to provide a high-level and familiar abstraction
layer to interact with PostgreSQL tables. You just need to access one
hypertable to access all of your time-series data.

Under the hood, TimescaleDB creates chunks based on the timestamp column.
Each chunk size is determined by the [`chunk_time_interval`][interval]
parameter. You can provide this parameter when creating the hypertable, or you can change
it afterwards. If you don't provide this optional parameter, the
chunk time interval defaults to 7 days. This means that each of the
chunks in the hypertable contains 7 days' worth of data.

Knowing your chunk time interval is important. All of the TimescaleDB automation
policies described in this section depend on this information, and the chunk
time interval fundamentally affects how these policies impact your data.

In this section, learn about these automation policies and how they work in the
context of financial tick data.

## Automatically delete older tick data

Usually, the older your time-series data, the less relevant and useful it is.
This is often the case with tick data as well. As time passes, you might not
need the raw tick data any more, because you only want to query the candlestick
aggregations. In this scenario, you can decide to remove tick data
automatically from your hypertable after it gets older than a certain time
interval.

TimescaleDB has a built-in way to automatically remove raw data after a
specific time. You can set up this automation using a
[data retention policy][retention]:

```sql
SELECT add_retention_policy('crypto_ticks', INTERVAL '7 days');
```

When you run this, it adds a data retention policy to the `crypto_ticks`
hypertable that removes a chunk after all the data in the chunk becomes
older than 7 days. All records in the chunk need to be
older than 7 days before the chunk is dropped.

Knowledge of your hypertable's chunk time interval
is crucial here. If you were to set a data retention policy with
`INTERVAL '3 days'`, the policy would not remove any data after three days, because your chunk time interval is seven days. Even after three
days have passed, the most recent chunk still contains data that is newer than three
days, and so cannot be removed by the data retention policy.

If you want to change this behavior, and drop chunks more often and
sooner, experiment with different chunk time intervals. For example, if you
set the chunk time interval to be two days only, you could create a retention
policy with a 2-day interval that would drop a chunk every other day
(assuming you're ingesting data in the meantime).

For more information, see the [data retention][retention] section.

<Highlight type="important">
Make sure none of the continuous aggregate policies intersect with a data
retention policy. It's possible to keep the candlestick data in the continuous
aggregate and drop tick data from the underlying hypertable, but only if you
materialize data in the continuous aggregate first, before the data is dropped
from the underlying hypertable.
</Highlight>

## Automatically delete older candlestick data

Deleting older raw tick data from your hypertable while retaining aggregate
views for longer periods is a common way of minimizing disk utilization.
However, deleting older candlestick data from the continuous aggregates can
provide another method for further control over long-term disk use.
TimescaleDB allows you to create data retention policies on continuous
aggregates as well.

<Highlight type="note">
Continuous aggregates also have chunk time intervals because they use
hypertables in the background. By default, the continuous aggregate's chunk
time interval is 10 times what the original hypertable's chunk time interval is.
For example, if the original hypertable's chunk time interval is 7 days, the
continuous aggregates that are on top of it will have a 70 day chunk time
interval.
</Highlight>

You can set up a data retention policy to remove old data from
your `one_min_candle` continuous aggregate:

```sql
SELECT add_retention_policy('one_min_candle', INTERVAL '70 days');
```

This data retention policy removes chunks from the continuous aggregate
that are older than 70 days. In TimescaleDB, this is determined by the
`range_end` property of a hypertable, or in the case of a continuous
aggregate, the materialized hypertable. In practice, this means that if
you were to
define a data retention policy of 30 days for a continuous aggregate that has
a `chunk_time_interval` of 70 days, data would not be removed from the
continuous aggregates until the `range_end` of a chunk is at least 70
days older than the current time, due to the chunk time interval of the
original hypertable.

## Automatically compress tick data

TimescaleDB allows you to keep your tick data in the hypertable
but still save on storage costs with TimescaleDB's native compression.
You need to enable compression on the hypertable and set up a compression
policy to automatically compress old data.

Enable compression on `crypto_ticks` hypertable:

```sql
ALTER TABLE crypto_ticks SET (
 timescaledb.compress,
 timescaledb.compress_segmentby = 'symbol'
);
```

Set up compression policy to compress data that's older than 7 days:

```sql
SELECT add_compression_policy('crypto_ticks', INTERVAL '7 days');
```

Executing these two SQL scripts compresses chunks that are
older than 7 days.

For more information, see the [compression][compression] section.

## Automatically compress candlestick data

Beginning with [TimescaleDB 2.6][release-blog], you can also set up a
compression policy on your continuous aggregates. This is a useful feature
if you store a lot of historical candlestick data that consumes significant
disk space, but you still want to retain it for longer periods.

Enable compression on the `one_min_candle` view:

```sql
ALTER MATERIALIZED VIEW one_min_candle set (timescaledb.compress = true);
```

Add a compression policy to compress data after 70 days:

```sql
SELECT add_compression_policy('one_min_candle', compress_after=> INTERVAL '70 days');
```

<Highlight type="important">
Before setting a compression policy on any of the candlestick views,
set a refresh policy first. The compression policy interval should
be set so that actively refreshed time intervals are not compressed.
</Highlight>

[Read more about compressing continuous aggregates.][caggs-compress]

[caggs-compress]: /use-timescale/:currentVersion:/continuous-aggregates/compression-on-continuous-aggregates/
[chunks]: /use-timescale/:currentVersion:/hypertables/about-hypertables/
[compression]: /use-timescale/:currentVersion:/compression/
[interval]: /api/:currentVersion:/hypertable/set_chunk_time_interval/
[release-blog]: https://www.timescale.com/blog/increase-your-storage-savings-with-timescaledb-2-6-introducing-compression-for-continuous-aggregates/
[retention]: /use-timescale/:currentVersion:/data-retention/create-a-retention-policy/
