## Create a $HYPERTABLE

$HYPERTABLE_CAPs are the core of $COMPANY. $HYPERTABLE_CAPs enable $COMPANY to work
efficiently with time-series data. Because $COMPANY is PostgreSQL, all the
standard PostgreSQL tables, indexes, stored procedures, and other objects can be
created alongside your $COMPANY $HYPERTABLEs. This makes creating and working
with $COMPANY tables similar to standard PostgreSQL.

<Procedure>

### Creating a $HYPERTABLE

1.  Create a standard PostgreSQL table to store the taxi trip data
    using `CREATE TABLE`:

    ```sql
    CREATE TABLE "rides"(
        vendor_id TEXT,
        pickup_datetime TIMESTAMP WITHOUT TIME ZONE NOT NULL,
        dropoff_datetime TIMESTAMP WITHOUT TIME ZONE NOT NULL,
        passenger_count NUMERIC,
        trip_distance NUMERIC,
        pickup_longitude  NUMERIC,
        pickup_latitude   NUMERIC,
        rate_code         INTEGER,
        dropoff_longitude NUMERIC,
        dropoff_latitude  NUMERIC,
        payment_type INTEGER,
        fare_amount NUMERIC,
        extra NUMERIC,
        mta_tax NUMERIC,
        tip_amount NUMERIC,
        tolls_amount NUMERIC,
        improvement_surcharge NUMERIC,
        total_amount NUMERIC
    );
    ```

1.  Convert the standard table into a $HYPERTABLE partitioned on the `time`
    column using the `create_hypertable()` function provided by $COMPANY. You
    must provide the name of the table and the column in that table that holds
    the timestamp data to use for partitioning:

    ```sql
    SELECT create_hypertable('rides', by_range('pickup_datetime'), create_default_indexes=>FALSE);
    SELECT add_dimension('rides', by_hash('payment_type', 2));
    ```

	<Highlight type="note">
	The `by_range` and `by_hash` dimension builder is an addition to $TIMESCALE_DB 2.13.
	</Highlight>

1.  Create an index to support efficient queries by vendor, rate code, and
    passenger count:

    ```sql
    CREATE INDEX ON rides (vendor_id, pickup_datetime DESC);
    CREATE INDEX ON rides (rate_code, pickup_datetime DESC);
    CREATE INDEX ON rides (passenger_count, pickup_datetime DESC);
    ```

</Procedure>

## Create standard PostgreSQL tables for relational data

When you have other relational data that enhances your time-series data, you can
create standard PostgreSQL tables just as you would normally. For this dataset,
there are two other tables of data, called `payment_types` and `rates`.

<Procedure>

### Creating standard PostgreSQL tables

1.  Add a table to store the payment types data:

    ```sql
    CREATE TABLE IF NOT EXISTS "payment_types"(
        payment_type INTEGER,
        description TEXT
    );
    INSERT INTO payment_types(payment_type, description) VALUES
    (1, 'credit card'),
    (2, 'cash'),
    (3, 'no charge'),
    (4, 'dispute'),
    (5, 'unknown'),
    (6, 'voided trip');
    ```

1.  Add a table to store the rates data:

    ```sql
    CREATE TABLE IF NOT EXISTS "rates"(
        rate_code   INTEGER,
        description TEXT
    );
    INSERT INTO rates(rate_code, description) VALUES
    (1, 'standard rate'),
    (2, 'JFK'),
    (3, 'Newark'),
    (4, 'Nassau or Westchester'),
    (5, 'negotiated fare'),
    (6, 'group ride');
    ```

</Procedure>

You can confirm that the scripts were successful by running the `\dt` command in
the `psql` command line. You should see this:

```sql
           List of relations
 Schema |     Name      | Type  |  Owner
--------+---------------+-------+----------
 public | payment_types | table | tsdbadmin
 public | rates         | table | tsdbadmin
 public | rides         | table | tsdbadmin
(3 rows)
```
