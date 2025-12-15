import CreateHypertablePolicyNote from "versionContent/_partials/_create-hypertable-columnstore-policy-note.mdx";
import HypertableIntro from "versionContent/_partials/_tutorials_hypertable_intro.mdx";

<HypertableIntro />

<Procedure>

1.  **Import time-series data into a $HYPERTABLE**

    1. Unzip <Tag type="download">[metrics.csv.gz](https://assets.timescale.com/docs/downloads/metrics.csv.gz)</Tag> to a `<local folder>`.
       
       This test dataset contains energy consumption data.

       To import up to 100GB of data directly from your current $PG based database,
       [migrate with downtime][migrate-with-downtime] using native $PG tooling. To seamlessly import 100GB-10TB+
       of data, use the [live migration][migrate-live] tooling supplied by $COMPANY. To add data from non-$PG
       data sources, see [Import and ingest data][data-ingest].

    1. In Terminal, navigate to `<local folder>` and update the following string with [your connection details][connection-info] 
      to connect to your $SERVICE_SHORT.
       
       ```bash
       psql -d "postgres://<username>:<password>@<host>:<port>/<database-name>?sslmode=require"
       ```

    1. Create an optimized $HYPERTABLE for your time-series data:

       1. Create a [$HYPERTABLE][hypertables-section] with [$HYPERCORE][hypercore] enabled by default for your
          time-series data using [CREATE TABLE][hypertable-create-table]. For [efficient queries][secondary-indexes]
          on data in the columnstore, remember to `segmentby` the column you will use most often to filter your data.

          In your sql client, run the following command:

             ```sql
             CREATE TABLE "metrics"(
               created timestamp with time zone default now() not null,
               type_id integer                                not null,
               value   double precision                       not null
             ) WITH (
               tsdb.hypertable,
               tsdb.segmentby = 'type_id',
               tsdb.orderby = 'created DESC'
             );
             ```
             <CreateHypertablePolicyNote />
   
      1. Upload the dataset to your $SERVICE_SHORT
         ```sql
         \COPY metrics FROM metrics.csv CSV;
         ```

1.  **Have a quick look at your data**

    You query $HYPERTABLEs in exactly the same way as you would a relational $PG table.
    Use one of the following SQL editors to run a query and see the data you uploaded:
       - **Data mode**:  write queries, visualize data, and share your results in [$CONSOLE][portal-data-mode] for all your $SERVICE_LONGs.
       - **SQL editor**: write, fix, and organize SQL faster and more accurately in [$CONSOLE][services-portal] for a $SERVICE_LONG.
       - **psql**: easily run queries on your $SERVICE_LONGs or $SELF_LONG deployment from Terminal.

    ```sql
    SELECT time_bucket('1 day', created, 'Europe/Berlin') AS "time",
    round((last(value, created) - first(value, created)) * 100.) / 100. AS value
    FROM metrics                                   
    WHERE type_id = 5
    GROUP BY 1;
    ```
    
    On this amount of data, this query on data in the rowstore takes about 3.6 seconds. You see something like:

    | Time	                        | value |
    |------------------------------|-------|
    | 2023-05-29 22:00:00+00 | 23.1  |
    | 2023-05-28 22:00:00+00 | 19.5  |
    | 2023-05-30 22:00:00+00 | 25    |
    | 2023-05-31 22:00:00+00 | 8.1   |
       
</Procedure>

[connection-info]: /integrations/:currentVersion:/find-connection-details/
[data-ingest]: /migrate/:currentVersion:/
[hypercore]: /use-timescale/:currentVersion:/hypercore/
[hypertable-create-table]: /api/:currentVersion:/hypertable/create_table/
[hypertables-section]: /use-timescale/:currentVersion:/hypertables/
[migrate-live]: /migrate/:currentVersion:/live-migration/
[migrate-with-downtime]: /migrate/:currentVersion:/pg-dump-and-restore/
[portal-data-mode]: https://console.cloud.timescale.com/dashboard/services?popsql
[secondary-indexes]: /use-timescale/:currentVersion:/hypercore/secondary-indexes/
[services-portal]: https://console.cloud.timescale.com/dashboard/services
