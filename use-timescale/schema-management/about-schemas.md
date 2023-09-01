---
title: Table management
excerpt: How to manage tables in Timescale
products: [cloud, mst, self_hosted]
keywords: [schemas, hypertables, indexes]
---

# Table management

A database schema defines how the tables and indexes in your database are
organized. Using a schema that is appropriate for your workload can result in
significant performance improvements. Conversely, using a poorly suited schema
can result in significant performance degradation.

If you are working with semi-structured data, such as readings from IoT sensors
that collect varying measurements, you might need a flexible schema. In this
case, you can use PostgreSQL JSON and JSONB data types.

Timescale supports all table objects supported within PostgreSQL, including
data types, indexes, and triggers. However, when you create a hypertable, set the
datatype for the `time` column as `timestamptz` and not `timestamp`. For more
information, see [PostgreSQL timestamp][postgresql-timestamp].

This section explains how to design your schema, how indexing and tablespaces
work, and how to use PostgreSQL constraint types. It also includes examples to
help you create your own schema, and learn how to use JSON and JSONB for
semi-structured data.

[postgresql-timestamp]: https://wiki.postgresql.org/wiki/Don't_Do_This#Don.27t_use_timestamp_.28without_time_zone.29
