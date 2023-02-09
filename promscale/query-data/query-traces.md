---
title: Query traces in Promscale
excerpt: Query trace data in Promscale
product: promscale
keywords: [analytics, query, traces]
tags: [sql]
---

import PromscaleDeprecation from "versionContent/_partials/_deprecated-promscale.mdx";

# Query traces in Promscale

<PromscaleDeprecation />

This section covers information about the data model used with traces and the
different SQL queries you can use for trace data.

You can query the data in Promscale with your preferred SQL tool. For example,
you can use `psql`.
For more information about installing and using `psql`, see the
[installing psql section][install-psql].

## Span

A span represents a single operation within a trace. The structure of a span is
similar to:

|Name|Type|Description|
|-|-|-|
|`trace_id`|`trace_id`|Trace identifier|
|`span_id`|`int8`|Span identifier|
|`trace_state`|`text`|[Trace state][trace-state-docs]|
|`parent_span_id`|`int8`|Reference to the parent `trace_id`|
|`is_root_span`|`bool`|Is the span a root span|
|`service_name`|`text`|Name of the service|
|`span_name`|`text`|Name of the span|
|`span_kind`|`enum`|[Span kind][span-kind-docs]|
|`start_time`|`timestamptz`|Start date and time of the span |
|`end_time`|`timestamptz`|End date and time of the span|
|`time_range`|`tstzrange`|A [`tstzrange`][tstzrange-docs] representation of Start and End times of the span|
|`duration_ms`|`float8`|Duration of the span in milliseconds|
|`span_tags`|`tag_map`|Key-value pairs for span tags. See details on `tag_map` type in this section|
|`dropped_tags_count`|`int4`|Number of dropped tags|
|`event_time`|`tstzrange`|Start and end time of the event|
|`dropped_events_count`|`int4`|Number of dropped events|
|`dropped_link_count`|`int4`|Number of dropped links|
|`status_code`|`enum`|[Status Code][status-code-docs]|
|`status_message`|`text`|Status message|
|`instrumentation_lib_name`|`text`|[Instrumentation Library][instrumentation-docs] name|
|`instrumentation_lib_version`|`text`|[Instrumentation Library][instrumentation-docs] version|
|`instrumentation_lib_schema_url`|`text`|[Instrumentation Library][instrumentation-docs] schema URL|
|`resource_tags`|`tag_map`|[Resource][resource-docs] tags|
|`resource_dropped_tags_count`|`int4`|Number of dropped resources|
|`resource_schema_url`|`text`|Resource's schema file URL|

### `tag_map`

The `tag_map` type is a storage optimization for spans. It can be queried as a
regular [`jsonb` PostgreSQL type][jsonb-pg-type]. It normalizes the span data
and can significantly reduce the storage footprint. This is a custom type
created by Timescale, and it is continuously being improved. While all other
operators also perform well, these operators have additional performance
optimizations:

*   `->` is used get the value for the given key. For example: `span_tags -> 'pwlen'`.
*   `=` is used to provide value equality for a key. For example: `span_tags -> 'pw_len' = '10'::jsonb`.
*   `!=` is used to provide value inequality for a key. For example: `span_tags -> 'pw_len' != '10'::jsonb`.

### `trace_id`

The `trace_id` type is a 16-byte type that is a bit like a UUID. It represents
the `trace_id` in compliance with [Open Telemetry requirements][opentel-spec].

### `span_kind`

The `span_kind` provides useful performance context in a trace. This information is useful in performance analysis. The possible values for this type are:
`unspecified`, `internal`, `server`, `client`, `producer`, and `consumer`.

### `status_code`

The `status_code` is a special, standardized property for a span. The possible values are: `unset`, `ok`, and `error`.

## Views

Promscale uses views to provide a stable interface. The set of views is provided
in the `ps_trace` schema. These include:

*   `span`
*   `link`
*   `event`

### Span view

The `span` view joins several tables so that you can see an overview of the data
relevant for a single span. The span is stored across multiple tables, and data
is split across several columns for better index support. The table that
contains the span data is a hypertable, so it has support for retention and
compression.

This is an example of a simple query to view spans for a service in the
last 10 minutes on a Linux server:

