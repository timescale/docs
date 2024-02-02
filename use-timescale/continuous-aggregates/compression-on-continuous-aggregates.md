---
title: Compress continuous aggregates
excerpt: How to compress a continuous aggregate
products: [cloud, mst, self_hosted]
keywords: [continuous aggregates, compression]
---

# Compress continuous aggregates

Continuous aggregates are often used to downsample historical data. If the data
is only used for analytical queries and never modified, you can compress the
aggregate to save on storage.

Compression on continuous aggregates works similarly to
[compression on hypertables][compression]. Compressed chunks can be queried, but
they can't be updated or deleted. For continuous aggregates, that means
compressed chunks can't be refreshed.

<Highlight type="warning">
You can't refresh the compressed regions of a continuous aggregate. To avoid
conflicts between compression and refresh, make sure you set `compress_after`
to a larger interval than the `start_offset` of your
[refresh policy](/api/latest/continuous-aggregates/add_continuous_aggregate_policy).
</Highlight>

## Enable compression on continuous aggregates

You can enable and disable compression on continuous aggregates by setting the
`compress` parameter when you alter the view.

<Procedure>

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

</Procedure>

Disabling compression on a continuous aggregate fails if there are compressed
chunks associated with the continuous aggregate. In this case, you need to
decompress the chunks, and then drop any compression policy on the continuous
aggregate, before you disable compression. For more detailed information, see
the [decompress chunks][decompress-chunks] section:

```sql
SELECT decompress_chunk(c, true) FROM show_chunks('cagg_name') c;
```

## Compression policies on continuous aggregates

Before setting up a compression policy on a continuous aggregate, you should set
up a [refresh policy][refresh-policy]. The compression policy interval should be
set so that actively refreshed regions are not compressed. This is to prevent
refresh policies from failing. For example, consider a refresh policy like this:

```sql
SELECT add_continuous_aggregate_policy('cagg_name',
  start_offset => INTERVAL '30 days',
  end_offset => INTERVAL '1 day',
  schedule_interval => INTERVAL '1 hour');
```

With this kind of refresh policy, the compression policy needs the
`compress_after` parameter greater than the `start_offset` parameter of the
continuous aggregate policy:

```sql
SELECT add_compression_policy('cagg_name', compress_after=>'45 days'::interval);
```

[compression]: /use-timescale/:currentVersion:/compression/
[decompress-chunks]:  /use-timescale/:currentVersion:/compression/decompress-chunks
[refresh-policy]: /use-timescale/:currentVersion:/continuous-aggregates/refresh-policies
