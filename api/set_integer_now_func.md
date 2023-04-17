---
api_name: set_integer_now_fun()
excerpt: Define the relationship between integer time values and actual time
topics: [hypertables]
keywords: [hypertables]
tags: [integer time values]
api:
  license: apache
  type: function
---

# set_integer_now_func()

This function is only relevant for hypertables with integer (as opposed to
TIMESTAMP/TIMESTAMPTZ/DATE) time values. For such hypertables, it sets a
function that returns the `now()` value (current time) in the units of the time
column. This is necessary for running some policies on integer-based tables.
In particular, many policies only apply to chunks of a certain age and a
function that returns the current time is necessary to determine the age of a
chunk.

### Required arguments

|Name|Type|Description|
|-|-|-|
|`main_table`|REGCLASS|Hypertable to set the integer now function for|
|`integer_now_func`|REGPROC|A function that returns the current time value in the same units as the time column|

### Optional arguments

|Name|Type|Description|
|-|-|-|
|`replace_if_exists`|BOOLEAN|Whether to override the function if one is already set. Defaults to false.|

### Sample usage

To set the integer now function for a hypertable with a time column in unix
time (number of seconds since the unix epoch, UTC).

```
CREATE OR REPLACE FUNCTION unix_now() returns BIGINT LANGUAGE SQL IMMUTABLE as $$ SELECT extract(epoch from now())::BIGINT $$;

SELECT set_integer_now_func('test_table_bigint', 'unix_now');
```
