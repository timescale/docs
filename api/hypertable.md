## Hypertables & Chunks

From a user's perspective, TimescaleDB exposes what look like singular tables,
called **hypertables**. A hypertable is the primary point of interaction
with your data, as it provides the standard table abstraction that you can query
via standard SQL.  [Creating a hypertable](/hypertable/create_hypertable) in TimescaleDB takes two 
SQL commands: `CREATE TABLE` (with standard SQL syntax),
followed by `SELECT create_hypertable()`.

Virtually all user interactions with TimescaleDB are with hypertables.
Inserting, updating, or deleting data, querying data via SELECTs, altering
tables, adding new columns or indexes, JOINs with other tables or hypertables,
and so forth can (and should) all be executed on the hypertable.

The true power of hypertables comes through an abstraction, or virtual view of
many individual tables that actually store the data, called **chunks**.

All of the following commands allow you to create and manage many aspects of how
your data is managed and queried in TimescaleDB.