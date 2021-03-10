## Altering/updating table schemas [](updating-schemas)

TimescaleDB supports using the `ALTER TABLE` command to modify the schema of the
hypertable. A change to the hypertable schema results in changes to the schema of each
underlying chunk.

This change can be a potentially expensive operation if it requires a rewrite of
the underlying data.  However, a common modification is to add a field with a
default value of NULL (if no DEFAULT clause is specified, then the default will
be NULL); such a schema modification is inexpensive. More details can be found
in the Notes section of the [PostgreSQL documentation on ALTER TABLE][postgres-alter-table].