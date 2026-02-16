---
title: Compare TimescaleDB editions
excerpt: See the difference between the TimescaleDB Community and TimescaleDB Apache 2 editions
products: [cloud, self_hosted, mst]
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
[$CLOUD_LONG][cloud], a cloud-native platform for time-series and real-time analytics.

## Feature comparison

| Features                                                                                                                     | TimescaleDB Apache 2 Edition | TimescaleDB Community Edition |
|------------------------------------------------------------------------------------------------------------------------------| --- | --- |
| **Hypertables and chunks**                                                                                                   |
| [CREATE TABLE][create-table]                                                               | ✅ | ✅ |
| [create_hypertable][create_hypertable]                                                     | ✅ | ✅ |
| [show_chunks][show_chunks]                                                                 | ✅ | ✅ |
| [drop_chunks][drop_chunks]                                                                 | ✅ | ✅ |
| [split_chunk][split_chunk]                                                                 | ❌ | ✅ |
| [reorder_chunk][reorder_chunk]                                                             | ❌ | ✅ |
| [move_chunk][move_chunk]                                                                   | ❌ | ✅ |
| [add_reorder_policy][add_reorder_policy]                                                   | ❌ | ✅ |
| [attach_tablespace][attach_tablespace]                                                     | ✅ | ✅ |
| [detach_tablespace()][detach_tablespace]                                                   | ✅ | ✅ |
| [detach_tablespaces()][detach_tablespaces]                                                 | ✅ | ✅ |
| [show_tablespaces][show_tablespaces]                                                       | ✅ | ✅ |
| [set_chunk_time_interval][set_chunk_time_interval]                                         | ✅ | ✅ |
| [set_integer_now_func][set_integer_now_func]                                               | ✅ | ✅ |
| [add_dimension()][add_dimension]                                                           | ✅ | ✅ |
| [create_index (Transaction Per Chunk)][create_index-transaction-per-chunk]                                       | ✅ | ✅ |
| [hypertable_size][hypertable_size]                                                         | ✅ | ✅ |
| [hypertable_detailed_size][hypertable_detailed_size]                                       | ✅ | ✅ |
| [hypertable_index_size][hypertable_index_size]                                             | ✅ | ✅ |
| [chunks_detailed_size][chunks_detailed_size]                                               | ✅ | ✅ |
| [SkipScan][skipscan]                                                             | ❌ | ✅ |
| Distributed hypertables: sunsetted in TimescaleDB v2.14.x      | ❌ | ❌ |
| **Hypercore**                                                                                                                |
| [ALTER TABLE (Hypercore)][alter-table-hypercore]                                                      | ❌ | ✅ |
| [add_columnstore_policy][add_columnstore_policy]                                            | ❌ | ✅ |
| [remove_columnstore_policy][remove_columnstore_policy]                                      | ❌ | ✅ |
| [convert_to_columnstore][convert_to_columnstore]                                            | ❌ | ✅ |
| [convert_to_rowstore][convert_to_rowstore]                                                  | ❌ | ✅ |
| [hypertable_columnstore_settings][hypertable_columnstore_settings]                          | ❌ | ✅ |
| [hypertable_columnstore_stats][hypertable_columnstore_stats]                                | ❌ | ✅ |
| [chunk_columnstore_settings][chunk_columnstore_settings]                                    | ❌ | ✅ |
| [chunk_columnstore_stats][chunk_columnstore_stats]                                          | ❌ | ✅ |
| **Continuous aggregates**                                                                                                    |
| [CREATE MATERIALIZED VIEW (Continuous Aggregate)][create-materialized-view-continuous-aggregate]     | ❌ | ✅ |
| [ALTER MATERIALIZED VIEW (Continuous Aggregate)][alter-materialized-view-continuous-aggregate]       | ❌ | ✅ |
| [DROP MATERIALIZED VIEW (Continuous Aggregate)][drop-materialized-view-continuous-aggregate]         | ❌ | ✅ |
| [add_continuous_aggregate_policy()][add_continuous_aggregate_policy]            | ❌ | ✅ |
| [refresh_continuous_aggregate][refresh_continuous_aggregate]                    | ❌ | ✅ |
| [remove_continuous_aggregate_policy()][remove_continuous_aggregate_policy]      | ❌ | ✅ |
| **Data retention**                                                                                                           |
| [add_retention_policy][add_retention_policy]                                           | ❌ | ✅ |
| [remove_retention_policy][remove_retention_policy]                                     | ❌ | ✅ |
| **Jobs and automation**                                                                                                      |
| [add_job][add_job]                                                                    | ❌ | ✅ |
| [alter_job][alter_job]                                                                | ❌ | ✅ |
| [delete_job][delete_job]                                                              | ❌ | ✅ |
| [run_job][run_job]                                                                    | ❌ | ✅ |
| **Hyperfunctions**                                                                                                           |
| [approximate_row_count][approximate_row_count]                                         | ✅ | ✅ |
| [first][first]                                                                         | ✅ | ✅ |
| [last][last]                                                                           | ✅ | ✅ |
| [histogram][histogram]                                                                 | ✅ | ✅ |
| [time_bucket][time_bucket]                                                             | ✅ | ✅ |
| [time_bucket_ng (experimental feature)][time_bucket_ng-experimental-feature]                                | ✅ | ✅ |
| [time_bucket_gapfill][time_bucket_gapfill]                                  | ❌ | ✅ |
| [locf][locf]                                             | ❌ | ✅ |
| [interpolate][interpolate]                               | ❌ | ✅ |
| [percentile_agg][percentile_agg]                    | ❌ | ✅ |
| [approx_percentile][approx_percentile]              | ❌ | ✅ |
| [approx_percentile_rank][approx_percentile_rank]    | ❌ | ✅ |
| [rollup][rollup]                                    | ❌ | ✅ |
| [max_val][max_val]                                    | ❌ | ✅ |
| [mean][mean]                                        | ❌ | ✅ |
| [error][error]                                      | ❌ | ✅ |
| [min_val][min_val]                                    | ❌ | ✅ |
| [num_vals][num_vals]                                | ❌ | ✅ |
| [uddsketch][uddsketch]                              | ❌ | ✅ |
| [tdigest][tdigest]                                    | ❌ | ✅ |
| [time_weight][time_weight]                                  | ❌ | ✅ |
| [rollup][rollup-1]                                 | ❌ | ✅ |
| [average][average]                               | ❌ | ✅ |
| **Informational Views**                                                                                                      |
| [timescaledb_information.chunks][timescaledb_informationchunks]                        | ✅ | ✅ |
| [timescaledb_information.continuous_aggregates][timescaledb_informationcontinuous_aggregates] | ✅ | ✅ |
| [timescaledb_information.compression_settings][timescaledb_informationcompression_settings] | ✅ | ✅ |
| [timescaledb_information.data_nodes][timescaledb_informationdata_nodes]                     | ✅ | ✅ |
| [timescaledb_information.dimension][timescaledb_informationdimension] | ✅ | ✅ |
| [timescaledb_information.hypertables][timescaledb_informationhypertables]                                | ✅ | ✅ |
| [timescaledb_information.jobs][timescaledb_informationjobs]                            | ✅ | ✅ |
| [timescaledb_information.job_stats][timescaledb_informationjob_stats]                  | ✅ | ✅ |
| **Administration functions**                                                                                                 |
| [timescaledb_pre_restore][timescaledb_pre_restore]                                     | ✅ | ✅ |
| [timescaledb_post_restore][timescaledb_post_restore]                                   | ✅ | ✅ |
| [get_telemetry_report][get_telemetry_report]                                           | ✅ | ✅ |
| [dump_meta_data][dump_meta_data]                                           | ✅ | ✅ |
| **Compression   replaced by Hypercore**                                                                                      |
| [ALTER TABLE (Compression)][alter-table-compression]                                      | ❌ | ✅ |
| [add_compression_policy][add_compression_policy]                             | ❌ | ✅ |
| [remove_compression_policy][remove_compression_policy]                                    | ❌ | ✅ |
| [compress_chunk][compress_chunk]                                                          | ❌ | ✅ |
| [decompress_chunk][decompress_chunk]                                                      | ❌ | ✅ |
| [hypertable_compression_stats][hypertable_compression_stats]                              | ❌ | ✅ |
| [chunk_compression_stats][chunk_compression_stats]                                        | ❌ | ✅ |



