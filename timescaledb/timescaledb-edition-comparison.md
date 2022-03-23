## TimescaleDB Apache 2 vs TimescaleDB Community Editions

There are two versions of TimescaleDB available:
TimescaleDB Apache 2 Edition is the version of TimescaleDB that is available under the
[Apache 2.0 license](https://github.com/timescale/timescaledb/blob/master/LICENSE-APACHE).
This is a classic open source license, meaning that it is completely unrestricted -
anyone can take this code and offer it as-a-service.

### TimescaleDB Apache 2 Edition

- _Can I install TimescaleDB Apache 2 Edition in my own on-premises or cloud infrastructure and run it for free?_ <br/>
  Yes.
- _Can I sell TimescaleDB Apache 2 Edition as a service, even if I'm not the main contributor?_ <br/>
  Yes.
- _Can I modify the TimescaleDB Apache 2 Edition source code and run it for production use?_ <br/>
  Yes.

TimescaleDB Apache 2 Edition is available at the following service providers: [Azure Database for PostgreSQL][azure-database], [Digital Ocean][digital-ocean], [Aiven for PostgreSQL][aiven].

### TimescaleDB Community Edition

TimescaleDB Community Edition is the latest, most updated version of TimescaleDB, available under the [Timescale License (TSL)][timescale-license]. [Read more about the Timescale License][license-blog].

Many of the most recent features of TimescaleDB are only available in TimescaleDB Community Edition.

- _Can I install TimescaleDB Community Edition in my own on-premises or cloud infrastructure and run it for free?_ <br/>
  Yes. TimescaleDB Community Edition is completely free if you manage your own service.
- _Can I sell TimescaleDB Community Edition as a service, even if I'm not the main contributor?_ <br/>
  No.
- _Can I modify the TimescaleDB Community Edition source code and run it for production use?_ <br/>
  Yes. Developers using TimescaleDB Community Edition have the “right to repair” and make modifications to the source code and run it in their own on-premises or cloud infrastructure. However, consistent with the previous question, users may not make modifications to the TimescaleDB Community Edition source code and offer it as a service.
- _Is there a hosted version of TimescaleDB Community Edition?_ <br/>
  Yes. There are two options for users that want to run TimescaleDB Community Edition as a hosted service in the cloud: [Timescale Cloud][timescale-cloud] and [Managed Service for TimescaleDB (MST)][mst]. Timescale Cloud is a cloud-native platform for time-series, hosted in AWS. MST is a database-as-a-service offering for TimescaleDB. MST is offered in AWS, Azure, and Google Cloud.

### Feature comparison

<table>
  <tr>
    <th>Features</th>
    <th>TimescaleDB Apache 2 Edition</th>
    <th>TimescaleDB Community Edition</th>
  </tr>
  <tr>
    <td><strong>Hypertables & Chunks</strong></td>
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
    <td><strong>Distributed hypertables</strong></td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/distributed-hypertables/create_distributed_hypertable/">create_distributed_hypertable</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/distributed-hypertables/add_data_node/">add_data_node</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/distributed-hypertables/attach_data_node/">attach_data_node</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/distributed-hypertables/detach_data_node/">detach_data_node</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/distributed-hypertables/delete_data_node/">delete_data_node</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/distributed-hypertables/distributed_exec/">distributed_exec</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/distributed-hypertables/set_number_partitions/">set_number_partitions</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/distributed-hypertables/set_replication_factor/">set_replication_factor</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/distributed-hypertables/copy_chunk_experimental/">copy_chunk</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/distributed-hypertables/move_chunk_experimental/">move_chunk</a></td>
    <td>❌</td>
    <td>✅</td>
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
    <td><strong>Actions and Automation</strong></td>
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
    <td><a href="https://docs.timescale.com/api/latest/hyperfunctions/gapfilling-interpolation/time_bucket_gapfill/">time_bucket_gapfill</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hyperfunctions/gapfilling-interpolation/locf/">locf</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hyperfunctions/gapfilling-interpolation/interpolate/">interpolate</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hyperfunctions/percentile-approximation/percentile_agg/#percentile-agg">percentile_agg</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hyperfunctions/percentile-approximation/approx_percentile/#required-arguments">approx_percentile</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hyperfunctions/percentile-approximation/approx_percentile_rank/">approx_percentile_rank</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hyperfunctions/percentile-approximation/rollup-percentile/">rollup</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hyperfunctions/percentile-approximation/max_val/#returns">max_val</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hyperfunctions/percentile-approximation/mean/">mean</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hyperfunctions/percentile-approximation/error/">error</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hyperfunctions/percentile-approximation/min_val/#required-arguments">min_val</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hyperfunctions/percentile-approximation/num_vals-pct/">num_vals</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hyperfunctions/percentile-approximation/percentile-aggregation-methods/uddsketch/#implementation-details">uddsketch</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hyperfunctions/percentile-approximation/percentile-aggregation-methods/tdigest/#tdigest">tdigest</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hyperfunctions/time-weighted-averages/time_weight/#required-arguments">time_weight</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
   <tr>
    <td><a href="https://docs.timescale.com/api/latest/hyperfunctions/time-weighted-averages/rollup-timeweight/">rollup</a></td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/hyperfunctions/time-weighted-averages/average-time-weight/">average</a></td>
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
    <td><strong>Administration Functions</strong></td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/administration/timescaledb_pre_restore/">timescaledb_pre_restore</a></td>
    <td>✅</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/administration/timescaledb_post_restore/">timescaledb_post_restore</a></td>
    <td>✅</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/administration/get_telemetry_report/">get_telemetry_report</a></td>
    <td>✅</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><a href="https://docs.timescale.com/api/latest/administration/dump_meta_data/">dump_meta_data</a></td>
    <td>✅</td>
    <td>✅</td>
  </tr>
</table>

[azure-database]: https://azure.microsoft.com/en-us/services/postgresql/?&ef_id=CjwKCAjwhOyJBhA4EiwAEcJdcWZ6_o9d5INkZvm1MGsOsinuXgDwV_ySL5vc34z3pyxxrP0R49J_8xoCVvIQAvD_BwE:G:s&OCID=AID2200277_SEM_CjwKCAjwhOyJBhA4EiwAEcJdcWZ6_o9d5INkZvm1MGsOsinuXgDwV_ySL5vc34z3pyxxrP0R49J_8xoCVvIQAvD_BwE:G:s&gclid=CjwKCAjwhOyJBhA4EiwAEcJdcWZ6_o9d5INkZvm1MGsOsinuXgDwV_ySL5vc34z3pyxxrP0R49J_8xoCVvIQAvD_BwE#overview
[digital-ocean]: https://docs.digitalocean.com/products/databases/postgresql/resources/supported-extensions/
[aiven]: https://aiven.io/postgresql
[timescale-license]: https://github.com/timescale/timescaledb/blob/master/tsl/LICENSE-TIMESCALE
[timescale-cloud]: /cloud/latest
[mst]: /mst/latest
[license-blog]: https://blog.timescale.com/blog/building-open-source-business-in-cloud-era-v2/
