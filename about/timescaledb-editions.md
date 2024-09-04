---
title: Compare TimescaleDB editions
excerpt: Compare different editions of TimescaleDB
products: [cloud, mst, self_hosted]
keywords: [Apache, community, license]
tags: [learn, contribute]
---

# TimescaleDB Apache 2 and TimescaleDB Community Edition

There are two versions of TimescaleDB available:

*   TimescaleDB Apache 2 Edition
*   TimescaleDB Community Edition

The TimescaleDB Apache 2 Edition is the version of TimescaleDB that is available
under the [Apache 2.0 license][apache-license]. This is a classic open source license,
meaning that it is completely unrestricted - anyone can take this code and offer it
as a service.

## TimescaleDB Apache 2 Edition

You can install TimescaleDB Apache 2 Edition on your own on-premises or cloud
infrastructure and run it for free.

You can sell TimescaleDB Apache 2 Edition as a service, even if you're not the
main contributor.

You can modify the TimescaleDB Apache 2 Edition source code and run it for
production use.

## TimescaleDB Community Edition

TimescaleDB Community Edition is the advanced, best, and most feature complete
version of TimescaleDB, available under the terms of the
[Timescale License (TSL)][timescale-license].

For more information about the Timescale license, see [this blog post][license-blog].

Many of the most recent features of TimescaleDB are only available in
TimescaleDB Community Edition.

You can install TimescaleDB Community Edition in your own on-premises or cloud
infrastructure and run it for free. TimescaleDB Community Edition is completely
free if you manage your own service.

You cannot sell TimescaleDB Community Edition as a service, even if you are the
main contributor.

You can modify the TimescaleDB Community Edition source code and run it for
production use. Developers using TimescaleDB Community Edition have the "right
to repair" and make modifications to the source code and run it in their own
on-premises or cloud infrastructure. However, you cannot make modifications to
the TimescaleDB Community Edition source code and offer it as a service.

You can access a hosted version of TimescaleDB Community Edition through
[Timescale][timescale-cloud], which is a cloud-native platform for time-series.

## Feature comparison

