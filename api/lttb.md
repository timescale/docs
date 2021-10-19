# lttb()  <tag type="toolkit">Toolkit</tag><tag type="experimental">Experimental</tag>
[Largest Triangle Three Buckets](https://github.com/sveinn-steinarsson/flot-downsample)
is a downsampling method that tries to retain visual similarity between the
downsampled data and the original dataset. TimescaleDB Toolkit provides an
implementation of this which takes `(timestamp, value)` pairs, sorts them if
needed, and downsamples them.

## Required Arguments
|Name| Type |Description|
|---|---|---|
| `time` | `TIMESTAMPTZ` | Time (x) value for the data point. |
| `value` | `DOUBLE PRECISION` |  Data (y) value for the data point. |
| `resolution` | `INTEGER` | Number of points the output should have. |

## Returns

|Column|Type|Description|
|---|---|---|
| `sortedtimevector` | `SortedTimevector` | A [`timevector`][hyperfunctions-timevectors] object containing the downsampled points.  It can be unpacked via `unnest` |

## Sample Usage
This example gets a dramatically downsampled data set from a `sample_data` table.

```SQL
SELECT time, value
FROM toolkit_experimental.unnest((
    SELECT toolkit_experimental.lttb(time, val, 4)
    FROM sample_data))
```
```output
          time          |       value
------------------------+--------------------
 2020-01-11 00:00:00+00 |   12.7015115293407
 2020-02-01 00:00:00+00 |  5.004324248633603
 2020-03-03 00:00:00+00 | 14.982710485116087
 2020-04-20 00:00:00+00 | 10.022128489940254
```

[hyperfunctions-timevectors]: timescaledb/:currentVersion:/how-to-guides/hyperfunctions/function-pipelines/#timevectors
