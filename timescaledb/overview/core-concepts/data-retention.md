---
title: Data retention
excerpt: Learn how you can delete historical data to save storage
keywords: [data retention]
tags: [data retention, delete, drop]
---

# Data retention

An intrinsic part of time-series data is that new data is accumulated
and old data is rarely, if ever, updated and the relevance of the data
diminishes over time. It is therefore often desirable to delete old
data to save disk space.

As an example, if you have a hypertable definition of `conditions`
where you collect raw data into chunks of one day:

```sql
CREATE TABLE conditions(
    time TIMESTAMPTZ NOT NULL,
    device INTEGER,
    temperature FLOAT
);

SELECT * FROM create_hypertable('conditions', 'time',
       chunk_time_interval => INTERVAL '1 day');
```

If you collect a lot of data and realize that you never actually use
raw data older than 30 days, you might want to delete data older than
30 days from `conditions`.

However, deleting large swaths of data from tables can be costly and
slow if done row-by-row using the standard `DELETE` command. Instead,
TimescaleDB provides a function [`drop_chunks`][drop-chunks] that quickly drop data
at the granularity of chunks without incurring the same overhead.

For example:

```sql
SELECT drop_chunks('conditions', INTERVAL '24 hours');
```

This drops all chunks from the hypertable `conditions` that _only_
include data older than this duration, and does _not_ delete any
individual rows of data in chunks.


## Automatic data retention policies [](retention-policy)

TimescaleDB also includes a background job scheduling framework for automating
data management tasks, such as enabling easy [data retention policies][add-retention-policy]. With
policies, you can set data retention standards on each hypertable and allow
TimescaleDB to drop data as necessary.

It's worth noting that [continuous aggregates][continuous-aggregates] are also valid targets retention
policies.

[add-retention-policy]: /api/:currentVersion:/data-retention/add_retention_policy/
[continuous-aggregates]: /timescaledb/:currentVersion:/overview/core-concepts/continuous-aggregates/
[drop-chunks]: /api/:currentVersion:/hypertable/drop_chunks/
