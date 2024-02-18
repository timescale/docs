---
api_name: set_number_partitions()
excerpt: Set the number of hash partitions for a hypertable
topics: [distributed hypertables, hypertables]
keywords: [hypertables, partitions]
api:
  license: community
  type: function
---

# set_number_partitions() <Tag type="community">Community</Tag>

Sets the number of partitions (slices) of a space dimension on a
hypertable. The new partitioning only affects new chunks.

### Required arguments

| Name | Type | Description |
| --- | --- | --- |
| `hypertable`| REGCLASS | Hypertable to update the number of partitions for.|
| `number_partitions` | INTEGER  | The new number of partitions for the dimension. Must be greater than 0 and less than 32,768. |

### Optional arguments

| Name | Type | Description |
| --- | --- | --- |
| `dimension_name` | REGCLASS | The name of the space dimension to set the number of partitions for. |

The `dimension_name` needs to be explicitly specified only if the
hypertable has more than one space dimension. An error is thrown
otherwise.

### Sample usage

For a table with a single space dimension:

```sql
SELECT set_number_partitions('conditions', 2);
```

For a table with more than one space dimension:

```sql
SELECT set_number_partitions('conditions', 2, 'device_id');
```
