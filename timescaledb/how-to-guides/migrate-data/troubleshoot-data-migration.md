---
title: Troubleshooting data migration
excerpt: Troubleshoot common problems experienced with data migration
keywords: [migrate]
tags: [import]
---

# Troubleshooting data migration
This section contains some ideas for troubleshooting common problems experienced
with data migration.

## Problem creating hypertables, unique indexes, or primary keys
You might get the following error when creating a hypertable, or when adding a
unique index or primary key to a hypertable:
```
ERROR: cannot create a unique index without the column "<COLUMN_NAME>" (used in partitioning) 
```

To fix this problem, see the [hypertables and unique indexes][unique-indexes]
section.

[unique-indexes]: /timescaledb/:currentVersion:/how-to-guides/hypertables/hypertables-and-unique-indexes/
