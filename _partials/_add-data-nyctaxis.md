## Load trip data

When you have your database set up, you can load the taxi trip data into the
`rides` hypertable.

<procedure>

### Loading trip data

<highlight type="important">
This is a large dataset, so it might take a long time, depending on your network
connection.
</highlight>

1.  Download the dataset:

   <tag type="download">
   [nyc_data.tar.gz](https://timescaledata.blob.core.windows.net/datasets/nyc_data.tar.gz)
   </tag>

1.  At the psql prompt, copy the data into your hypertable:

    ```sql
    \COPY rides FROM nyc_data_rides.csv CSV;
    ```

1.  **OPTIONAL** If you want a faster copy, you can use the TimescaleDB
   [parallel COPY command][parallel-copy] instead:

    ```bash
    timescaledb-parallel-copy --connection {CONNECTION STRING} \
    --db-name {DATABASE NAME} --table rides \
    --file {PATH TO `nyc_data_rides.csv`} --workers 4 --truncate \
    --reporting-period 30s
    ```

1.  You can check that the copy was successful with this command:

    ```sql
    SELECT * FROM rides LIMIT 5;
    ```

    You should get five records that look like this:

    ```sql
    -[ RECORD 1 ]---------+--------------------
    vendor_id             | 1
    pickup_datetime       | 2016-01-01 00:00:01
    dropoff_datetime      | 2016-01-01 00:11:55
    passenger_count       | 1
    trip_distance         | 1.20
    pickup_longitude      | -73.979423522949219
    pickup_latitude       | 40.744613647460938
    rate_code             | 1
    dropoff_longitude     | -73.992034912109375
    dropoff_latitude      | 40.753944396972656
    payment_type          | 2
    fare_amount           | 9
    extra                 | 0.5
    mta_tax               | 0.5
    tip_amount            | 0
    tolls_amount          | 0
    improvement_surcharge | 0.3
    total_amount          | 10.3
    ```

</procedure>

[parallel-copy]: https://github.com/timescale/timescaledb-parallel-copy
