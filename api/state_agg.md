# state_agg()  <tag type="toolkit">Toolkit</tag><tag type="experimental">Experimental</tag>
The state_agg aggregate measure the amount of time spent in each distinct value of a state field.  It is designed to work with a relatively small number of states and may struggle with queries where states are mostly distinct across rows.

This API is experimental and is subject to change without notice.

## Required arguments

|Name| Type |Description|
|-|-|-|
|`ts`|`TIMESTAMPTZ`|Column of timestamps|
|`value`|`TEXT`|Column of states|

## Returns

|Column|Type|Description|
|-|-|-|
|`stateagg`|`stateagg`|An object storing the total time spent in each state.|

## Sample usage
This example will create a state aggregate over a `status` column in a `devices` with a timestamp column `time`.

```sql
CREATE toolkit_experimental.state_agg(time, status) FROM devices;
```

