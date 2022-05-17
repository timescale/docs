# Troubleshoot hypertables
This section contains some ideas for troubleshooting common problems experienced
with hypertables.

## Unique indexes and primary keys
You might get a unique index and partitioning column error in 2 situations:
*   When creating a primary key or unique index on a hypertable
*   When creating a hypertable from a table that already has a unique index or
    primary key

The error looks like this:
```
 ERROR: cannot create a unique index without the column "<COLUMN_NAME>" (used in partitioning) 
```

For more information on how to fix this problem, see the
[section on creating unique indexes on hypertables][unique-indexes].

[unique-indexes]: timescaledb/:currentVersion:/how-to-guides/hypertables/hypertables-and-unique-indexes/