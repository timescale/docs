## set_number_partitions() <tag type="community">Community</tag>

Sets the number of partitions (slices) of a space dimension on a
hypertable. The new partitioning only affects new chunks.

### Required Arguments

| Name                | Type     | Description                                                                                  |
| ------------------- | -------- | -------------------------------------------------------------------------------------------- |
| `hypertable`        | REGCLASS | Hypertable to update the number of partitions for.                                           |
| `number_partitions` | INTEGER  | The new number of partitions for the dimension. Must be greater than 0 and less than 32,768. |

### Optional Arguments

| Name             | Type     | Description                                                          |
| ---------------- | -------- | -------------------------------------------------------------------- |
| `dimension_name` | REGCLASS | The name of the space dimension to set the number of partitions for. |

The `dimension_name` needs to be explicitly specified only if the
hypertable has more than one space dimension. An error will be thrown
otherwise.

### Sample Usage

For a table with a single space dimension:

```sql
SELECT set_number_partitions('conditions', 2);
```

For a table with more than one space dimension:

```sql
SELECT set_number_partitions('conditions', 2, 'device_id');
```
