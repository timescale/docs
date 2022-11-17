---
api_name: stderror()
excerpt: Estimate the relative standard error of a hyperloglog
topics: [hyperfunctions]
keywords: [hyperloglog, hyperfunctions, Toolkit]
tags: [standard error, percentiles]
api:
  license: community
  type: function
  toolkit: true
  version:
    experimental: 0.1.0
    stable: 1.3.0
hyperfunction:
  family: approximate count distinct
  type: accessor
  aggregates:
    - approx_count_distinct()
    - hyperloglog()
---

# stderror()  <tag type="toolkit">Toolkit</tag>

The `stderror` function returns an estimate of the relative standard error of the hyperloglog, based on the hyperloglog error formula. Approximate results are:

|precision|registers (bucket size)|error|bytes|
|-|-|-|-|
|4|16|0.2600|12|
|5|32|0.1838|24|
|6|64|0.1300|48|
|7|128|0.0919|96|
|8|256|0.0650|192|
|9|512|0.0460|384|
|10|1024|0.0325|768|
|11|2048|0.0230|1536|
|12|4096|0.0163|3072|
|13|8192|0.0115|6144|
|14|16384|0.0081|12288|
|15|32768|0.0057|24576|
|16|65536|0.0041|49152|
|17|131072|0.0029|98304|
|18|262144|0.0020|196608|

For more information about approximate count distinct functions, see the
[hyperfunctions documentation][hyperfunctions-approx-count-distincts].

## Required arguments

|Name|Type|Description|
|-|-|-|
|hyperloglog|Hyperloglog|The hyperloglog to extract the count from.|

## Returns

|Column|Type|Description|
|-|-|-|
|stderror|BIGINT|The number of distinct elements counted by the hyperloglog.|

<!---Any special notes about the returns-->

## Sample usage

This examples retrieves the standard error from a hyperloglog called `hyperloglog`:

``` sql
SELECT stderror(hyperloglog(32768, data))
FROM generate_series(1, 100000) data

       stderror       
----------------------
 0.005745242597140698

```

[hyperfunctions-approx-count-distincts]: /timescaledb/:currentVersion:/how-to-guides/hyperfunctions/approx-count-distincts/
