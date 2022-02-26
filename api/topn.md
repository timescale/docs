# topn()  <tag type="toolkit">Toolkit</tag><tag type="experimental">Experimental</tag>
This function returns the most common values accumulated in a 
[frequency aggregate][freq_agg]. Note that 
since the aggregate operates over `AnyElement` types, this method does require 
a type parameter to determine the type of the output.

<highlight type="warning">
Experimental features could have bugs. They might not be backwards compatible,
and could be removed in future releases. Use these features at your own risk, and
do not use any experimental features in production.
</highlight>

## Required arguments

|Name|Type|Description|
|-|-|-|
|`agg`|`FrequencyAggregate`|The aggregate to display the values for|
|`n`|`INTEGER`|The number of values to return|
|`ty`|`AnyElement`|A value matching the type to output from the aggregate|

## Returns

|Column|Type|Description|
|-|-|-|
|`topn`|`AnyElement`|The N most common elements seen in the aggregate.|

If fewer than `N` elements have been found with the minimum
frequency of the aggregate, this returns fewer than `N` values.

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
    5, 
    0::INTEGER) 
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

[freq_agg]: timescaledb/:currentVersion:/how-to-guides/hyperfunctions/frequency-analysis/freq_agg/
