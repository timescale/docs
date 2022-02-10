# freq_agg()  <tag type="toolkit">Toolkit</tag><tag type="experimental">Experimental</tag>
The freq_agg aggregate uses the [SpaceSaving][spacesaving-algorithm] algorithm to estimate the most common elements of a set.  This particular API takes a sizing parameter and a postgres column and returns a FreqAgg object that can be passed to [other freq_agg APIs][(hyperfunctions/frequency-analysis/).

This API is experimental and is subject to change without notice.

## Required arguments

|Name| Type |Description|
|-|-|-|
|`freq`|`DOUBLE PRECISION`|Minimum frequency (0.0-1.0) needed to keep track of a value|
|`value`|`AnyElement`|Column to aggregate|

## Returns

|Column|Type|Description|
|-|-|-|
|`frequencyaggregate`|`FrequencyAggregate`|An object storing the most common elements of the given table and their estimated frequency.|

## Sample usage
This example creates frequency aggregate over a field `ZIP` in a `HomeSales` table.  This aggregate will track any `ZIP` value that occurs in at least 5% of rows.

```sql
CREATE toolkit_experimental.freq_agg(0.05, ZIP) FROM HomeSales;
```


[spacesaving-algorithm]: https://www.cse.ust.hk/~raywong/comp5331/References/EfficientComputationOfFrequentAndTop-kElementsInDataStreams.pdf
[frequency-analysis]: timescaledb/:currentVersion:/how-to-guides/hyperfunctions/function-pipelines/#timevectors
