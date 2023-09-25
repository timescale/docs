---
api_name: add_compression_policy()
excerpt: Add policy to schedule automatic compression of chunks
topics: [compression, jobs]
keywords: [compression, policies]
tags: [scheduled jobs, background jobs, automation framework]
api:
  license: community
  type: function
---

# add_compression_policy() <Tag type="community" content="community" />

Allows you to set a policy by which the system compresses a chunk
automatically in the background after it reaches a given age.

Compression policies can only be created on hypertables or continuous aggregates
that already have compression enabled. To set `timescaledb.compress` and other
configuration parameters for hypertables, use the
[`ALTER TABLE`][compression_alter-table]
command. To enable compression on continuous aggregates, use the
[`ALTER MATERIALIZED VIEW`][compression_continuous-aggregate]
command . To view the policies that you set or the policies that already exist,
see [informational views][informational-views].

## Required arguments

|Name|Type|Description|
|-|-|-|
|`hypertable`|REGCLASS|Name of the hypertable or continuous aggregate|
|`compress_after`|INTERVAL or INTEGER|The age after which the policy job compresses chunks. `compress_after` is calculated relative to the current time, so chunks containing data older than `now - {compress_after}::interval` are compressed.|
|`schedule_interval`|INTERVAL|The interval between the finish time of the last execution and the next start. Defaults to NULL.|
|`initial_start`|TIMESTAMPTZ|Time the policy is first run. Defaults to NULL. If omitted, then the schedule interval is the interval from the finish time of the last execution to the next start. If provided, it serves as the origin with respect to which the next_start is calculated |
|`timezone`|TEXT|A valid time zone. If `initial_start` is also specified, subsequent executions of the compression policy are aligned on its initial start. However, daylight savings time (DST) changes may shift this alignment. Set to a valid time zone if this is an issue you want to mitigate. If omitted, UTC bucketing is performed. Defaults to `NULL`.|

The `compress_after` parameter should be specified differently depending
on the type of the time column of the hypertable or continuous aggregate:

*   For hypertables with TIMESTAMP, TIMESTAMPTZ, and DATE time columns: the time
    interval should be an INTERVAL type.
*   For hypertables with integer-based timestamps: the time interval should be
    an integer type (this requires the [integer_now_func][set_integer_now_func]
    to be set).

### Optional arguments

|Name|Type|Description|
|-|-|-|
|`if_not_exists`|BOOLEAN|Setting to `true` causes the command to fail with a warning instead of an error if a compression policy already exists on the hypertable. Defaults to false.|

### Sample usage

Add a policy to compress chunks older than 60 days on the `cpu` hypertable.

``` sql
SELECT add_compression_policy('cpu', INTERVAL '60d');
```

Add a compress chunks policy to a hypertable with an integer-based time column:

``` sql
SELECT add_compression_policy('table_with_bigint_time', BIGINT '600000');
```

Add a policy to compress chunks of a continuous aggregate called `cpu_weekly`, that are
older than eight weeks:

``` sql
SELECT add_compression_policy('cpu_weekly', INTERVAL '8 weeks');
```

[compression_alter-table]: /api/:currentVersion:/compression/alter_table_compression/
[compression_continuous-aggregate]: /api/:currentVersion:/continuous-aggregates/alter_materialized_view/
[set_integer_now_func]: /api/:currentVersion:/hypertable/set_integer_now_func
[informational-views]: /api/:currentVersion:/informational-views/jobs/
