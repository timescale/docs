# Dropping raw data

Note that if any still-refreshing (more recent than `start_offset`) part of the
continuous aggregate is dropped via a [retention policy][api-add-retention-policy] or
direct [`drop_chunks`][api-drop-chunks] call, the aggregate will be updated to
reflect the loss of data. For this reason, if it is desired to retain the continuous
aggregate after dropping the underlying data, the `start_offset` of the aggregate
policy must be set to a smaller interval than the `drop_after` parameter of a
hypertable's retention policy. Similiarly, when calling `drop_chunks`, extra
care should also be taken to ensure that any such chunks are not within the
refresh window of a continuous aggregate that still needs the data.  More detail
and examples of this can be seen in the the [data retention documentation][data-retention-with-continuous-aggregates].

This is also a consideration when manually refreshing a continuous aggregate.
Calling `refresh_continuous_aggregate` on a region containing dropped chunks will
recalculate the aggregate without the dropped data. This can lead to undesirable
results, such as replacing previous aggregate data with NULL values, given that the
raw data has subsequently been dropped.



A continuous aggregate may be dropped by using the `DROP MATERIALIZED
VIEW` command. It does not affect the data in the hypertable from
which the continuous aggregate is derived (`conditions` in the example
above).

```sql
DROP MATERIALIZED VIEW conditions_summary_hourly;
```




[api-drop-chunks]: /api/:currentVersion:/hypertable/drop_chunks
[data-retention-with-continuous-aggregates]: /how-to-guides/data-retention-with-continuous-aggregates/
[api-add-retention-policy]: /api/:currentVersion:/data-retention/add_retention_policy
