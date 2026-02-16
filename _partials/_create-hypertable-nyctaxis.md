import CreateHypertablePolicyNote from "versionContent/_partials/_create-hypertable-columnstore-policy-note.mdx";


## Optimize time-series data in hypertables

Time-series data represents how a system, process, or behavior changes over time. [$HYPERTABLE_CAPs][hypertables-section]
are $PG tables that help you improve insert and query performance by automatically partitioning your data by
time. Each $HYPERTABLE is made up of child tables called chunks. Each chunk is assigned a range of time, and only
contains data from that range. 

$HYPERTABLE_CAPs exist alongside regular $PG tables. You interact with $HYPERTABLEs and regular $PG tables in the 
same way. You use regular $PG tables for relational data.

<Procedure>

1. **Create a $HYPERTABLE to store the taxi trip data**

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
    ) WITH (
       tsdb.hypertable,
       tsdb.create_default_indexes=false
    );
    ```
    <CreateHypertablePolicyNote />

1.  **Add another dimension to partition your $HYPERTABLE more efficiently**

    ```sql
    SELECT add_dimension('rides', by_hash('payment_type', 2));
    ```

1.  **Create an index to support efficient queries** 

    Index by vendor, rate code, and passenger count:
    ```sql
    CREATE INDEX ON rides (vendor_id, pickup_datetime DESC);
    CREATE INDEX ON rides (rate_code, pickup_datetime DESC);
    CREATE INDEX ON rides (passenger_count, pickup_datetime DESC);
    ```

</Procedure>

## Create standard $PG tables for relational data

When you have other relational data that enhances your time-series data, you can
create standard $PG tables just as you would normally. For this dataset,
there are two other tables of data, called `payment_types` and `rates`.

<Procedure>

1.  **Add a relational table to store the payment types data**

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

1. **Add a relational table to store the rates data**

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

[hypertables-section]: /use-timescale/:currentVersion:/hypertables/
