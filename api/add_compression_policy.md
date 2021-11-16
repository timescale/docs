# add_compression_policy() <tag type="community" content="community" />
Allows you to set a policy by which the system compresses a chunk
automatically in the background after it reaches a given age.

Note that compression policies can only be created on hypertables that already
have compression enabled, e.g., via the [`ALTER TABLE`][compression_alter-table] command
to set `timescaledb.compress` and other configuration parameters.

### Required Arguments

|Name|Type|Description|
|---|---|---|
| `hypertable` |REGCLASS| Name of the hypertable|
| `compress_after` | INTERVAL or INTEGER | The age after which the policy job compresses chunks|

The `compress_after` parameter should be specified differently depending on the type of the time column of the hypertable:
- For hypertables with TIMESTAMP, TIMESTAMPTZ, and DATE time columns: the time interval should be an INTERVAL type.
- For hypertables with integer-based timestamps: the time interval should be an integer type (this requires
the [integer_now_func][set_integer_now_func] to be set).

### Optional Arguments

|Name|Type|Description|
|---|---|---|
| `if_not_exists` | BOOLEAN | Setting to true causes the command to fail with a warning instead of an error if a compression policy already exists on the hypertable. Defaults to false.|

### Sample Usage
Add a policy to compress chunks older than 60 days on the 'cpu' hypertable.

``` sql
SELECT add_compression_policy('cpu', INTERVAL '60d');
```

Add a compress chunks policy to a hypertable with an integer-based time column:

``` sql
SELECT add_compression_policy('table_with_bigint_time', BIGINT '600000');
```


[compression_alter-table]: /api/:currentVersion:/compression/alter_table_compression/
[set_integer_now_func]: /hypertable/set_integer_now_func
