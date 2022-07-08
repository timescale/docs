---
api_name: add_compression_policy()
excerpt: Add policy to schedule automatic compression of chunks
license: community
topic: compression
tags: [compression, policy, scheduled jobs]
---

# add_compression_policy() <tag type="community" content="community" />
Allows you to set a policy by which the system compresses a chunk
automatically in the background after it reaches a given age.

Note that compression policies can only be created on hypertables or continuous
aggregates that already have compression enabled. Use the 
[`ALTER TABLE`][compression_alter-table] command to set `timescaledb.compress` 
and other configuration parameters for hypertables. Use 
[`ALTER MATERIALIZED VIEW`][compression_continuous-aggregate] command to 
enable compression on continuous aggregates. To view the policies that you set or 
the policies that already exist, see 
[informational views][informational-views].

### Required arguments

|Name|Type|Description|
|---|---|---|
|`hypertable`|REGCLASS|Name of the hypertable or continuous aggregate|
|`compress_after`|INTERVAL or INTEGER|The age after which the policy job compresses chunks. `compress_after` is calculated relative to the current time, so chunks containing data older than `now - {compress_after}::interval` are compressed.|

The `compress_after` parameter should be specified differently depending 
on the type of the time column of the hypertable or continuous aggregate:
- For hypertables with TIMESTAMP, TIMESTAMPTZ, and DATE time columns: the time interval should be an INTERVAL type.
- For hypertables with integer-based timestamps: the time interval should be an integer type (this requires
the [integer_now_func][set_integer_now_func] to be set).

### Optional arguments

|Name|Type|Description|
|---|---|---|
| `if_not_exists` | BOOLEAN | Setting to true causes the command to fail with a warning instead of an error if a compression policy already exists on the hypertable. Defaults to false.|

<highlight type="important">
Compression policies on continuous aggregates should be set up so that they do
not overlap with refresh policies on continuous aggregates. This is due to a 
current TimescaleDB limitation that prevents refresh of compressed regions of
continuous aggregates.
</highlight>

### Sample usage
Add a policy to compress chunks older than 60 days on the 'cpu' hypertable.

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
[set_integer_now_func]: /hypertable/set_integer_now_func
[informational-views]: /api/:currentVersion:/informational-views/jobs/
