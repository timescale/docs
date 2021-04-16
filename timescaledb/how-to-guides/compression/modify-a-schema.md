# Schema modifications

As of TimescaleDB 2.1, we provide some ability to modify
the table definition for hypertables with compressed chunks. Users
can add nullable columns and rename existing columns.

## Add nullable columns

The following syntax is supported.

``` sql
ALTER TABLE <hypertable> ADD COLUMN <column_name> <datatype>;
```
Note that adding constraints to the new column is not supported.

Sample usage:
``` sql
ALTER TABLE conditions ADD COLUMN device_id integer;
```

## Rename columns

The following syntax is supported.

``` sql
ALTER TABLE <hypertable> RENAME <column_name> TO <new_name>;
```

Sample usage:
``` sql
ALTER TABLE conditions RENAME device_id TO devid;
```