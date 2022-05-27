---
api_name: into_values
api_category: hyperfunction
api_experimental: true
hyperfunction_toolkit: true
hyperfunction_family: 'frequency analysis'
hyperfunction_subfamily: SpaceSavingAggregate
hyperfunction_type: accessor
---

# into_values()  <tag type="toolkit">Toolkit</tag><tag type="experimental">Experimental</tag>
This function returns the data accumulated in a
[frequency aggregate][freq_agg] or [top N aggregate][topn_agg].
The aggregate operates over `AnyElement` types, so this method
requires a type parameter to determine the type of the output.

<highlight type="warning">
Experimental features could have bugs. They might not be backwards compatible,
and could be removed in future releases. Use these features at your own risk, and
do not use any experimental features in production.
</highlight>

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

[freq_agg]: /hyperfunctions/frequency-analysis/freq_agg/
[topn_agg]: /hyperfunctions/frequency-analysis/topn_agg/
