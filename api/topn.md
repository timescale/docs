---
api_name: topn()
excerpt: Calculate the top N most common values from data in a frequency or top N aggregate
license: community
toolkit: true
experimental: true
topic: hyperfunctions
tags: [hyperfunctions, most common, frequency, frequency aggregates, top N]
api_category: hyperfunction
api_experimental: true
hyperfunction_toolkit: true
hyperfunction_family: 'frequency analysis'
hyperfunction_subfamily: SpaceSavingAggregate
hyperfunction_type: accessor
---

# topn()  <tag type="toolkit">Toolkit</tag><tag type="experimental">Experimental</tag>
Returns the most common values accumulated in a [frequency aggregate][freq_agg]
or [top N aggregate][topn_agg].
```sql
topn (
    agg FrequencyAggregate,
    n INTEGER
) RETURNS topn AnyElement
```
```sql
topn (
    agg TopnAggregate,
    n INTEGER
) RETURNS topn AnyElement
```

Both frequency aggregates and top N aggregates can be used to calculate `topn`.
Top N aggregates allow you to specify the target number of values you want
returned, without estimating their threshold frequency. Frequency aggregates
allow you to store all values that surpass a threshold frequency. They are
useful if you want to store and use frequency information, and not just
calculate top N.

<highlight type="warning">
Experimental features could have bugs. They might not be backwards compatible,
and could be removed in future releases. Use these features at your own risk, and
do not use any experimental features in production.
</highlight>

## Required arguments

|Name|Type|Description|
|-|-|-|
|`agg`|`FrequencyAggregate` or `TopnAggregate`|The aggregate to display values for|
|`n`|`INTEGER`|The number of values to return. Required only for frequency aggregates. For top N aggregates, defaults to target `n` of the aggregate itself|

## Optional arguments

|Name|Type|Description|
|-|-|-|
|`n`|`INTEGER`|The number of values to return. Optional only for top N aggregates, where it must be less than the target `n` of the aggregate itself. Defaults to the target `n` of the aggregate.|

## Returns

|Column|Type|Description|
|-|-|-|
|`topn`|`AnyElement`|The `n` most-frequent values in the aggregate.|

In some cases, the function might return fewer than `n` values. This happens if:
* The underlying frequency aggregate doesn't contain `n` elements with the
  minimum frequency
* The data isn't skewed enough to support `n` values from a top N aggregate

<highlight type="warning">
Requesting more values from a top N aggregate than it was created for will return an
error. To get more values, adjust the target `n` in
[`topn_agg`](/api/latest/hyperfunctions/frequency-analysis/topn_agg).
</highlight>

## Sample usage
This test uses a table of randomly generated data. The values used are the 
integer square roots of a random number in the range (0,400).
```sql
CREATE TABLE value_test(value INTEGER);
INSERT INTO value_test SELECT floor(sqrt(random() * 400)) FROM generate_series(1,100000);
```

This returns the 5 most common values seen in the table:
```sql
SELECT toolkit_experimental.topn(
    toolkit_experimental.freq_agg(0.05, value), 
    5) 
FROM value_test;
```

The output for this query:
```sql
 topn 
------
   19
   18
   17
   16
   15
```

[freq_agg]: /hyperfunctions/frequency-analysis/freq_agg/
[topn_agg]: /hyperfunctions/frequency-analysis/topn_agg/
