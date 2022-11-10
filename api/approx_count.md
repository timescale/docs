---
api_name: approx_count()
excerpt: Estimate an item's frequency from a `count_min_sketch`
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
  type: accessor
  aggregates:
    - count_min_sketch()
# fields below will be deprecated
api_category: hyperfunction
api_experimental: true
toolkit: true
hyperfunction_family: 'frequency analysis'
hyperfunction_subfamily: CountMinSketch
hyperfunction_type: accessor
---

import Experimental from 'versionContent/_partials/_experimental.mdx';

# approx_count() <tag type="toolkit" content="Toolkit" /><tag type="experimental-toolkit" content="Experimental" />

Returns an estimate of the number of times that the text `item` was seen by the [Count-Min Sketch][count-min-sketch] `agg`.

```sql
approx_count (
    item TEXT,
    agg CountMinSketch
) RETURNS INTEGER
```

<Experimental />

## Required arguments

|Name|Type|Description|
|-|-|-|
|`item`|`TEXT`|The text whose frequency you want to estimate|
|`agg`|`CountMinSketch`|The aggregate to use for estimating the frequency of `item`|

## Returns

|Column|Type|Description|
|-|-|-|
|`approx_count`|`INTEGER`|The estimated number of times `item` was seen by the sketch|

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

You can then pass this aggregate into the `approx_count` function.
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

<!-- vale Google.EnDash = NO -->
[count-min-sketch]: https://en.wikipedia.org/wiki/Count–min_sketch