```SQL
select
        service_name,
        duration_ms
    from span
    where
            start_time >= now() - interval '10 minutes'
        and span_tags -> 'os_name' = '"linux"'
        and span_kind = 'server'
    limit 50
```

### Event view

The `event` view provides access to events and their corresponding spans. For
more information about OpenTelemetry events, see the OpenTelemetry documentation
for [add events][opentel-add-events] and [span events][opentel-span-events].

The structure of an event view is similar to:

|Name|Type|Description|
|-|-|-|
|`trace_id`|`trace_id`|Trace identifier|
|`span_id`|`int8`|Span identifier|
|`time`|`timestamptz`|Date and time when the event has occurred|
|`event_name`|`text`|Name of the event|
|`event_tags` `tag_map`|Key-value pairs for event tags|
|`dropped_tags_count`|`integer`|Number of dropped event tags|
|`trace_state`|`text`|[Trace State][trace-state-docs]|
|`service_name`|`text`|Name of the service|
|`span_name`|`text`|Name of the span|
|`span_kind`|`enum`|[Span Kind][span-kind-docs]|
|`span_start_time`|`timestamptz`|Start date and time of the span|
|`span_end_time`|`timestamptz`|End date and time of the span|
|`span_time_range`|`tstzrange`|A [`tstzrange`][tstzrange-docs] representation of start and end times of the span|
|`span_duration_ms`|`float8`|Duration of the span in milliseconds|
|`span_tags`|`tag_map`|Key-value pairs for span tags. See details on `tag_map` type below|
|`dropped_span_tags_count`|`integer`|Number of dropped span tags|
|`resource_tags`|`tag_map`|[Resource][resource-docs] tags|
|`resource_dropped_tags_count`|`integer`|Number of dropped resource tags|
|`status_code`|`enum`|[Status code][status-code-docs]|
|`status_message`|`text`|Status message|

This is an example of a simple query to view the events in the last 10 minutes
with error:

```SQL
select
        service_name,
        span_name,
        status_message
    from events
    where
            start_time >= now() - interval '10 minutes'
        and event_tags -> 'level' = '"error"'
    limit 50
```

### Link view

The `link` view allows you to see spans that have originated from the same
trace. In essence, it is a representation of two related spans, with some extra
information about the relationship between them. For more information about
linked tags, see the [OpenTelemtry specification][opentel-spec-links].

The `link` view adds all the columns in the previous table, as well as these additional columns:

|Name|Type|Description|
|-|-|-|
|`link_tags`|`tag_map`|Link tags|
|`dropped_link_tags_count`|`integer`|Number of dropped link tags|

## Example trace queries in SQL

A trace is a collection of transactions or spans that represents a unique user or API transaction handled by an application and its services.

When you build time series graphs in Grafana, you can use the Grafana [`$__interval`][grafana-interval] variable.

If you want to configure bucketing, you can use the TimescaleDB `time_bucket`
function with the corresponding Grafana
[`$bucket_interval`][grafana-bucket-interval] variable.

You can limit the `start_time` using the Grafana `$__timeFilter` variable.

Bigger windows come at a cost, so you should avoid completely removing the
`start_time` filters. If you remove them, searches need to occur across all
spans in the database, which could significantly impact your performance.

PostgreSQL has a very versatile [`interval` type][pg-interval], which can be
very useful when you create these kinds of queries.

Find the top twenty slowest traces:

```SQL
select
        service_name as "Service",
        duration_ms  as "Duration (ms)"
    from span s
    where
            $__timeFilter(start_time)
        and (
                parent_span_id is null
            or  span_kind = 'server')
    order by 2 desc
    limit 20
```

Find the specified request rate per service:

```SQL
select
        time_bucket('$__interval', start_time) as "time",
        coalesce(count(*)/date_part('epoch', '$__interval'::interval), 0) as "Request rate"
    from ps_trace.span s
    where
            $__timeFilter(start_time)
        and (  span_kind = 'server'
            or parent_span_id is null)
        and service_name = '${service}'
    group by 1
    order by 1
```

Find the average duration per service:

```SQL
select
        service_name     as "Service",
        avg(duration_ms) as "Average Duration (ms)"
    from ps_trace.span s
    where
        $__timeFilter(start_time)
    and (
                parent_span_id is null
            or  span_kind = 'server')
    group by 1
    order by 1 asc
```

