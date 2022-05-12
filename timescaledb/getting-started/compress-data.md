# Compression policies

TimescaleDB includes native compression capabilities which enable you to
analyze and query massive amounts of historical time-series data inside a
database while also saving on storage costs. Additionally, all PostgreSQL data 
types can be used in compression.

Compressing time-series data in a hypertable is a two-step process. First, you 
need to enable compression on a hypertable by telling TimescaleDB how to compress 
and order the data as it is compressed. Once compression is enabled, the data can 
then be compressed in one of two ways:
1. Using an automatic policy
2. Manually compressing chunks


## Enable TimescaleDB compression on the hypertable

To enable compression, you need to [`ALTER` the `stocks_real_time` hypertable][alter-table-compression]. There
are three parameters you can specify when enabling compression:
* `timescaledb.compress` (required): enable TimescaleDB compression on the hypertable
* `timescaledb.compress_orderby` (optional): column(s) used to order compressed data
* `timescaledb.compress_segmentby` (optional): column(s) used to group compressed data

If you do not specify `compress_orderby` or `compress_segmentby` column(s), the compressed data is automatically ordered by the hypertable time column.

<procedure>

### Enabling compression on a hypertable
1. Use the following SQL to enable compression on the `stocks_real_time` hypertable:
  ```sql
  ALTER TABLE stocks_real_time SET (
  timescaledb.compress,
  timescaledb.compress_orderby = 'time DESC',
  timescaledb.compress_segmentby = 'symbol'
  );
  ```

  <highlight type="note">
  To learn more about the `segmentby` and `orderby` options for compression in TimescaleDB and how 
  to pick the right columns, see this detailed explanation in the [TimescaleDB compression docs](/timescaledb/latest/how-to-guides/compression/).
  </highlight>
1. View and verify the compression settings for your hypertables by using the
  `compression_settings` informational view, which returns information about each
  compression option and its `orderby` and `segmentby` attributes:
  ```sql
  -- See info about compression
  SELECT * FROM timescaledb_information.compression_settings;
  ```

  **Sample results:**
  ```bash
  hypertable_schema|hypertable_name |attname|segmentby_column_index|orderby_column_index|orderby_asc|orderby_nullsfirst|
  -----------------+----------------+-------+----------------------+--------------------+-----------+------------------+
  public           |stocks_real_time|symbol |                     1|                    |           |                  |
  public           |stocks_real_time|time   |                      |                   1|false      |true              |
  ```

</procedure>

## Automatic compression
When you have enabled compression, you can schedule a [policy to automatically compress][compress-automatic]
data according to the settings defined above. 

For example, if you want to compress data on your hypertable that is older than two weeks, run the following SQL:

```sql
SELECT add_compression_policy('stocks_real_time', INTERVAL '2 weeks');
```

Similar to the continuous aggregates policy and retention policies, when you run this SQL, all 
chunks that contain data that is at least two weeks old are compressed in `stocks_real_time`, 
and a recurring compression policy is created. 

It is important that you don't try to compress all your data. Although you can insert
new data into compressed chunks, compressed rows can't be updated or deleted. Therefore,
it is best to only compress data after it has aged, once data is less likely to require updating.  

Just like for automated policies for continuous aggregates, you can view information and statistics 
about your compression background job in these two information views:

Policy details:
```sql
SELECT * FROM timescaledb_information.jobs;
```

Policy job statistics:
```sql
SELECT * FROM timescaledb_information.job_stats;
```

## Manual Compression

While we recommend using compression policies to compress data automatically,
there might be situations where you need to [manually compress chunks][compress-manual]. 

Use this query to manually compress chunks that consist of data older than
2 weeks. If you manually compress hypertable chunks, consider adding `if_not_compressed=>true`
to the `compress_chunk()` function. Otherwise, you will receive an error when TimescaleDB
tries to compress a chunks that is already compressed.

```sql
SELECT compress_chunk(i, if_not_compressed=>true)
FROM show_chunks('stocks_real_time', older_than => INTERVAL ' 2 weeks') i;
```

## Verify your compression

You can check the overall compression rate of your hypertables using this query 
to view the size of your compressed chunks before and after applying compression:

```sql
SELECT pg_size_pretty(before_compression_total_bytes) as "before compression",
  pg_size_pretty(after_compression_total_bytes) as "after compression"
  FROM hypertable_compression_stats('stocks_real_time');
```

**Results:**
```bash
|before compression|after compression|
|------------------|-----------------|
|667 MB            |60 MB            |
```

## Next Steps
Your overview of TimescaleDB is almost complete. The last feature that we want to 
explore is [data retention][data-retention], which allows you to drop older raw data from a hypertable
quickly without deleting data from the precalculated continuous aggregate.
## Learn more about compression

For more information on how native compression in TimescaleDB works, as well as
the compression algorithms involved, see this in-depth blog post on the topic:
[Building columnar compression in a row-oriented database][columnar-compression].

For an introduction to compression algorithms, see this blog post: 
[Time-series compression algorithms, explained][compression-algorithms].

For more information, see the [compression docs][compression-docs].


[data-retention]: /getting-started/data-retention/
[columnar-compression]: https://blog.timescale.com/blog/building-columnar-compression-in-a-row-oriented-database/
[compression-algorithms]: https://blog.timescale.com/blog/time-series-compression-algorithms-explained/
[compression-docs]: /how-to-guides/compression
[alter-table-compression]:  /api/:currentVersion:/compression/alter_table_compression/
[compress-automatic]: /api/:currentVersion:/compression/add_compression_policy/
[compress-manual]: /api/:currentVersion:/compression/compress_chunk/