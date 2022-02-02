## Narrow-table model

Most time-series databases would represent this data in the following way:
- Represent each metric as a separate entity (e.g., represent `cpu_1m_avg`
  and `free_mem` as two different things)
- Store a sequence of "time", "value" pairs for that metric
- Represent the metadata values as a "tag-set" associated with that
metric/tag-set combination

In this model, each metric/tag-set combination is considered an individual
"time series" containing a sequence of time/value pairs.

Using our example above, this approach would result in 9 different "time
series," each of which is defined by a unique set of tags.
```
1. {name:  cpu_1m_avg,  device_id: abc123,  location_id: 335,  dev_type: field}
2. {name:  cpu_1m_avg,  device_id: def456,  location_id: 335,  dev_type: roof}
3. {name:  cpu_1m_avg,  device_id: ghi789,  location_id:  77,  dev_type: roof}
4. {name:    free_mem,  device_id: abc123,  location_id: 335,  dev_type: field}
5. {name:    free_mem,  device_id: def456,  location_id: 335,  dev_type: roof}
6. {name:    free_mem,  device_id: ghi789,  location_id:  77,  dev_type: roof}
7. {name: temperature,  device_id: abc123,  location_id: 335,  dev_type: field}
8. {name: temperature,  device_id: def456,  location_id: 335,  dev_type: roof}
9. {name: temperature,  device_id: ghi789,  location_id:  77,  dev_type: roof}
```
The number of such time series scales with the cross-product of the cardinality
of each tag, i.e., (# names) &times; (# device ids) &times; (# location ids)
&times; (device types). Some time-series databases struggle as cardinality
increases, ultimately limiting the number of device types and devices you can
store in a single database.

TimescaleDB supports narrow models and does not suffer from the same cardinality
limitations as other time-series databases do. A narrow model makes sense if you
collect each metric independently. It allows you to add new metrics as you go by
adding a new tag without requiring a formal schema change.

However, a narrow model is not as performant if you are collecting many metrics
with the same timestamp, since it requires writing a timestamp for each metric.
This ultimately results in higher storage and ingest requirements. Further,
queries that correlate different metrics are also more complex, since each
additional metric you want to correlate requires another JOIN. If you typically
query multiple metrics together, it is both faster and easier to store them in a
[wide table format][wide-table-format].

[wide-table-format]: /overview/data-model-flexibility/wide-data-model/
