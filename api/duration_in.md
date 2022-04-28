---
api_name: duration_in
api_category: hyperfunction
api_experimental: true
hyperfunction_toolkit: true
hyperfunction_family: 'frequency analysis'
hyperfunction_subfamily: StateAgg
hyperfunction_type: accessor
---

# duration_in()  <tag type="toolkit">Toolkit</tag><tag type="experimental">Experimental</tag>
Use this function to report the total duration for a given state in a [state aggregate][state_agg].

<highlight type="warning">
Experimental features could have bugs. They might not be backwards compatible,
and could be removed in future releases. Use these features at your own risk, and
do not use any experimental features in production.
</highlight>
## Required arguments

|Name|Type|Description|
|-|-|-|
|`state`|`TEXT`|State to query|
|`aggregate`|`stateagg`|Previously created aggregate|

## Returns

|Column|Type|Description|
|-|-|-|
|`duration_in`|`BIGINT`|An object storing the total time in microseconds spent in the target state.|

## Sample usage
This example creates a simple test table:
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

You can query this table for the time spent in the running state, like this:
```sql
SELECT toolkit_experimental.duration_in('running', toolkit_experimental.state_agg(time, state)) FROM states;
```

Which gives the result:
```sql
 duration_in  
--------------
 338400000000
```

[state_agg]: /hyperfunctions/frequency-analysis/state_agg/
