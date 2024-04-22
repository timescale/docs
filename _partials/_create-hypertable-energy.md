## Create a hypertable

Hypertables are the core of Timescale. Hypertables enable Timescale to work
efficiently with time-series data. Because Timescale is PostgreSQL, all the
standard PostgreSQL tables, indexes, stored procedures and other objects can be
created alongside your Timescale hypertables. This makes creating and working
with Timescale tables similar to standard PostgreSQL.

<Procedure>

### Creating a hypertable

1.  Create a standard PostgreSQL table to store the energy consumption data
    using `CREATE TABLE`:

    ```sql
    CREATE TABLE "metrics"(
        created timestamp with time zone default now() not null,
        type_id integer                                not null,
        value   double precision                       not null
    );
    ```

1.  Convert the standard table into a hypertable partitioned on the `time`
    column using the `create_hypertable()` function provided by Timescale. You
    must provide the name of the table and the column in that table that holds
    the timestamp data to use for partitioning:

    ```sql
    SELECT create_hypertable('metrics', by_range('created'));
    ```

	<Highlight type="note">
	The `by_range` dimension builder is an addition to TimescaleDB 2.13.
	</Highlight>

</Procedure>

