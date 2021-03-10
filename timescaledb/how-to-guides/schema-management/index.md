# Table management

Designing proper table objects is a key part of using PostgreSQL. Creating the
appropriate indexes and table schema for a given workload can result in
significant performance improvements (and conversely, designing the wrong schema
can result in significant performance degradation).

TimescaleDB supports all table objects supported within PostgreSQL, including
data types, indexes, and triggers.

Note that sometimes it is useful to have a flexible schema, in particular when storing
semi-structured data (e.g., storing readings from IoT sensors collecting
varying measurements). For these cases, TimescaleDB also supports the
PostgreSQL JSON and JSONB datatypes.

In this section, we provide detailed examples and best practices of how to
create appropriate indexes, triggers, constraints, and tablespaces on your tables,
as well as how to appropriately utilize the JSON and JSONB datatypes.

<highlight type="tip">
One of the most common ways of getting information about various aspects
of your database is through `psql`, the interactive terminal.  See the
[PostgreSQL docs][psql-docs] for more information.
</highlight>
