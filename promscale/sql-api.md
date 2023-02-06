---
title: SQL functions API reference
excerpt: Learn about all Promscale SQL API functions
product: promscale
keywords: [API]
tags: [reference]
---

import PromscaleDeprecation from "versionContent/_partials/_deprecated-promscale.mdx";

# SQL functions API Reference

<PromscaleDeprecation />

This page is a reference for the functions available in Promscale.

<!--
SQL To generate

SELECT
  p.proname as "Name",
  pg_catalog.pg_get_function_arguments(p.oid) as "Argument data types",
  pg_catalog.pg_get_function_result(p.oid) as "Result data type",
  p.proname || ' ' || pg_catalog.obj_description(p.oid, 'pg_proc') || '.' as "Description"
FROM pg_catalog.pg_proc p
     LEFT JOIN pg_catalog.pg_namespace n ON n.oid = p.pronamespace
     LEFT JOIN pg_catalog.pg_language l ON l.oid = p.prolang
WHERE n.nspname OPERATOR(pg_catalog.~) '^(prom)$' COLLATE pg_catalog.default
ORDER BY 1, 2, 4;
-->
## General

|Name|Arguments|Type|Description|
|-|:-:|:-:|:-|
 |`add_prom_node`|node_name text, attach_to_existing_metrics DEFAULT true|boolean||
 |`config_maintenance_jobs`|number_jobs integer, new_schedule_interval interval, new_config jsonb DEFAULT NULL::jsonb|boolean|Configure the number of maintenance jobs run by the job scheduler, as well as their scheduled interval.|
 |`execute_maintenance`|||Execute maintenance tasks like dropping data according to retention policy. This procedure should be run regularly in a cron job.|

## Labels

|Name|Arguments|Type|Description|
|-|:-:|:-:|:-|
 |`eq`|labels label_array, json_labels jsonb|boolean|eq returns true if the labels and jsonb are equal, ignoring the metric name.|
|`eq`|labels1 label_array, labels2 label_array|boolean|eq returns true if two label arrays are equal, ignoring the metric name.|
 |`eq`|labels1 label_array, matchers matcher_positive|boolean|eq returns true if the label array and matchers are equal, there should not be a matcher for the metric name.|
 |`jsonb`|labels label_array|jsonb|jsonb converts a labels array to a JSONB object.|
 |`key_value_array`|labels label_array, OUT keys text[], OUT vals text[]|record|key_value_array converts a labels array to two arrays: one for keys and another for values.|
 |`label_cardinality`|label_id integer|integer|
 |`label_key_position`|metric_name text, key text|integer|
 |`labels`|series_id bigint|label_array|labels fetches labels array for the given series id.|
 |`labels_info`|INOUT labels integer[], OUT keys text[], OUT vals text[]|record|labels_info converts an array of label ids to three arrays: one for ids, one for keys and another for values.|
 |`matcher`|labels jsonb|matcher_positive|matcher returns a matcher for the JSONB, name is ignored. The matcher can be used to match against a label array using @> or ? operators.|
 |`val`|label_id integer|text|val returns the label value from a label id.|

## Metrics

|Name|Arguments|Type|Description|
|-|:-:|:-:|:-|
 |`drop_metric`|metric_name_to_be_dropped text|void||
 |`delete_series_from_metric`|metric_name text, series_ids|boolean|deletes the series from the metric.|
 |`get_default_metric_retention_period`||interval|Returns the current default retention period for metrics.|
 |`get_metric_metadata`|metric_family_nametext|TABLE(metric_family text, type text, unit text, help text)|
 |`get_metric_retention_period`|metric_name text|interval|Returns the retention period configured for a specific metric.|
 |`get_multiple_metric_metadata`|metric_families text[]|TABLE(metric_family text, type text, unit text, help text)|
 |`is_normal_nan`|value double precision|boolean|is_normal_nan returns true if the value is a NaN.|
 |`is_stale_marker`|value double precision|boolean|is_stale_marker returns true if the value is a Prometheus stale marker.|
 |`register_metric_view`|schema_name text, view_name text, if_not_exists boolean|boolean|Register metric view with Promscale. This enables you to query the data with PromQL and set data retention policies through Promscale. Schema name and view name should be set to the desired schema and view you want to use. Note: underlying view needs to be based on an existing metric in Promscale (should use its table in the FROM clause).|
 |`reset_metric_chunk_interval`|metric_name text|boolean|reset_metric_chunk_interval resets the chunk interval for a specific metric to using the default.|
 |`reset_metric_compression_setting`|metric_name text|boolean|reset_metric_compression_setting resets the compression setting for a specific metric to using the default.|
 |`reset_metric_retention_period`|metric_name text|boolean|reset_metric_retention_period resets the retention period for a specific metric to using the default.|
 |`set_compression_on_metric_table`|metric_table_name text, compression_setting boolean|void|set_compression_on_metric_table set a compression for a specific metric table.|
 |`set_default_chunk_interval`|chunk_interval interval|boolean|set_default_chunk_interval set the chunk interval for any metrics (existing and new) without an explicit override.|
 |`set_default_compression_setting`|compression_setting boolean|boolean|set_default_compression_setting set the compression setting for any existing and new metrics without an explicit override.|
 |`set_default_retention_period`|retention_period interval|boolean|set_default_retention_period set the retention period for any metrics (existing and new) without an explicit override.|
 |`set_metric_chunk_interval`|metric_name text, chunk_interval interval|boolean|set_metric_chunk_interval set a chunk interval for a specific metric (this overrides the default).|
 |`set_metric_compression_setting`|metric_name text, new_compression_setting boolean|boolean|set_metric_compression_setting set a compression setting for a specific metric and this overrides the default.|
 |`set_metric_retention_period`|metric_name text, new_retention_period interval|boolean|set_metric_retention_period set a retention period for a specific metric (this overrides the default).|
 |`unregister_metric_view`|schema_name text, view_name text, if_not_exists boolean|boolean|Unregister metric view with Promscale. Schema name and view name should be set to the metric view already registered in Promscale.|
