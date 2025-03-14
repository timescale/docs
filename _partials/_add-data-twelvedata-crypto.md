## Load financial data

This tutorial uses real-time cryptocurrency data, also known as tick data, from
[Twelve Data][twelve-data]. To ingest data into the tables that you created, you need to 
download the dataset, then upload the data to your $SERVICE_LONG.

<Procedure>


1. Unzip <Tag type="download">[crypto_sample.zip](https://assets.timescale.com/docs/downloads/candlestick/crypto_sample.zip)</Tag> to a `<local folder>`.

   This test dataset contains second-by-second trade data for the most-traded crypto-assets
   and a regular table of asset symbols and company names.  

   To import up to 100GB of data directly from your current PostgreSQL based database, 
   [migrate with downtime][migrate-with-downtime] using native PostgreSQL tooling. To seamlessly import 100GB-10TB+ 
   of data, use the [live migration][migrate-live] tooling supplied by $COMPANY. To add data from non-PostgreSQL
   data sources, see [Import and ingest data][data-ingest].



1. In Terminal, navigate to `<local folder>` and connect to your $SERVICE_SHORT.
   ```bash
   psql -d "postgres://<username>:<password>@<host>:<port>/<database-name>"
   ```
   The connection information for a $SERVICE_SHORT is available in the file you downloaded when you created it.

1.  At the `psql` prompt, use the `COPY` command to transfer data into your
    Timescale instance. If the `.csv` files aren't in your current directory,
    specify the file paths in these commands:

    ```sql
    \COPY crypto_ticks FROM 'tutorial_sample_tick.csv' CSV HEADER;
    ```

    ```sql
    \COPY crypto_assets FROM 'tutorial_sample_assets.csv' CSV HEADER;
    ```

    Because there are millions of rows of data, the `COPY` process could take a
    few minutes depending on your internet connection and local client
    resources.

</Procedure>

[twelve-data]: https://twelvedata.com/
[migrate-with-downtime]: /migrate/:currentVersion:/pg-dump-and-restore/
[migrate-live]: /migrate/:currentVersion:/live-migration/
[data-ingest]: /use-timescale/:currentVersion:/ingest-data/
