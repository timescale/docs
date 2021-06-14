# Schema modifications
In TimescaleDB 2.1 and later, you can modify the table definition for hypertables with compressed chunks by adding nullable columns, and renaming existing columns.

## Add nullable columns
To add a nullable column:
```sql
ALTER TABLE <hypertable> ADD COLUMN <column_name> <datatype>;
```
Note that adding constraints to the new column is not supported.

For example:
```sql
ALTER TABLE conditions ADD COLUMN device_id integer;
```

## Rename columns
To rename a column:
```sql
ALTER TABLE <hypertable> RENAME <column_name> TO <new_name>;
```

For example:
```sql
ALTER TABLE conditions RENAME device_id TO devid;
```
