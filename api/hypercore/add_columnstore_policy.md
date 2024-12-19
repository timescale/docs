---
api_name: add_columnstore_policy()
excerpt: Set a policy to automatically move chunks in a hypertable to the columnstore when they reach a given age.
topics: [columnstore, jobs]
keywords: [columnstore, policies]
tags: [scheduled jobs, background jobs, automation framework]
api:
  license: community
  type: function
---

# add_columnstore_policy() <Tag type="community" content="community" />

Set a policy to automatically move chunks in a hypertable to the columnstore when they reach a given age.

## Samples

To create a columnstore policy:

1. **Enable columnstore**

   * [For a hypertable][compression_alter-table]
     ```sql
     ALTER TABLE stocks_real_time SET (timescaledb.enable_columnstore = true, timescaledb.segmentby = 'symbol');
     ```
   * [For a continuous aggregate][compression_continuous-aggregate]
     ```sql
     ALTER MATERIALIZED VIEW stock_candlestick_daily set (timescaledb.enable_columnstore = true, timescaledb.segmentby = 'symbol' );
     ```

1. **Add a policy to move chunks to the columnstore at a specific time interval**

   For example:

   * 60 days after the data was added to the table:
     ``` sql
     SELECT add_columnstore_policy('stocks_real_time', compress_after => INTERVAL '60d');
     ```
   * 3 months prior to the moment you run the query:

     ``` sql
     SELECT add_columnstore_policy('stocks_real_time', compress_created_before => INTERVAL '3 months');
     ```
   * With an integer-based time column:

     ``` sql
     SELECT add_columnstore_policy('table_with_bigint_time', BIGINT '600000');
     ```
   * Older than eight weeks:

     ``` sql
     SELECT add_columnstore_policy('cpu_weekly', INTERVAL '8 weeks');
     ```
     
1. **View the policies that you set or the policies that already exist** 

   See [informational views][informational-views].



## Arguments


| Name        | Type             | Default                                                                                                                                                                                                                                                                        | Required                                       | Description                                    |
|-------------|------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------|------------------------------------------------|
|`hypertable`|REGCLASS| | | Name of the hypertable or continuous aggregate |
|`compress_after`|INTERVAL or INTEGER| | |  The age after which the policy job compresses chunks. `compress_after` is calculated relative to the current time, so chunks containing data older than `now - {compress_after}::interval` are compressed. This argument is mutually exclusive with `compress_created_before`. |
|`compress_created_before`|INTERVAL| | |  Chunks with creation time older than this cut-off point are compressed. The cut-off point is computed as `now() - compress_created_before`. Defaults to `NULL`. Not supported for continuous aggregates yet. This argument is mutually exclusive with `compress_after`.        |

|Name|Type|Description|
|-|-|-|
|`hypertable`|REGCLASS|Name of the hypertable or continuous aggregate|
|`compress_after`|INTERVAL or INTEGER|The age after which the policy job compresses chunks. `compress_after` is calculated relative to the current time, so chunks containing data older than `now - {compress_after}::interval` are compressed. This argument is mutually exclusive with `compress_created_before`.|
|`compress_created_before`|INTERVAL|Chunks with creation time older than this cut-off point are compressed. The cut-off point is computed as `now() - compress_created_before`. Defaults to `NULL`. Not supported for continuous aggregates yet. This argument is mutually exclusive with `compress_after`. |

The `compress_after` parameter should be specified differently depending
on the type of the time column of the hypertable or continuous aggregate:

*   For hypertables with TIMESTAMP, TIMESTAMPTZ, and DATE time columns: the time
    interval should be an INTERVAL type.
*   For hypertables with integer-based timestamps: the time interval should be
    an integer type (this requires the [integer_now_func][set_integer_now_func]
    to be set).

## Optional arguments
<!-- vale Google.Acronyms = NO -->
<!-- vale Vale.Spelling = NO -->

|Name|Type|Description|
|-|-|-|
|`schedule_interval`|INTERVAL|The interval between the finish time of the last execution and the next start. Defaults to 12 hours for hyper tables with a `chunk_time_interval` >= 1 day and `chunk_time_interval / 2` for all other hypertables.|
|`initial_start`|TIMESTAMPTZ|Time the policy is first run. Defaults to NULL. If omitted, then the schedule interval is the interval from the finish time of the last execution to the next start. If provided, it serves as the origin with respect to which the next_start is calculated |
|`timezone`|TEXT|A valid time zone. If `initial_start` is also specified, subsequent executions of the compression policy are aligned on its initial start. However, daylight savings time (DST) changes may shift this alignment. Set to a valid time zone if this is an issue you want to mitigate. If omitted, UTC bucketing is performed. Defaults to `NULL`.|
|`if_not_exists`|BOOLEAN|Setting to `true` causes the command to fail with a warning instead of an error if a compression policy already exists on the hypertable. Defaults to false.|
<!-- vale Google.Acronyms = YES -->
<!-- vale Vale.Spelling = YES -->



[compression_alter-table]: /api/:currentVersion:/compression/alter_table_compression/
[compression_continuous-aggregate]: /api/:currentVersion:/continuous-aggregates/alter_materialized_view/
[set_integer_now_func]: /api/:currentVersion:/hypertable/set_integer_now_func
[informational-views]: /api/:currentVersion:/informational-views/jobs/
