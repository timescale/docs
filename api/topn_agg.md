---
api_name: topn_agg()
excerpt: Aggregate data in a top N aggregate for further calculation of most frequent values
license: community
toolkit: true
experimental: true
topic: hyperfunctions
keywords: [frequency, top N, aggregate, hyperfunctions, toolkit]
api_category: hyperfunction
api_experimental: true
hyperfunction_toolkit: true
hyperfunction_family: 'frequency analysis'
hyperfunction_subfamily: SpaceSavingAggregate
hyperfunction_type: aggregate
---

import Experimental from 'versionContent/_partials/_experimental.mdx';

# topn_agg() <tag type="toolkit" content="Toolkit" /><tag type="experimental" content="Experimental" />
Produces an aggregate that can be passed to the [`topn` function][topn] to
calculate the `n` most-frequent values in a column.
```sql
topn_agg (
    n INTEGER,
    value AnyElement
) RETURNS SpaceSavingAggregate
```

<Experimental />

## Required arguments

|Name|Type|Description|
|-|-|-|
|`n`|`INTEGER`|The target number of most-frequent values|
|`value`|`AnyElement`|Column to aggregate|

## Optional arguments
|Name|Type|Description|
|-|-|-|
|`skew`|`DOUBLE PRECISION`|The estimated skew of the data, defined as the `s` parameter of a zeta distribution. Must be greater than `1.0`. Defaults to `1.1`.|

`topn_agg` assumes that the data is skewed. In other words, some values are more
frequent than others. The degree of skew is defined by the `s` parameter of a
[zeta distribution][zeta-distribution].

The default value of `1.1` works on data with the following, or a more extreme,
distribution:

|N|Minimum percentage of all values represented by the top N (approximate)|
|-|-|
|5|20%|
|10|25%|
|20|30%|
|50|36%|
|100|40%|

## Returns

|Column|Type|Description|
|-|-|-|
|`agg`|`SpaceSavingAggregate`|An object storing the most-frequent values of the given column and their estimated frequency.|

## Sample usage
Create a topN aggregate over the `country` column of the `users` table. Targets
the top 10 most-frequent values:
```sql
CREATE toolkit_experimental.topn_agg(10, country) FROM users;
```

Create a topN aggregate over the `type` column of the `devices` table. Estimates
the skew of the data to be 1.05, and targets the 5 most-frequent values:
```sql
CREATE toolkit_experimental.topn_agg(5, 1.05, type) FROM devices;
```

Get the 20 most frequent `zip_code` values of the `employees` table. Uses
`topn_agg` as an intermediate step. `topn_agg` creates an aggregate for use in
the `topn` function:
```sql
SELECT topn(topn_agg(20, zip_code)) FROM employees;
```

[topn]: /api/:currentVersion:/hyperfunctions/frequency-analysis/topn/
[zeta-distribution]: https://en.wikipedia.org/wiki/Zeta_distribution