Find the most common span errors:

```SQL
select
        status_message  as "Error",
        service_name    as "Service",
        count(*)        as "Occurrences"
    from ps_trace.span
    where
            $__timeFilter(start_time)
        and status_code = 'error'
    group by 1, 2
    order by 3
    limit 50
```

Find the current error ratio:

```SQL
select
        time_bucket('$__interval', start_time) as "Time",
        coalesce((count(*) filter (where status_code = 'error'))::numeric / count(*), 0::numeric) as "Error ratio"
    from ps_trace.span s
    where
            $__timeFilter(start_time)
        and (  span_kind = 'server'
            or parent_span_id is null)
        and service_name = '${service}'
    group by 1
    order by 1
```

## Query resource and span tags

This section contains some example SQL queries that you can use for insight into
complex systems and interactions.

### Simple queries

The simplest queries you can perform on spans involve only a single table or
view. For example, this query returns certain columns of the `span` view, up
to 50 rows:

```SQL
select
        trace_id,
        span_id,
        span_tags,
        resource_tags,
        status_message
    from span
    limit 50
```

This query returns all columns of the `link` view, up to 50 rows:

```SQL
select *
    from link
    limit 5
```

These simpler queries can be a good way to start learning a new system.

### Filters

In most cases, the volume and diversity of trace data is very high, so you might
find that you need to limit the scope of your queries. You can do this with
filtering.

<highlight type="note">
When you are working with time series data, make sure you define the time window
that you are interested in. Because data is partitioned based on the time,
omitting the time filters can drastically hinder the performance of the queries.
</highlight>

To filter the data you're interested in, you can use the SQL `where` clause.
This example queries spans that happened within last 30 minutes. This type of
query is far more efficient than those without any filters in the `where`
clause, as it allows the optimizer to eliminate unnecessary chunks from the
hypertable. It also uses indexes to locate rows that satisfy the query. For
example:

```SQL
select
        trace_id,
        span_id,
        status_message
    from span
    where start_time >= now() - interval '30 minutes'
    limit 50
```

For more information about partitioning hypertables, see the
[partitioning hypertables section][partitioning-hypertables].

When you are querying traces, it is important to pinpoint a particular trace
tag. You can do this with standard PostgreSQL [`json` operators][jsonb-pg-type].
For example:

```SQL
select *
    from span
    where
            start_time >= now() - interval '30 minutes'
        and span_tags -> 'pwlen' = '25'
    limit 50

```

In this example, the scope is limited to spans within last 30 minutes, with a
`pwlen` tag, and an exact value of `25`. You can specify as many of these as you
want, and combine them with logical operations. For example:

```SQL
select *
    from span
    where
            start_time >= now() - interval '30 minutes'
        and span_tags -> 'pwlen' = '25'
        and resource_tags -> 'telemetry.sdk.name' = '"opentelemetry"'
    limit 50
```

<highlight type="note">
In the previous example, the `'"opentelemtry"'` string is both single- and
double-quoted. This is because PostgreSQL's `->` operator returns JSONB, and
expects JSONB on the right side of the `=`. You could potentially work around
this by using the `->>` operator instead, so that it returns text instead of
JSONB, but the `->>` operator is not supported in the current implementation of
`tag_map` type.
</highlight>

### Joins

You can use a `JOIN` to see how the error rate of your service correlates with
the overall memory consumption of a container. To do this, you need to join the
corresponding metric table, with the `span` view. For example:

```SQL
select
        time_bucket('30 minutes', span.start_time) as "time",
        max(mem.value) as "max_mem",
        count(trace_id) as "num_errors"
    from container_memory_working_set_bytes as mem
        left join span on
                time_bucket('30 minutes', span.start_time) = time_bucket('30 minutes', mem.time)
            and span.status_code = 'error'
            and span.service_name = 'my_service'
            and span.span_tags -> 'container_name' = '"my_container"'
    where
            mem.value != 'NaN'
        and mem.time >= now() - interval '1 week'
        and span.start_time >= now() - interval '1 week'
        and mem.container = 'my_container'
        and mem.instance = 42
    group by 1
    order by 1
```

