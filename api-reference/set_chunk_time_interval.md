## set_chunk_time_interval() 
Sets the chunk_time_interval on a hypertable. The new interval is used
when new chunks are created but the time intervals on existing chunks are
not affected.

#### Required Arguments 

|Name|Description|
|---|---|
| `hypertable` | (REGCLASS) Hypertable to update interval for.|
| `chunk_time_interval` | Interval in event time that each new chunk covers. Must be > 0.|

#### Optional Arguments 
| Name | Description |
|---|---|
| `dimension_name` | The name of the time dimension to set the number of partitions for.  Only used when hypertable has multiple time dimensions. |

The valid types for the `chunk_time_interval` depend on the type of
hypertable time column:

- **TIMESTAMP, TIMESTAMPTZ, DATE:** The specified
    `chunk_time_interval` should be given either as an INTERVAL type
    (`INTERVAL '1 day'`) or as an
    integer or bigint value (representing some number of microseconds).

- **INTEGER:** The specified `chunk_time_interval` should be an
    integer (smallint, int, bigint) value and represent the underlying
    semantics of the hypertable's time column, e.g., given in
    milliseconds if the time column is expressed in milliseconds
    (see `create_hypertable` [instructions](#create_hypertable)).

#### Sample Usage 

For a TIMESTAMP column, set `chunk_time_interval` to 24 hours.
```sql
SELECT set_chunk_time_interval('conditions', INTERVAL '24 hours');
SELECT set_chunk_time_interval('conditions', 86400000000);
```

For a time column expressed as the number of milliseconds since the
UNIX epoch, set `chunk_time_interval` to 24 hours.
```sql
SELECT set_chunk_time_interval('conditions', 86400000);
```