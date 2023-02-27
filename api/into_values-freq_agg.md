---
api_name: into_values()
excerpt: Calculate all frequency estimates from a frequency aggregate or top N aggregate
topics: [hyperfunctions]
keywords: [frequency, top N, hyperfunctions, Toolkit]
api:
  license: community
  type: function
  experimental: true
  toolkit: true
  version:
    experimental: 1.6.0
hyperfunction:
  family: frequency analysis
  type: accessor
  aggregates:
    - freq_agg()
    - topn_agg()
---

import Experimental from 'versionContent/_partials/_experimental.mdx';

# into_values()  <Tag type="toolkit">Toolkit</Tag><Tag type="experimental-toolkit">Experimental</Tag>

This function returns the data accumulated in a
[frequency aggregate][freq_agg] or [top N aggregate][topn_agg].
The aggregate operates over `AnyElement` types, so this method
requires a type parameter to determine the type of the output.

<Experimental />

## Required arguments

|Name|Type|Description|
|-|-|-|
|`agg`|`FrequencyAggregate`|The aggregate to display the values for|

## Returns

|Column|Type|Description|
|-|-|-|
|`value`|`AnyElement`|One of the most common values in the data from which the aggregate was created|
|`min_freq`|`DOUBLE PRECISION`|The minimum frequency of the value in the originating data|
|`max_freq`|`DOUBLE PRECISION`|The maximum frequency of the value in the originating data|

## Sample usage

This test uses a table of randomly generated data. The values used are the integer
square roots of a random number in the range (0,400).

```sql
CREATE TABLE value_test(value INTEGER);
INSERT INTO value_test SELECT floor(sqrt(random() * 400)) FROM generate_series(1,100000);
```

This returns values representing more than 5% of the input:

```sql
SELECT value, min_freq, max_freq
FROM toolkit_experimental.into_values(
    (SELECT toolkit_experimental.freq_agg(0.05, value) FROM value_test));
```

The output for this query looks like this, with some variation due to randomness:

```sql
 value | min_freq | max_freq 
-------+----------+----------
    19 |  0.09815 |  0.09815
    18 |  0.09169 |  0.09169
    17 |  0.08804 |  0.08804
    16 |  0.08248 |  0.08248
    15 |  0.07703 |  0.07703
    14 |  0.07157 |  0.07157
    13 |  0.06746 |  0.06746
    12 |  0.06378 |  0.06378
    11 |  0.05565 |  0.05595
    10 |  0.05286 |  0.05289
```

[freq_agg]: /api/:currentVersion:/hyperfunctions/frequency-analysis/freq_agg/
[topn_agg]: /api/:currentVersion:/hyperfunctions/frequency-analysis/topn_agg/
