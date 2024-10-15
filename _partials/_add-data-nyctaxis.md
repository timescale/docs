## Load trip data

When you have your database set up, you can load the taxi trip data into the
`rides` hypertable.

<Procedure>

### Loading trip data

<Highlight type="important">
This is a large dataset, so it might take a long time, depending on your network
connection.
</Highlight>

1.  Download the dataset:

   <Tag type="download">
   [nyc_data.tar.gz](https://assets.timescale.com/docs/downloads/nyc_data.tar.gz)
   </Tag>

1.  Use your file manager to decompress the downloaded dataset, and take a note
    of the path to the `nyc_data_rides.csv` file.

1.  At the psql prompt, copy the data from the `nyc_data_rides.csv` file into
    your $HYPERTABLE. Make sure you point to the correct path, if it is not in
    your current working directory:

    ```sql
    \COPY rides FROM nyc_data_rides.csv CSV;
    ```

</Procedure>

You can check that the data has been copied successfully with this command:

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

[parallel-copy]: https://github.com/timescale/timescaledb-parallel-copy
