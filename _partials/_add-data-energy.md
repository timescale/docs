## Load energy consumption data

When you have your database set up, you can load the energy consumption data
into the `metrics` hypertable.

<Procedure>

### Loading energy consumption  data

<Highlight type="important">
This is a large dataset, so it might take a long time, depending on your network
connection.
</Highlight>

1.  Download the dataset:

   <Tag type="download">
   [metrics.csv.gz](https://assets.timescale.com/docs/downloads/metrics.csv.gz)
   </Tag>

1.  Use your file manager to decompress the downloaded dataset, and take a note
    of the path to the `metrics.csv` file.

1.  At the psql prompt, copy the data from the `metrics.csv` file into
    your hypertable. Make sure you point to the correct path, if it is not in
    your current working directory:

    ```sql
    \COPY metrics FROM metrics.csv CSV;
    ```


   You can check that the data has been copied successfully with this command:

   ```sql
   SELECT * FROM metrics LIMIT 5;
   ```

   You should get five records that look like this:

   ```sql
            created            | type_id | value 
   -------------------------------+---------+-------
    2023-05-31 23:59:59.043264+00 |      13 |  1.78
    2023-05-31 23:59:59.042673+00 |       2 |   126
    2023-05-31 23:59:59.042667+00 |      11 |  1.79
    2023-05-31 23:59:59.042623+00 |      23 | 0.408
    2023-05-31 23:59:59.042603+00 |      12 |  0.96
   ```

</Procedure>

[parallel-copy]: https://github.com/timescale/timescaledb-parallel-copy
