---
title: Schema modifications
excerpt: Modify the schema of compressed hypertables
products: [cloud, mst, self_hosted]
keywords: [compression, schemas, hypertables]
---

# Schema modifications

You can modify the schema of compressed hypertables in recent versions of
Timescale.

|Schema modification|Before TimescaleDB&nbsp;2.1|TimescaleDB&nbsp;2.1 to 2.5|TimescaleDB&nbsp;2.6 and above|
|-|-|-|-|
|Add a nullable column|❌|✅|✅|
|Add a column with a default value and a `NOT NULL` constraint|❌|❌|✅|
|Rename a column|❌|✅|✅|
|Drop a column|❌|❌|✅|
|Change the data type of a column|❌|❌|❌|

To perform operations that aren't supported on compressed hypertables, first
[decompress][decompression] the table.

## Add a nullable column

To add a nullable column:

```sql
ALTER TABLE <hypertable> ADD COLUMN <column_name> <datatype>;
```

For example:

```sql
ALTER TABLE conditions ADD COLUMN device_id integer;
```

Note that adding constraints to the new column is not supported before
TimescaleDB 2.6.

## Add a column with a default value and a NOT NULL constraint

To add a column with a default value and a not-null constraint:

```sql
ALTER TABLE <hypertable> ADD COLUMN <column_name> <datatype>
    NOT NULL DEFAULT <default_value>;
```

For example:

```sql
ALTER TABLE conditions ADD COLUMN device_id integer
    NOT NULL DEFAULT 1;
```

## Rename a column

To rename a column:

```sql
ALTER TABLE <hypertable> RENAME <column_name> TO <new_name>;
```

For example:

```sql
ALTER TABLE conditions RENAME device_id TO devid;
```

## Drop a column

You can drop a column from a compressed hypertable, if the column is not an
`orderby` or `segmentby` column. To drop a column:

```sql
ALTER TABLE <hypertable> DROP COLUMN <column_name>;
```

For example:

```sql
ALTER TABLE conditions DROP COLUMN temperature;
```

[decompression]: /use-timescale/:currentVersion:/compression/decompress-chunks
