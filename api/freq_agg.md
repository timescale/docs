---
api_name: freq_agg()
excerpt: Aggregate frequency data into a frequency aggregate for further analysis
topics: [hyperfunctions]
keywords: [frequency, aggregate, hyperfunctions, toolkit]
api:
  license: community
  type: function
  experimental: true
  toolkit: true
  version:
    experimental: 1.5.0
hyperfunction:
  family: frequency analysis
  type: aggregate
# fields below will be deprecated
api_category: hyperfunction
api_experimental: true
toolkit: true
hyperfunction_family: 'frequency analysis'
hyperfunction_subfamily: SpaceSavingAggregate
hyperfunction_type: aggregate
---

import Experimental from 'versionContent/_partials/_experimental.mdx';

# freq_agg()  <tag type="toolkit">Toolkit</tag><tag type="experimental-toolkit">Experimental</tag>

The `freq_agg` aggregate uses the [SpaceSaving][spacesaving-algorithm] algorithm
to estimate the most common elements of a set. This API takes a sizing parameter and
a PostgreSQL column, and returns a FreqAgg object that can be passed to
[other freq_agg APIs][frequency-analysis].

<Experimental />

## Required arguments

|Name|Type|Description|
|-|-|-|
|`freq`|`DOUBLE PRECISION`|Minimum frequency (0.0-1.0) needed to keep track of a value|
|`value`|`AnyElement`|Column to aggregate|

## Returns

|Column|Type|Description|
|-|-|-|
|`agg`|`SpaceSavingAggregate`|An object storing the most common elements of the given table and their estimated frequency.|

## Sample usage

This example creates frequency aggregate over a field `ZIP` in a `HomeSales`
table. This aggregate tracks any `ZIP` value that occurs in at least 5% of rows.

```sql
SELECT toolkit_experimental.freq_agg(0.05, ZIP) FROM HomeSales;
```

[spacesaving-algorithm]: https://www.cse.ust.hk/~raywong/comp5331/References/EfficientComputationOfFrequentAndTop-kElementsInDataStreams.pdf
[frequency-analysis]: /api/:currentVersion:/hyperfunctions/frequency-analysis/
