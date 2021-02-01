## refresh_continuous_aggregate() <tag type="community">Community</tag> 

Refresh all buckets of a continuous aggregate between two points of
time. 

The function expects the parameter values to have the same time type
as used in the continuous aggregate's time bucket expression (e.g., if
the time bucket specifies in `timestamptz`, then the start and end time
supplied should also be `timestamptz`).

#### Required Arguments 

|Name|Description|
|---|---|
| `continuous_aggregate` | (REGCLASS) The continuous aggregate to refresh. |
| `window_start` | Start of the window to refresh, has to be before `window_end`. `NULL` is eqivalent to `MIN(timestamp)` of the hypertable. |
| `window_end` | End of the window to refresh, has to be after `window_start`. `NULL` is eqivalent to `MAX(timestamp)` of the hypertable. |

#### Sample Usage 

Refresh the continuous aggregate `conditions` between `2020-01-01` and
`2020-02-01` exclusive.

```sql
CALL refresh_continuous_aggregate('conditions', '2020-01-01', '2020-02-01');
```
