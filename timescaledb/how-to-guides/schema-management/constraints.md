# Adding constraints

Hypertables support all standard PostgreSQL constraint types, with the
exception of foreign key constraints on other tables that reference
values in a hypertable. Creating, deleting, or altering constraints on
hypertables propagates to chunks, accounting also for any indexes
associated with the constraints. For instance, a table can be created
as follows:


```sql
CREATE TABLE conditions (
    time       TIMESTAMPTZ
    temp       FLOAT NOT NULL,
    device_id  INTEGER CHECK (device_id > 0),
    location   INTEGER REFERENCES locations (id),
    PRIMARY KEY(time, device_id)
);

SELECT create_hypertable('conditions', 'time');
```

This table only allows positive device IDs, non-null temperature
readings, and guarantees unique time values for each device. It
also references values in another `locations` table via a foreign key
constraint. Note that time columns used for partitioning do not allow
`NULL` values by default. TimescaleDB automatically adds a `NOT
NULL` constraint to such columns if missing.

For additional information on how to manage constraints, see the
[PostgreSQL docs][postgres-createconstraint].



[postgres-createconstraint]: https://www.postgresql.org/docs/current/static/ddl-constraints.html