<table>
  <tr>
    <th>Features</th>
    <th>TimescaleDB Apache 2 Edition</th>
    <th>TimescaleDB Community Edition</th>
  </tr>
  <tr>
    <td><strong>Hypertables and chunks</strong></td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hypertable/create_hypertable/">create_hypertable</a></td>
    <td>✅</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hypertable/show_chunks/">show_chunks</a></td>
    <td>✅</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hypertable/drop_chunks/">drop_chunks</a></td>
    <td>✅</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hypertable/reorder_chunk/">reorder_chunk</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hypertable/move_chunk/">move_chunk</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hypertable/add_reorder_policy/">add_reorder_policy</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hypertable/attach_tablespace/">attach_tablespace</a></td>
    <td>✅</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hypertable/detach_tablespace/">detach_tablespace()</a></td>
    <td>✅</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hypertable/detach_tablespaces/">detach_tablespaces()</a></td>
    <td>✅</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hypertable/show_tablespaces/">show_tablespaces</a></td>
    <td>✅</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hypertable/set_chunk_time_interval/">set_chunk_time_interval</a></td>
    <td>✅</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hypertable/set_integer_now_func/">set_integer_now_func</a></td>
    <td>✅</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hypertable/add_dimension/">add_dimension()</a></td>
    <td>✅</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hypertable/create_index/">create_index (Transaction Per Chunk)</a></td>
    <td>✅</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hypertable/hypertable_size/">hypertable_size</a></td>
    <td>✅</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hypertable/hypertable_detailed_size/">hypertable_detailed_size</a></td>
    <td>✅</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hypertable/hypertable_index_size/">hypertable_index_size</a></td>
    <td>✅</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hypertable/chunks_detailed_size/">chunks_detailed_size</a></td>
    <td>✅</td>
    <td>✅</td>
  </tr>
  <tr>
    <td colspan="3"><strong>Distributed hypertables</strong>: This feature is <a href="https://github.com/timescale/timescaledb/blob/2.14.0/docs/MultiNodeDeprecation.md">deprecated in all editions</a> after TimescaleDB v2.13.</td>
  </tr>

  <tr>
    <td><strong>Compression</strong></td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/compression/alter_table_compression/">ALTER TABLE (Compression)</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/compression/add_compression_policy/#sample-usage">add_compression_policy</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/compression/remove_compression_policy/">remove_compression_policy</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/compression/compress_chunk/">compress_chunk</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/compression/decompress_chunk/">decompress_chunk</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/compression/hypertable_compression_stats/">hypertable_compression_stats</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/compression/chunk_compression_stats/">chunk_compression_stats</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><strong>Continuous aggregates</strong></td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/continuous-aggregates/create_materialized_view/">CREATE MATERIALIZED VIEW (Continuous Aggregate)</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/continuous-aggregates/alter_materialized_view/">ALTER MATERIALIZED VIEW (Continuous Aggregate)</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/continuous-aggregates/drop_materialized_view/">DROP MATERIALIZED VIEW (Continuous Aggregate)</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/continuous-aggregates/add_continuous_aggregate_policy/">add_continuous_aggregate_policy()</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/continuous-aggregates/refresh_continuous_aggregate/">refresh_continuous_aggregate</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/continuous-aggregates/remove_continuous_aggregate_policy/">remove_continuous_aggregate_policy()</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><strong>Data retention</strong></td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/data-retention/add_retention_policy/">add_retention_policy</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/data-retention/remove_retention_policy/">remove_retention_policy</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><strong>Actions and automation</strong></td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/actions/add_job/">add_job</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/actions/alter_job/">alter_job</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/actions/delete_job/">delete_job</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/actions/run_job/">run_job</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><strong>Hyperfunctions</strong></td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hyperfunctions/approximate_row_count/">approximate_row_count</a></td>
    <td>✅</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hyperfunctions/first/">first</a></td>
    <td>✅</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hyperfunctions/last/">last</a></td>
    <td>✅</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hyperfunctions/histogram/">histogram</a></td>
    <td>✅</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hyperfunctions/time_bucket/">time_bucket</a></td>
    <td>✅</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hyperfunctions/time_bucket_ng/">time_bucket_ng (experimental feature)</a></td>
    <td>✅ </td>
    <td>✅ </td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hyperfunctions/gapfilling/time_bucket_gapfill/">time_bucket_gapfill</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hyperfunctions/gapfilling/time_bucket_gapfill#locf">locf</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hyperfunctions/gapfilling/time_bucket_gapfill#interpolate">interpolate</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hyperfunctions/percentile-approximation/uddsketch/#percentile-agg">percentile_agg</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hyperfunctions/percentile-approximation/uddsketch/#approx_percentile">approx_percentile</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hyperfunctions/percentile-approximation/uddsketch/#approx_percentile_rank">approx_percentile_rank</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hyperfunctions/percentile-approximation/uddsketch/#rollup">rollup</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hyperfunctions/percentile-approximation/tdigest/#max_val">max_val</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hyperfunctions/percentile-approximation/uddsketch/#mean">mean</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hyperfunctions/percentile-approximation/uddsketch/#error">error</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hyperfunctions/percentile-approximation/tdigest/#min_val">min_val</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hyperfunctions/percentile-approximation/uddsketch/#num_vals">num_vals</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hyperfunctions/percentile-approximation/uddsketch/#uddsketch">uddsketch</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hyperfunctions/percentile-approximation/tdigest/#tdigest">tdigest</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hyperfunctions/time-weighted-calculations/time_weight/">time_weight</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
   <tr>
    <td><a href="https://docs.timescale.com/api/latest/hyperfunctions/time-weighted-calculations/time_weight#rollup">rollup</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hyperfunctions/time-weighted-calculations/time_weight#average">average</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><strong>Informational Views</strong></td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/informational-views/chunks/#available-columns">timescaledb_information.chunks</a></td>
    <td>✅</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/informational-views/continuous_aggregates/#sample-usage">timescaledb_information.continuous_aggregates</a></td>
    <td>✅</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/informational-views/compression_settings/#sample-usage">timescaledb_information.compression_settings</a></td>
    <td>✅</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/informational-views/data_nodes/#sample-usage">timescaledb_information.data_nodes</a></td>
    <td>✅</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/informational-views/dimensions/#timescaledb-information-dimensions">timescaledb_information.dimension</a></td>
    <td>✅</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/informational-views/hypertables/">timescaledb_information.hypertables</a></td>
    <td>✅</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/informational-views/jobs/#available-columns">timescaledb_information.jobs</a></td>
    <td>✅</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/informational-views/job_stats/#available-columns">timescaledb_information.job_stats</a></td>
    <td>✅</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><strong>Administration functions</strong></td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/administration/#timescaledb_pre_restore">timescaledb_pre_restore</a></td>
    <td>✅</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/administration/#timescaledb_post_restore">timescaledb_post_restore</a></td>
    <td>✅</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/administration/#get_telemetry_report">get_telemetry_report</a></td>
    <td>✅</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/administration/#dump-timescaledb-meta-data">dump_meta_data</a></td>
    <td>✅</td>
    <td>✅</td>
  </tr>
</table>

{/* vale Google.Units = NO */}

[license-blog]: https://blog.timescale.com/blog/building-open-source-business-in-cloud-era-v2/
[mst]: /mst/:currentVersion:
[timescale-cloud]: /use-timescale/:currentVersion:/services/
[timescale-license]: https://github.com/timescale/timescaledb/blob/master/tsl/LICENSE-TIMESCALE
[apache-license]: https://github.com/timescale/timescaledb/blob/master/LICENSE-APACHE