<!-- vale Google.Units = NO -->

[add_columnstore_policy]: /api/:currentVersion:/hypercore/add_columnstore_policy/
[add_compression_policy]: /api/:currentVersion:/compression/add_compression_policy/#samples
[add_continuous_aggregate_policy]: /api/:currentVersion:/continuous-aggregates/add_continuous_aggregate_policy/
[add_dimension]: /api/:currentVersion:/hypertable/add_dimension/
[add_job]: /api/:currentVersion:/jobs-automation/add_job/
[add_reorder_policy]: /api/:currentVersion:/hypertable/add_reorder_policy/
[add_retention_policy]: /api/:currentVersion:/data-retention/add_retention_policy/
[alter-materialized-view-continuous-aggregate]: /api/:currentVersion:/continuous-aggregates/alter_materialized_view/
[alter-table-compression]: /api/:currentVersion:/compression/alter_table_compression/
[alter-table-hypercore]: /api/:currentVersion:/hypercore/alter_table/
[alter_job]: /api/:currentVersion:/jobs-automation/alter_job/
[apache-license]: https://github.com/timescale/timescaledb/blob/master/LICENSE-APACHE
[approx_percentile]: /api/:currentVersion:/hyperfunctions/percentile-approximation/uddsketch/#approx_percentile
[approx_percentile_rank]: /api/:currentVersion:/hyperfunctions/percentile-approximation/uddsketch/#approx_percentile_rank
[approximate_row_count]: /api/:currentVersion:/hyperfunctions/approximate_row_count/
[attach_tablespace]: /api/:currentVersion:/hypertable/attach_tablespace/
[average]: /api/:currentVersion:/hyperfunctions/time-weighted-calculations/time_weight#average
[chunk_columnstore_settings]: /api/:currentVersion:/hypercore/chunk_columnstore_settings/
[chunk_columnstore_stats]: /api/:currentVersion:/hypercore/chunk_columnstore_stats/
[chunk_compression_stats]: /api/:currentVersion:/compression/chunk_compression_stats/
[chunks_detailed_size]: /api/:currentVersion:/hypertable/chunks_detailed_size/
[cloud]: /use-timescale/:currentVersion:/services/
[compress_chunk]: /api/:currentVersion:/compression/compress_chunk
[convert_to_columnstore]: /api/:currentVersion:/hypercore/convert_to_columnstore/
[convert_to_rowstore]: /api/:currentVersion:/hypercore/convert_to_rowstore/
[create-materialized-view-continuous-aggregate]: /api/:currentVersion:/continuous-aggregates/create_materialized_view/
[create-table]: /api/:currentVersion:/hypertable/create_table/
[create_hypertable]: /api/:currentVersion:/hypertable/create_hypertable/
[create_index-transaction-per-chunk]: /api/:currentVersion:/hypertable/create_index/
[decompress_chunk]: /api/:currentVersion:/compression/decompress_chunk/
[delete_job]: /api/:currentVersion:/jobs-automation/delete_job/
[detach_tablespace]: /api/:currentVersion:/hypertable/detach_tablespace/
[detach_tablespaces]: /api/:currentVersion:/hypertable/detach_tablespaces/
[drop-materialized-view-continuous-aggregate]: /api/:currentVersion:/continuous-aggregates/drop_materialized_view/
[drop_chunks]: /api/:currentVersion:/hypertable/drop_chunks/
[dump_meta_data]: /api/:currentVersion:/administration/#dump-timescaledb-meta-data
[error]: /api/:currentVersion:/hyperfunctions/percentile-approximation/uddsketch/#error
[first]: /api/:currentVersion:/hyperfunctions/first/
[get_telemetry_report]: /api/:currentVersion:/administration/#get_telemetry_report
[histogram]: /api/:currentVersion:/hyperfunctions/histogram/
[hypertable_columnstore_settings]: /api/:currentVersion:/hypercore/hypertable_columnstore_settings/
[hypertable_columnstore_stats]: /api/:currentVersion:/hypercore/hypertable_columnstore_stats/
[hypertable_compression_stats]: /api/:currentVersion:/compression/hypertable_compression_stats/
[hypertable_detailed_size]: /api/:currentVersion:/hypertable/hypertable_detailed_size/
[hypertable_index_size]: /api/:currentVersion:/hypertable/hypertable_index_size/
[hypertable_size]: /api/:currentVersion:/hypertable/hypertable_size/
[interpolate]: /api/:currentVersion:/hyperfunctions/gapfilling/time_bucket_gapfill#interpolate
[last]: /api/:currentVersion:/hyperfunctions/last/
[license-blog]: https://www.tigerdata.com/blog/how-we-are-building-a-self-sustaining-open-source-business-in-the-cloud-era
[locf]: /api/:currentVersion:/hyperfunctions/gapfilling/time_bucket_gapfill#locf
[max_val]: /api/:currentVersion:/hyperfunctions/percentile-approximation/tdigest/#max_val
[mean]: /api/:currentVersion:/hyperfunctions/percentile-approximation/uddsketch/#mean
[min_val]: /api/:currentVersion:/hyperfunctions/percentile-approximation/tdigest/#min_val
[move_chunk]: /api/:currentVersion:/hypertable/move_chunk/
[num_vals]: /api/:currentVersion:/hyperfunctions/percentile-approximation/uddsketch/#num_vals
[percentile_agg]: /api/:currentVersion:/hyperfunctions/percentile-approximation/uddsketch/#percentile-agg
[refresh_continuous_aggregate]: /api/:currentVersion:/continuous-aggregates/refresh_continuous_aggregate/
[remove_columnstore_policy]: /api/:currentVersion:/hypercore/remove_columnstore_policy/
[remove_compression_policy]: /api/:currentVersion:/compression/remove_compression_policy/
[remove_continuous_aggregate_policy]: /api/:currentVersion:/continuous-aggregates/remove_continuous_aggregate_policy/
[remove_retention_policy]: /api/:currentVersion:/data-retention/remove_retention_policy/
[reorder_chunk]: /api/:currentVersion:/hypertable/reorder_chunk/
[rollup-1]: /api/:currentVersion:/hyperfunctions/time-weighted-calculations/time_weight#rollup
[rollup]: /api/:currentVersion:/hyperfunctions/percentile-approximation/uddsketch/#rollup
[run_job]: /api/:currentVersion:/jobs-automation/run_job/
[set_chunk_time_interval]: /api/:currentVersion:/hypertable/set_chunk_time_interval/
[set_integer_now_func]: /api/:currentVersion:/hypertable/set_integer_now_func/
[show_chunks]: /api/:currentVersion:/hypertable/show_chunks/
[show_tablespaces]: /api/:currentVersion:/hypertable/show_tablespaces/
[skipscan]: /use-timescale/:currentVersion:/query-data/skipscan/
[split_chunk]: /api/:currentVersion:/hypertable/split_chunk/
[tdigest]: /api/:currentVersion:/hyperfunctions/percentile-approximation/tdigest/#tdigest
[time_bucket]: /api/:currentVersion:/hyperfunctions/time_bucket/
[time_bucket_gapfill]: /api/:currentVersion:/hyperfunctions/gapfilling/time_bucket_gapfill/
[time_bucket_ng-experimental-feature]: /api/:currentVersion:/hyperfunctions/time_bucket_ng/
[time_weight]: /api/:currentVersion:/hyperfunctions/time-weighted-calculations/time_weight/
[timescale-license]: https://github.com/timescale/timescaledb/blob/master/tsl/LICENSE-TIMESCALE
[timescaledb_informationchunks]: /api/:currentVersion:/informational-views/chunks/#available-columns
[timescaledb_informationcompression_settings]: /api/:currentVersion:/informational-views/compression_settings/#sample-usage
[timescaledb_informationcontinuous_aggregates]: /api/:currentVersion:/informational-views/continuous_aggregates/#sample-usage
[timescaledb_informationdata_nodes]: /api/:currentVersion:/informational-views/data_nodes/#sample-usage
[timescaledb_informationdimension]: /api/:currentVersion:/informational-views/dimensions/#timescaledb-information-dimensions
[timescaledb_informationhypertables]: /api/:currentVersion:/informational-views/hypertables/
[timescaledb_informationjob_stats]: /api/:currentVersion:/informational-views/job_stats/#available-columns
[timescaledb_informationjobs]: /api/:currentVersion:/informational-views/jobs/#available-columns
[timescaledb_post_restore]: /api/:currentVersion:/administration/#timescaledb_post_restore
[timescaledb_pre_restore]: /api/:currentVersion:/administration/#timescaledb_pre_restore
[uddsketch]: /api/:currentVersion:/hyperfunctions/percentile-approximation/uddsketch/#uddsketch
