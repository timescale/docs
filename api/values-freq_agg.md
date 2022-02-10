# values()  <tag type="toolkit">Toolkit</tag><tag type="experimental">Experimental</tag>
This will return the data accumulated in a [frequency aggregate](hyperfunctions/frequency-analysis/freq_agg/).  Note that since the aggregate operates over `AnyElement` types, this method does require a type parameter to determine the type of the output.

This API is experimental and is subject to change without notice.

## Required arguments

|Name| Type |Description|
|-|-|-|
|`agg`|`FrequencyAggregate`|The aggregate to display the values for|
|`ty`|`AnyElement`|A value matching the type to output from the aggregate|

## Returns

|Column|Type|Description|
|-|-|-|
|`value`|`AnyElement`|One of the most common values in the data from which the aggregate was created|
|`min_freq`|`DOUBLE PRECISION`|The minimum frequency of the value in the originating data|
|`max_freq`|`DOUBLE PRECISION`|The maximum frequency of the value in the originating data|

## Sample usage
This test uses a table of randomly generated data.  The values here will be the integer square roots of random number in the range (0,400).

```sql
CREATE TABLE value_test(value INTEGER);
INSERT INTO value_test SELECT floor(sqrt(random() * 400)) FROM generate_series(1,100000);
```

The following will now return the values representing more than 5% of the input.

```sql
SELECT value, min_freq, max_freq
FROM toolkit_experimental.values(
    (SELECT toolkit_experimental.freq_agg(0.05, value) FROM value_test),
    0::INTEGER);
```

The output for this query (expect some small variation due to randomness if you try to reproduce this):
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
