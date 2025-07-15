---
title: Compare TimescaleDB editions
excerpt: See the difference between the TimescaleDB Community and TimescaleDB Apache 2 editions
products: [cloud, self_hosted]
keywords: [Apache, community, license]
tags: [learn, contribute]
---

import Deprecated2180 from "versionContent/_partials/_deprecated_2_18_0.mdx";
import Since2180 from "versionContent/_partials/_since_2_18_0.mdx";

# $TIMESCALE_DB editions

The following versions of $TIMESCALE_DB are available:

*   $TDB_APACHE
*   $TDB_COMMUNITY

## $TDB_APACHE

$TDB_APACHE is available under the [Apache 2.0 license][apache-license]. This is a classic open source license,
meaning that it is completely unrestricted - anyone can take this code and offer it as a service.

You can install $TDB_APACHE on your own on-premises or cloud
infrastructure and run it for free.

You can sell $TDB_APACHE as a service, even if you're not the
main contributor.

You can modify the $TDB_APACHE source code and run it for
production use.

## 	$TDB_COMMUNITY

$TDB_COMMUNITY is the advanced, best, and most feature complete 
version of $TIMESCALE_DB, available under the terms of the
[$COMPANY License (TSL)][timescale-license].

For more information about the $COMPANY license, see [this blog post][license-blog].

Many of the most recent features of $TIMESCALE_DB are only available in
$TDB_COMMUNITY.

You can install $TDB_COMMUNITY in your own on-premises or cloud
infrastructure and run it for free. $TDB_COMMUNITY is completely
free if you manage your own service.

You cannot sell $TDB_COMMUNITY as a service, even if you are the
main contributor.

You can modify the $TDB_COMMUNITY source code and run it for
production use. Developers using $TDB_COMMUNITY have the "right
to repair" and make modifications to the source code and run it in their own
on-premises or cloud infrastructure. However, you cannot make modifications to
the $TDB_COMMUNITY source code and offer it as a service.

You can access a hosted version of $TDB_COMMUNITY through
[$CLOUD_LONG][timescale-cloud], a cloud-native platform for time-series and real-time analytics.

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
    <td><a href="https://docs.timescale.com/api/latest/hypertable/create_table/">CREATE TABLE</a></td>
    <td>✅</td>
    <td>✅</td>
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
    <td><a href="https://docs.timescale.com/api/latest/hypertable/split_chunk/">split_chunk</a></td>
    <td>❌</td>
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
    <td><strong>Hypercore</strong>  <Since2180 /></td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hypercore/alter_table/">ALTER TABLE (Hypercore)</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hypercore/add_columnstore_policy/">add_columnstore_policy</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hypercore/remove_columnstore_policy/">remove_columnstore_policy</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hypercore/convert_to_columnstore/">convert_to_columnstore</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hypercore/convert_to_rowstore/">convert_to_rowstore</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hypercore/hypertable_columnstore_settings/">hypertable_columnstore_settings</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hypercore/hypertable_columnstore_stats/">hypertable_columnstore_stats</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hypercore/chunk_columnstore_settings/">chunk_columnstore_settings</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hypercore/chunk_columnstore_stats/">chunk_columnstore_stats</a></td>
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
    <td><strong>Jobs and automation</strong></td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/jobs-automation/add_job/">add_job</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/jobs-automation/alter_job/">alter_job</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/jobs-automation/delete_job/">delete_job</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/jobs-automation/run_job/">run_job</a></td>
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
    <td><a href="https://docs.tigerdata.com/api/latest/hyperfunctions/gapfilling/time_bucket_gapfill#locf">locf</a></td>
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
    <td><a href="https://docs.tigerdata.com/api/latest/hyperfunctions/time-weighted-calculations/time_weight#rollup">rollup</a></td>
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
  <tr>
    <td><strong>Compression</strong>  <Deprecated2180 /> replaced by Hypercore</td>
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
</table>

<!-- vale Google.Units = NO -->

[license-blog]: https://www.tigerdata.com/blog/how-we-are-building-a-self-sustaining-open-source-business-in-the-cloud-era
[mst]: /mst/:currentVersion:
[timescale-cloud]: /use-timescale/:currentVersion:/services/
[timescale-license]: https://github.com/timescale/timescaledb/blob/master/tsl/LICENSE-TIMESCALE
[apache-license]: https://github.com/timescale/timescaledb/blob/master/LICENSE-APACHE