To understand the previous example in more depth, start by looking at the metric
table and its filters:

*   To retrieve actual memory usage values, the query filters out some misses
  where the value was reported as `NaN`.
*   The query specifies last week as the time window. This allows the
  planner to eliminate unnecessary partitions on the planning stage. This should
  also significantly speed up the query.
*   The query limits the metrics to the container and instance you're interested
  in. This also helps to give the planner more freedom in dealing with the
  query.
*   The join clause itself is matching only on the generated `time_bucket`.

Now to look at the `span` view:

*   The only qualification in the `where` clause is the `start_time` matching that
  of the metric.
*   A number of filters are specified in the join condition instead. This is for a
  couple of reasons. Firstly, you need to filter out irrelevant rows from the
  `span` view. Secondly, you want to keep the entries from the metric table to
  have a good measure of memory consumption regardless if there were errors or
  not. If you put these qualifications into the `where` clause instead, all the
  rows without errors that match would be filtered out.

### Grouping

You can use aggregate functions to perform various operations on groups. You can
group data on any set of columns, including fields of `tag_map` columns.

This example groups by both time and the `pwlen` field of the `span_tags` column
using their position in the `select` list. In this case, `count(*)` is an
[aggregate function][pg-agg-function]
that counts the number of rows in the group. In this case, it's a 30 minute
window with the same value of `pwlen` field. For example:

```SQL
select
        time_bucket('30 minutes', start_time)   as "time",
        span_tags -> 'pwlen'                    as "pwlen",
        count(*)                                as "cnt"
    from span
    where
            start_time >= now() - interval '1 day'
        and service_name = '${service}'
    group by 1, 2
```

### Sorting

You can also sort data based on `tag_map` column fields. This behaves in the
same way as the standard PostgreSQL `jsonb` type, and the same rules apply when
sorting. Numeric fields sort using numeric comparison, like `[1, 2, 10, 11]`,
and text fields sort using string comparison, like `["1", "10", "11", "2"]`.

In this example, the output is sorted based on the value **and type** of
`pwlen`:

```SQL
select *
    from span
    where start_time >= now() - interval '1 hour'
    order by span_tags -> 'pwlen'
    limit 50
```

[grafana-bucket-interval]: /timescaledb/:currentVersion:/tutorials/grafana/visualizations/histograms/#prerequisites
[grafana-interval]: https://grafana.com/docs/grafana/latest/variables/variable-types/global-variables/#__interval
[install-psql]: /timescaledb/:currentVersion:/how-to-guides/connecting/psql/
[instrumentation-docs]: https://opentelemetry.io/docs/concepts/instrumenting-library/
[jsonb-pg-type]: https://www.postgresql.org/docs/current/functions-json.html#FUNCTIONS-JSONB-OP-TABLE
[opentel-add-events]: https://opentelemetry.io/docs/reference/specification/trace/api/#add-events
[opentel-span-events]: https://opentelemetry.io/docs/concepts/signals/traces/#span-events
[opentel-spec-links]: https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/overview.md#links-between-spans
[opentel-spec]: https://opentelemetry.io/docs/reference/specification/trace/api/#spancontext
[partitioning-hypertables]: /timescaledb/:currentVersion:/overview/core-concepts/hypertables-and-chunks/#partitioning-in-hypertables-with-chunks
[pg-agg-function]: https://www.postgresql.org/docs/current/functions-aggregate.html
[pg-interval]: https://www.postgresql.org/docs/current/datatype-datetime.html#DATATYPE-INTERVAL-INPUT
[resource-docs]: https://opentelemetry.io/docs/reference/specification/overview/#resources
[span-kind-docs]: https://opentelemetry.io/docs/reference/specification/trace/api/#spankind
[status-code-docs]: https://opentelemetry.io/docs/reference/specification/trace/api/#set-status
[status-code-docs]: https://opentelemetry.io/docs/reference/specification/trace/api/#set-status
[trace-state-docs]: https://opentelemetry.io/docs/reference/specification/trace/api/#tracestate
[tstzrange-docs]: https://www.postgresql.org/docs/current/rangetypes.html#RANGETYPES-BUILTIN
