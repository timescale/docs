---
title: About constraints
excerpt: Constraints are rules that apply to your table columns, preventing you from entering invalid data. Learn how constraints work for hypertables in Timescale Cloud
products: [cloud, mst, self_hosted]
keywords: [schemas, constraints]
---

import OldCreateHypertable from "versionContent/_partials/_old-api-create-hypertable.mdx";

# About constraints

Constraints are rules that apply to your database columns. This prevents you
from entering invalid data into your database. When you create, change, or
delete constraints on your hypertables, the constraints are propagated to the
underlying chunks, and to any indexes.

Hypertables support all standard PostgreSQL constraint types. For foreign keys in particular, the following is supported: 

- Foreign key constraints from a hypertable referencing a regular table
- Foreign key constraints from a regular table referencing a hypertable

Foreign keys from a hypertable referencing another hypertable **are not supported**.

For example, you can create a table that only allows positive device IDs, and
non-null temperature readings. You can also check that time values for all
devices are unique. To create this table, with the constraints, use this
command:

```sql
CREATE TABLE conditions (
    time       TIMESTAMPTZ
    temp       FLOAT NOT NULL,
    device_id  INTEGER CHECK (device_id > 0),
    location   INTEGER REFERENCES locations (id),
    PRIMARY KEY(time, device_id)
) WITH (
    tsdb.hypertable,
    tsdb.partition_column='time'
);
```

<OldCreateHypertable />

This example also references values in another `locations` table using a foreign
key constraint.

<Highlight type="note">

Time columns used for partitioning must not allow `NULL` values. A
`NOT NULL` constraint is added by default to these columns if it doesn't already exist.

</Highlight>

For more information on how to manage constraints, see the
[PostgreSQL docs][postgres-createconstraint].

[postgres-createconstraint]: https://www.postgresql.org/docs/current/ddl-constraints.html
