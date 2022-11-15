---
api_name: min_frequency() | max_frequency()
excerpt: Calculate the minimum or maximum estimated frequencies of a value from a frequency aggregate
topics: [hyperfunctions]
keywords: [frequency, hyperfunctions, toolkit]
tags: [minimum, maximum]
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

# min_frequency() and max_frequency() <tag type="toolkit" content="Toolkit" /><tag type="experimental" content="Experimental" />

Returns the minimum or maximum estimated frequencies of a value within a
dataset.

```sql
max_frequency (
    agg SpaceSavingAggregate,
    value AnyElement
) RETURNS DOUBLE PRECISION
```

`min_frequency` and `max_frequency` are accessors that operate on a
[frequency aggregate][freq_agg] or a [top N aggregate][topn_agg]. Create a
frequency or top N aggregate over the original dataset, then call
`min_frequency` and `max_frequency` on the aggregate.

## Required arguments

|Name|Type|Description|
|-|-|-|
|`agg`|`SpaceSavingAggregate`|The frequency or top N aggregate created over the original dataset|
|`value`|`AnyElement`|The value to find the frequency of|

## Returns

|Column|Type|Description|
|-|-|-|
|`min_freq` or `max_freq`|`DOUBLE PRECISION`|The minimum or maximum estimated frequency for the value|

<highlight type="note">
When you create a frequency aggregate, you set a threshold frequency. Values
that appear with lower-than-threshold frequency are not tracked. Calling
`min_frequency` or `max_frequency` with such values returns a frequency of `0`.
</highlight>

## Sample usage

Find the minimum frequency of the value `3` in a column named `value` within the
table `value_test`:

```sql
SELECT toolkit_experimental.min_frequency(
    (SELECT toolkit_experimental.freq_agg(0.05, value) FROM value_test),
    3
);
```

Find the maximum frequency of the value `foo` in a column named `value` within
the table `value_test`:

```sql
SELECT toolkit_experimental.max_frequency(
    (SELECT toolkit_experimental.freq_agg(0.05, value) FROM value_test),
    'foo'
);
```

[freq_agg]: /api/:currentVersion:/hyperfunctions/frequency-analysis/freq_agg/
[topn_agg]: /api/:currentVersion:/hyperfunctions/frequency-analysis/topn_agg/
