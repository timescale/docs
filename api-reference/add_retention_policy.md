## add_retention_policy() <tag type="community">Community</tag> 

Create a policy to drop chunks older than a given interval of a particular
hypertable or continuous aggregate on a schedule in the background. (See [drop_chunks](#drop_chunks)).
This implements a data retention policy and will remove data on a schedule. Only
one retention policy may exist per hypertable.

#### Required Arguments 

|Name|Description|
|---|---|
| `relation` | (REGCLASS) Name of the hypertable or continuous aggregate to create the policy for. |
| `drop_after` | (INTERVAL or INTEGER) Chunks fully older than this interval when the policy is run will be dropped|

The `drop_after` parameter should be specified differently depending on the 
type of the time column of the hypertable:
- For hypertables with TIMESTAMP, TIMESTAMPTZ, and DATE time columns: the time 
interval should be an INTERVAL type.
- For hypertables with integer-based timestamps: the time interval should be an 
integer type (this requires the [integer_now_func](#set_integer_now_func) to be set).

#### Optional Arguments 

|Name|Description|
|---|---|
| `if_not_exists` | (BOOLEAN) Set to true to avoid throwing an error if the drop_chunks_policy already exists. A notice is issued instead. Defaults to false. |

#### Returns 

|Column|Description|
|---|---|
|`job_id`| (INTEGER)  TimescaleDB background job id created to implement this policy|

#### Sample Usage 

Create a data retention policy to discard chunks greater than 6 months old:
```sql
SELECT add_retention_policy('conditions', INTERVAL '6 months');
```

Create a data retention policy with an integer-based time column: 
```sql
SELECT add_retention_policy('conditions', BIGINT '600000');
```