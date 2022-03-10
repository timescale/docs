# Troubleshooting for hypertables

## Unique indexes and primary keys

You can get a unique index and partitioning column error in two situations:
*   When creating a primary key or unique index on a hypertable
*   When creating a hypertable from a table that already has a unique index or
    primary key

The error looks like this:
```
 ERROR: cannot create a unique index without the column "<COLUMN_NAME>" (used in
partitioning) 
```

For more information on how to fix this problem, see the
[hypertables and unique indexes][unique-indexes] section.

[unique-indexes]: timescaledb/:currentVersion:/how-to-guides/hypertables/hypertables-and-unique-indexes/