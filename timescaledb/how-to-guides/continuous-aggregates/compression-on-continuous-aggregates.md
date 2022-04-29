# Compression on continuous aggregates
Continuous aggregates are often used to store downsampled historical data.
The historical data is almost never modified or recomputed and is only used 
for serving analytic queries. For this use case, it is often beneficial to 
store the materialized data in compressed form to save on storage costs. 
You can get these cost savings by enabling compression on continuous 
aggregates.

<highlight type="warning">
Currently, TimescaleDB does not support refreshing compressed regions of a 
continuous aggregate. To do this, you have to manually decompress 
the compressed chunk and then execute a [`refresh_continuous_aggregate`](/api/latest/continuous-aggregates/refresh_continuous_aggregate) call.
</highlight>

## Enable compression on continuous aggregates
You can enable and disable compression on continuous aggregated by setting the
`compress` parameter when you alter the view.

<procedure>

### Enabling and disabling compression on continuous aggregates
1.  For an existing continuous aggregate, at the `psql` prompt, enable
 compression:
    ```sql
    ALTER MATERIALIZED VIEW cagg_name set (timescaledb.compress = true);
    ```
1.  Disable compression:
    ```sql
    ALTER MATERIALIZED VIEW cagg_name set (timescaledb.compress = false);
    ```

</procedure>

Disabling compression on a continuous aggregate fails if there are 
compressed chunks associated with the continuous aggregate. In this case, you 
need to decompress the chunks, and then drop any compression policy on the 
continuous aggregate, before you disable compression. For more detailed information, see the
[decompress chunks] [decompress-chunks] section:

```sql
SELECT decompress_chunk(c, true) FROM show_chunks('cagg_name') c;
```

## Compression policies on continuous aggregates
Before  setting up a compression policy on a continuous aggregate, you should
set up a [refresh policy][refresh-policy]. The compression policy interval should be set so that
actively refreshed regions are not compressed. This is to prevent refresh
policies from failing. For example, consider a refresh policy like this:

```sql
SELECT add_continuous_aggregate_policy('cagg_name',
  start_offset => INTERVAL '30 days',
  end_offset => INTERVAL '1 day',
  schedule_interval => INTERVAL '1 hour');
```

With this kind of refresh policy, the compression policy needs the `compress_after` 
parameter greater than the `refresh_start` parameter of the continuous aggregate policy:

```sql
SELECT add_compression_policy('cagg_name', compress_after=>'45 days'::interval);
```

After a chunk is compressed, manual refresh calls that attempt to refresh the 
continuous aggregate's compressed region will fail with an error like this:

```sql
CALL refresh_continuous_aggregate('cagg_name', NULL, now() - '30 days'::interval );
ERROR:  cannot update/delete rows from chunk "_hyper_3_3_chunk" as it is compressed
```

[decompress-chunks]:  /how-to-guides/compression/decompress-chunks 
[refresh-policy]: /how-to-guides/continuous-aggregates/refresh-policies
