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

Override the [`now()`](https://www.postgresql.org/docs/16/functions-datetime.html) date/time function used to
set the current time in the integer `time` column in a hypertable. Many policies only apply to 
[chunks][hash-partitions] of a certain age. `integer_now_func` determines the age of each chunk.

The function you set as `integer_now_func` has no arguments. It must be either:
 
- `IMMUTABLE`: Use when you execute the query each time rather than prepare it prior to execution. The value 
  for `integer_now_func` is computed before the plan is generated. This generates a significantly smaller 
  plan, especially if you have a lot of chunks. 

- `STABLE`: `integer_now_func` is evaluated just before query execution starts. 
  [chunk pruning](https://www.timescale.com/blog/optimizing-queries-timescaledb-hypertables-with-partitions-postgresql-6366873a995d/) is executed at runtime. This generates a correct result, but may increase 
  planning time.


`set_integer_now_func` does not work on tables where the `time` column type is `TIMESTAMP`, `TIMESTAMPTZ`, or 
`DATE`.  

## Required arguments

|Name|Type| Description |
|-|-|-|
|`main_table`|REGCLASS| The hypertable `integer_now_func` is used in. |
|`integer_now_func`|REGPROC| A function that returns the current time set in each row in the `time` column in `main_table`.|

## Optional arguments

|Name|Type| Description|
|-|-|-|
|`replace_if_exists`|BOOLEAN| Set to `true` to override `integer_now_func` when you have previously set a custom function. Default is `false`. |

## Sample usage

Set the integer `now` function for a hypertable with a time column in [unix time](https://en.wikipedia.org/wiki/Unix_time).

- `IMMUTABLE`: when you execute the query each time: 
    ```sql
    CREATE OR REPLACE FUNCTION unix_now_immutable() returns BIGINT LANGUAGE SQL IMMUTABLE as $$ SELECT extract(epoch 
  from now())::BIGINT $$;
    
    SELECT set_integer_now_func('test_table_bigint', 'unix_now_immutable');
    ```

- `STABLE`: for prepared statements:
    ```sql
    CREATE OR REPLACE FUNCTION unix_now_stable() returns BIGINT: Can you supply an example please. 
    
    SELECT set_integer_now_func('test_table_bigint', 'unix_now_stable');
    ```

[hash-partitions]: /use-timescale/:currentVersion:/hypertables/about-hypertables/#hypertable-partitioning