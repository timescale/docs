### Hypertables [](hypertables)
The primary point of interaction with your data is a hypertable,
the abstraction of a single continuous table across all space and time
intervals, such that one can query it via standard SQL.

Virtually all user interactions with TimescaleDB are with hypertables. Creating
tables and indexes, altering tables, inserting data, selecting data, etc. can
(and should) all be executed on the hypertable. [[Jump to basic SQL operations][jumpSQL]]

A hypertable is defined by a standard schema with column names and
types, with at least one column specifying a time value, and
one (optional) column specifying an additional partitioning key.

<highlight type="tip">
See our [data model][] for a further discussion of various
ways to organize data, depending on your use cases;
the simplest and most natural is in a "wide-table" like many
relational databases.
</highlight>

A single TimescaleDB deployment can store multiple hypertables, each
with different schemas.

Creating a hypertable in TimescaleDB takes two simple SQL
commands: `CREATE TABLE` (with standard SQL syntax),
followed by `SELECT create_hypertable()`.

Indexes on time and the partitioning key are automatically created on hypertables,
although additional indexes can also be created (and TimescaleDB supports the
full range of PostgreSQL index types).