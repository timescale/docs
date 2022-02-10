# duration_in()  <tag type="toolkit">Toolkit</tag><tag type="experimental">Experimental</tag>
This function is used to report the total duration for a given state with in a [state aggregate](hyperfunctions/frequency-analysis/state_agg/).

This API is experimental and is subject to change without notice.

## Required arguments

|Name| Type |Description|
|-|-|-|
|`state`|`TEXT`|State to query|
|`aggregate`|`stateagg`|Previously created aggregate|

## Returns

|Column|Type|Description|
|-|-|-|
|`duration_in`|`BIGINT`|An object storing the total time in microseconds spent in the target state.|

## Sample usage
For this example we'll create a simple test table:

```sql
SET timezone TO 'UTC';
CREATE TABLE states(time TIMESTAMPTZ, state TEXT);
INSERT INTO states VALUES
  ('1-1-2020 10:00', 'starting'),
  ('1-1-2020 10:30', 'running'),
  ('1-3-2020 16:00', 'error'),
  ('1-3-2020 18:30', 'starting'),
  ('1-3-2020 19:30', 'running'),
  ('1-5-2020 12:00', 'stopping');
```

Here is how we can query this table for the time spent in the running state:
```sql
SELECT toolkit_experimental.duration_in('running', toolkit_experimental.state_agg(time, state)) FROM states;
```

Which gives the result:
```sql
 duration_in  
--------------
 338400000000
```
