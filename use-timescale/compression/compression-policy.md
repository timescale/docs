---
title: Create a compression policy
excerpt: Create a compression policy on a hypertable
products: [cloud, mst, self_hosted]
keywords: [compression, hypertables, policy]
---

import CompressionIntro from 'versionContent/_partials/_compression-intro.mdx';

# Compression policy

You can enable compression on individual hypertables, by declaring which column
you want to segment by.

## Enable a compression policy

This procedure uses an example table, called `example`, and segments it by the
`device_id` column. Every chunk that is more than seven days old is then marked
to be automatically compressed. The source data is organized like this:

|time|device_id|cpu|disk_io|energy_consumption|
|-|-|-|-|-|
|8/22/2019 0:00|1|88.2|20|0.8|
|8/22/2019 0:05|2|300.5|30|0.9|

<Procedure>

### Enabling compression

1.  At the `psql` prompt, alter the table:

    ```sql
    ALTER TABLE example SET (
      timescaledb.compress,
      timescaledb.compress_segmentby = 'device_id'
    );
    ```

1.  Add a compression policy to compress chunks that are older than seven days:

    ```sql
    SELECT add_compression_policy('example', INTERVAL '7 days');
    ```

</Procedure>

For more information, see the API reference for
[`ALTER TABLE (compression)`][alter-table-compression] and
[`add_compression_policy`][add_compression_policy].

## View current compression policy

To view the compression policy that you've set:

```sql
SELECT * FROM timescaledb_information.jobs
  WHERE proc_name='policy_compression';
```

For more information, see the API reference for [`timescaledb_information.jobs`][timescaledb_information-jobs].

## Remove compression policy

To remove a compression policy, use `remove_compression_policy`. For example, to
remove a compression policy for a hypertable named `cpu`:

```sql
SELECT remove_compression_policy('cpu');
```

For more information, see the API reference for
[`remove_compression_policy`][remove_compression_policy].

## Disable compression

You can disable compression entirely on individual hypertables. This command
works only if you don't currently have any compressed chunks:

```sql
ALTER TABLE <TABLE_NAME> SET (timescaledb.compress=false);
```

If your hypertable contains compressed chunks, you need to
[decompress each chunk][decompress-chunks] individually before you can turn off
compression.

[alter-table-compression]: /api/:currentVersion:/compression/alter_table_compression/
[add_compression_policy]: /api/:currentVersion:/compression/add_compression_policy/
[decompress-chunks]: /use-timescale/:currentVersion:/compression/decompress-chunks
[remove_compression_policy]: /api/:currentVersion:/compression/remove_compression_policy/
[timescaledb_information-jobs]: /api/:currentVersion:/informational-views/jobs/
