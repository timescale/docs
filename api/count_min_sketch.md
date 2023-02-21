---
api_name: count_min_sketch()
excerpt: Aggregate data in a `count_min_sketch` for calculation of estimates
topics: [hyperfunctions]
tags: [hyperfunctions, frequency, count min sketch]
api:
  license: community
  type: function
  experimental: true
  toolkit: true
  version:
    experimental: 1.8.0
hyperfunction:
  family: frequency analysis
  type: aggregate
---

import Experimental from 'versionContent/_partials/_experimental.mdx';

# count_min_sketch() <Tag type="toolkit" content="Toolkit" /><Tag type="experimental-toolkit" content="Experimental" />

Produces a [Count-Min Sketch][count-min-sketch] in the form of an aggregate that can be passed to the [`approx_count` function][approx-count] to estimate how many times a particular value has appeared in a column.

```sql
count_min_sketch(
    values TEXT,
    error DOUBLE PRECISION,
    probability DOUBLE PRECISION,
) RETURNS CountMinSketch
```

<Experimental />

## Required arguments

|Name|Type|Description|
|-|-|-|
|`values`|`TEXT`|Column to aggregate|
|`error`|`DOUBLE PRECISION`|Error tolerance in estimate, calculated relative to the number of values added to the sketch|
|`probability`|`DOUBLE PRECISION`|Probability that an estimate falls outside the error bounds|

## Returns

|Column|Type|Description|
|-|-|-|
|`agg`|`CountMinSketch`|An object storing a table of counters.|

## Sample usage

Create a Count-Min Sketch of the stock symbols seen in your tick data.
With this aggregate, you'll then be able to estimate how often any text value appears in the `symbol` column.

```sql
SELECT count_min_sketch(symbol, 0.01, 0.01) AS symbol_sketch
FROM stocks_real_time;
```

In this example, the first `0.01` dictates that your frequency estimates have a relative error of 1%.
A relative error of 1% means that the approximate count of an item is overestimated by at most 1% of the total number of (non-`NULL`) rows in the column you aggregated.
(The Count-Min Sketch is a biased estimator of the true frequency because it may overestimate the count of an item, but it cannot underestimate that count.)

The second `0.01` means that your estimated frequency falls outside those error bounds 1% of the time (on average).

You can then pass this aggregate into the [`approx_count` function][approx-count].
Doing so gives you an estimate of how many times a given symbol appears in the `symbol` column.

For example, if you wanted to know approximately how many of the quotes in the tick data were for the `AAPL` stock, you would then do the following:

```sql
WITH t AS (
  SELECT count_min_sketch(symbol, 0.01, 0.01) AS symbol_sketch
  FROM stocks_real_time
)
SELECT toolkit_experimental.approx_count('AAPL', symbol_sketch)
FROM t;
```

[approx-count]: /api/:currentVersion:/hyperfunctions/frequency-analysis/approx_count/
{/* <!-- vale Google.EnDash = NO --> */}
[count-min-sketch]: https://en.wikipedia.org/wiki/Count–min_sketch
