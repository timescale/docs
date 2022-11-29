---
api_name: integral()
excerpt: Calculate the time-weighted integral of values in a `TimeWeightSummary`
topics: [hyperfunctions]
keywords: [average, time-weighted, hyperfunctions, Toolkit]
api:
  license: community
  type: function
  experimental: true
  toolkit: true
  version:
    experimental: 1.11.0
hyperfunction:
  family: time-weighted averages
  type: accessor
  aggregates:
    - time_weight()
---

# integral() <tag type="toolkit">Toolkit</tag><tag type="experimental-toolkit">Experimental</tag>

```SQL
integral(
    tws TimeWeightSummary,
    unit TEXT
) RETURNS DOUBLE PRECISION
```

Compute a time-weighted integral from a `TimeWeightSummary`.

This function is similar to [`average`][hyperfunctions-average] but doesn't divide by the length of time being integrated.

*   For more information about time-weighted average functions, see the
    [hyperfunctions documentation][hyperfunctions-time-weight-average].

### Required arguments

|Name|Type|Description|
|-|-|-|
|`tws`|`TimeWeightSummary`|The input TimeWeightSummary from a [`time_weight`][time_weight] call|

### Optional arguments

|Name|Type|Description|
|-|-|-|
|`unit`|`TEXT`|The unit of time to express the integral in. Can be `microsecond`/`millisecond`/`second`/`minute`/`hour` or any alias for those units supported by PostgreSQL. If `NULL`, defaults to `second`.|

### Returns

|Column|Type|Description|
|-|-|-|
|`integral`|`DOUBLE PRECISION`|The time-weighted integral computed from the `TimeWeightSummary`|

### Sample usage

```SQL
-- Create a table to track irregularly sampled storage usage
CREATE TABLE user_storage_usage(ts TIMESTAMP, storage_bytes BIGINT);
INSERT INTO user_storage_usage(ts, storage_bytes) VALUES
    ('01-01-2022 00:00', 0),
    ('01-01-2022 00:30', 100),
    ('01-01-2022 03:00', 300),
    ('01-01-2022 03:10', 1000),
    ('01-01-2022 03:25', 817);

-- Get the total byte-hours used
SELECT
    time_weight('LOCF', ts, storage_bytes) ->
    toolkit_experimental.integral('hours')
FROM
    user_storage_usage;
```

[hyperfunctions-time-weight-average]: /timescaledb/:currentVersion:/how-to-guides/hyperfunctions/time-weighted-averages/
[hyperfunctions-stats-agg]: /timescaledb/:currentVersion:/how-to-guides/hyperfunctions/stats-aggs/
[time_weight]: /api/:currentVersion:/hyperfunctions/time-weighted-averages/time_weight/
[hyperfunctions-average]: /api/:currentVersion:/hyperfunctions/time-weighted-averages/average-time-weight/
