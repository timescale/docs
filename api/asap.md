# asap_smooth()  <tag type="toolkit">Toolkit</tag><tag type="experimental">Experimental</tag>
The [ASAP smoothing alogrithm](https://arxiv.org/pdf/1703.00983.pdf) is designed create human readable graphs which preserve the rough shape and larger trends of the input data while minimizing the local variance between points.  The `asap_smooth` hyperfunction provides an implementation of this algorithm which takes `(timestamptz, double precision)` data and returns an ASAP smoothed [`timevector`][hyperfunctions-timevectors].

## Required Arguments
|Name| Type |Description|
|---|---|---|
| `ts` | `TIMESTAMPTZ` | Column of timestamps corresponding to the values to aggregate |
| `value` | `DOUBLE PRECISION` |  Column to aggregate. |
| `resolution` | `INT` |  Approximate number of points to return.  Intended to represent the horizontal resolution in which the aggregate will be graphed

## Returns

|Column|Type|Description|
|---|---|---|
| `normalizedtimevector` | `NormalizedTimevector` | A object representing a series of values occurring at set intervals from a starting time.  It can be unpacked via `unnest` |

## Sample Usage
For this examples assume we have a table 'metrics' with columns 'date' and 'reading' which contains some interesting measurment we've accumulated over a large interval.  The following example would take that data and give us a smoothed representation of approximately 10 points which would still show any anomolous readings:

```SQL
SET TIME ZONE 'UTC';
CREATE TABLE metrics(date TIMESTAMPTZ, reading DOUBLE PRECISION);
INSERT INTO metrics
SELECT
    '2020-1-1 UTC'::timestamptz + make_interval(hours=>foo),
    (5 + 5 * sin(foo / 12.0 * PI()))
    FROM generate_series(1,168) foo;

```

```SQL
SELECT * FROM toolkit_experimental.unnest(
    (SELECT toolkit_experimental.asap_smooth(date, reading, 8)
     FROM metrics));
```
```output
          time          |        value
------------------------+---------------------
 2020-01-01 01:00:00+00 | 5.3664814565722665
 2020-01-01 21:00:00+00 |  5.949469264090644
 2020-01-02 17:00:00+00 |  5.582987807518377
 2020-01-03 13:00:00+00 |  4.633518543427733
 2020-01-04 09:00:00+00 |  4.050530735909357
 2020-01-05 05:00:00+00 |  4.417012192481623
 2020-01-06 01:00:00+00 |  5.366481456572268
 2020-01-06 21:00:00+00 |  5.949469264090643
```


[hyperfunctions-timevectors]: timescaledb/:currentVersion:/how-to-guides/hyperfunctions/function-pipelines/#timevectors
