# Compression policies

TimescaleDB comes with native compression capabilities, which enable you to
analyze and query massive amounts of historical time-series data inside a
database while also saving on storage costs. Additionally, all PostgreSQL data 
types can be used in compression.

In the next step, you enable compression on your hypertable and learn 
two ways of compressing data: 
1. Using an automatic policy
2. Manually compressing chunks

But, before you can start compressing data, you need to enable compression
on the `stocks_real_time` hypertable. 

## Enable TimescaleDB compression on the hypertable

To enable compression, you need to [`ALTER` the `stocks_real_time` hypertable][alter-table-compression]. There
are three parameters you can specify when enabling compression:
* `timescaledb.compress` (required): this turns on compression
* `timescaledb.compress_orderby` (optional): this uses the specified column to order 
compression by
* `timescaledb.compress_segmentby` (optional): this uses the specified column to key 
compressed segments by

```sql
-- Enable compression
ALTER TABLE stocks_real_time SET (
 timescaledb.compress,
 timescaledb.compress_orderby = 'time DESC'
 timescaledb.compress_segmentby = 'symbol'
);
```

Once running this code, you enable compression on `stocks_real_time`.

<highlight type="note">
 To learn more about the `segmentby` and `orderby` options for compression in TimescaleDB and how 
 to pick the right columns, see this detailed explanation in the [TimescaleDB compression docs](https://docs.timescale.com/::currentVersion/hot-to-guides/compression/).
</highlight>

You can view the compression settings for your hypertables by using the
`compression_settings` informational view, which returns information about each
compression option and its `orderby` and `segmentby` attributes:

```sql
-- See info about compression
SELECT * FROM timescaledb_information.compression_settings;
```

## Automatic compression
When you have enabled compression, you can schedule a [policy to automatically compress][compress-automatic]
data according to the settings defined above. 

For example, if you want to compress data on your hypertable that has existed more than a month
in the past, you could use this code:

```sql
SELECT add_compression_policy('stocks_real_time', INTERVAL '1 month');
```

Similar to the continuous aggregates policy and retention policies, when you run this code, all data 
from one month prior is compressed in `stocks_real_time`, and a recurring compression
policy is created. 

It is important that you don't try to compress all your data. It is best to 
only compress data when it has aged, which is why the examples here 
compress data older than one month. You can't updated a compressed 
chunk, and this could block the addition or removal of data. Since you 
are likely to be adding data for more recent time periods, it is best only 
to compress data that is less likely to require updating. 

 <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/getting-started/continuous-aggregate-refresh-compression.jpg" alt="Continuous aggregate with refresh and compression policies"/>

Just like for automated policies for continuous aggregates, you can view information and statistics 
about your compression background job in these two information views:

```sql
-- Informational view for policy details
SELECT * FROM timescaledb_information.jobs;

-- Informational view for stats from run jobs
SELECT * FROM timescaledb_information.job_stats;
```

**Manual Compression**

While we recommend using compression policies to compress data automatically,
there might be situations where you need to [manually compress chunks][compress-manual]. 

Use this query to manually compress chunks that consist of data older than
1 month:

```sql
SELECT compress_chunk(i)
FROM show_chunks('stocks_real_time', older_than => INTERVAL ' 1 month') i;
```

## Learn more about compression

For more information on how native compression in TimescaleDB works, as well as
the compression algorithms involved, see this in depth blog post on the topic:
[Building columnar compression in a row-oriented database][columnar-compression].

For an introduction to compression algorithms, see this blog post: 
[Time-series compression algorithms, explained][compression-algorithms].

For more information, see the [compression docs][compression-docs].

[columnar-compression]: https://blog.timescale.com/blog/building-columnar-compression-in-a-row-oriented-database/
[compression-algorithms]: https://blog.timescale.com/blog/time-series-compression-algorithms-explained/
[compression-docs]: /how-to-guides/compression
[alter-table-compression]:  /api/:currentVersion:/compression/alter_table_compression/
[compress-automatic]: /api/:currentVersion:/compression/add_compression_policy/
[compress-manual]: /api/:currentVersion:/compression/compress_chunk/