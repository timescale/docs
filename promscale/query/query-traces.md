# Querying trace data

## Table of contents

1\. [Trace data structure](#para-1)  
1\.1. [Single span](#para-1-1)  
1\.1.1. [`tag_map` type](#para-1-1-1)  
1\.1.2. [`trace_id` type](#para-1-1-2)  
1\.1.3. [`span_kind` enum](#para-1-1-3)  
1\.1.4. [`status_code` enum](#para-1-1-4)  
1\.2. [Views](#para-1-2)  
1\.2.1. [`span` view](#para-1-2-1)  
1\.2.2. [`event` view](#para-1-2-2)  
1\.2.3. [`link` view](#para-1-2-3)  
2\. [Examples of SQL queries](#para-2)  
2\.1. [Top 20 slowest traces](#para-2-1)  
2\.2. [Timeseries with the request rate per service](#para-2-2)  
2\.3. [Timeseries with average duration per service](#para-2-3)  
2\.4. [Most common errors in spans](#para-2-4)  
2\.5. [Timeseries with error ratio](#para-2-5)  
3\. [Querying resource and span tags](#para-3)  
3\.1. [Simple queries](#para-3-1)  
3\.2. [Filtering](#para-3-2)  
3\.3. [Joins](#para-3-3)  
3\.4. [Grouping](#para-3-4)  
3\.5. [Sorting](#para-3-5)  

# 1. Trace data structure <a name="para-1"></a>

## 1.1. Single span <a name="para-1-1"></a>

A single span is a record of the following structure:

|Name                               | Type          | Description |
|-----------------------------------|---------------|-------------|
|`trace_id`                         | `trace_id`    | Trace identifier |
|`span_id`                          | `int8`        | Span Identifier |
|`trace_state`                      | `text`        | [Trace State](https://opentelemetry.io/docs/reference/specification/trace/api/#tracestate) |
|`parent_span_id`                   | `int8`        | Reference to the Parent `trace_id` |
|`is_root_span`                     | `bool`        | Is the span a root span |
|`service_name`                     | `text`        | Name of the service |
|`span_name`                        | `text`        | Name of the span |
|`span_kind`                        | `enum`        | [Span Kind](https://opentelemetry.io/docs/reference/specification/trace/api/#spankind) |
|`start_time`                       | `timestamptz` | Start date and time of the span |
|`end_time`                         | `timestamptz` | Date and time of the span end|
|`time_range`                       | `tstzrange`   | A tstzrange representation of Start and End times of the span |
|`duration_ms`                      | `float8`      | Duration of the span in milliseconds |
|`span_tags`                        | `tag_map`     | Key-value pairs for span tags. See details on `tag_map` type below |
|`dropped_tags_count`               | `int4`        | Number of dropped tags |
|`event_time`                       | `tstzrange`   | Start and end time of the event |
|`dropped_events_count`             | `int4`        | Number of dropped events |
|`dropped_link_count`               | `int4`        | Number of dropped links |
|`status_code`                      | `enum`        | [Status Code](https://opentelemetry.io/docs/reference/specification/trace/api/#set-status) |
|`status_message`                   | `text`        | Status message |
|`instrumentation_lib_name`         | `text`        | [Instrumenatation Library](https://opentelemetry.io/docs/concepts/instrumenting-library/) name |
|`instrumentation_lib_version`      | `text`        | [Instrumenatation Library](https://opentelemetry.io/docs/concepts/instrumenting-library/) version |
|`instrumentation_lib_schema_url`   | `text`        | [Instrumenatation Library](https://opentelemetry.io/docs/concepts/instrumenting-library/) schema URL |
|`resource_tags`                    | `tag_map`     | [Resource](https://opentelemetry.io/docs/reference/specification/overview/#resources) tags |
|`resource_dropped_tags_count`      | `int4`        | Number of dropped resources |
|`resource_schema_url`              | `text`        | Resource's schema file URL |

### 1.1.1. `tag_map` type <a name="para-1-1-1"></a>

The `tag_map` type is a storage optimization for spans. It can be queried as a regular [`jsonb` PostgreSQL type](https://www.postgresql.org/docs/current/functions-json.html#FUNCTIONS-JSONB-OP-TABLE). Behind the scenes it normalizes the span data and thus significantly reduces the storage footprint. To further improve performance of the queries involving `tag_map` we're continuosly working on optimizing operators for our custom made type. So far we have optimized support for the following operators (meaning other operators will not perform well):
 - `->` -- get the value for the given key (for example: `span_tags -> 'pwlen'`)
 - `=`  -- value equality for a key (for example: `span_tags -> 'pw_len' = '10'::jsonb`)
 - `!=` -- value inequality for a key (for example: `span_tags -> 'pw_len' != '10'::jsonb`)
We intend to support all the operators available for the native PostgreSQL `jsonb` type.

### 1.1.2. `trace_id` type <a name="para-1-2-3"></a>

A `uuid`-like 16-byte type that represents the `trace_id` in compliance with [Open Telemetry requirements](https://opentelemetry.io/docs/reference/specification/trace/api/#spancontext)

### 1.1.3. `span_kind` enum <a name="para-1-1-3"></a>
Possible values:
- `unspecified`
- `internal`
- `server`
- `client`
- `producer`
- `consumer`

### 1.1.4. `status_code` enum <a name="para-1-1-4"></a>
Possible values:
- `unset`
- `ok`
- `error`

## 1.2. Views <a name="para-1-2"></a>

To provide a stable interface to the end users a set of views is provided in the `ps_trace` schema. These include:
 - `span`
 - `link`
 - `event`

### 1.2.1. `span` view <a name="para-1-2-1"></a>

This view joins several tables to present the user with an overview of the data relevant for a single span. We've already covered its structure in 1.1. What's worth mentioning is that physically the span is stored across multiple tables and data is split across several columns for better index support. The actual table with span data is a [`timescaledb` hypertable](https://docs.timescale.com/timescaledb/latest/how-to-guides/hypertables/) which enables seamless support for retention and compression out of the box.

Below is an example of a simple query on the `span` view:

```SQL
select
        service_name,
        duration_ms
    from spans
    where
            start_time >= now() - interval'10 minutes'
        and span_tags -> 'os_name' = '"🐧"'
        and span_kind = 'server'
```

### 1.2.2. `event` view <a name="para-1-2-2"></a>

`event` view provides access to the events and their corresponding spans. Further details on the events can be found [here](https://opentelemetry.io/docs/reference/specification/trace/api/#add-events) and [here](https://opentelemetry.io/docs/concepts/signals/traces/#span-events=).

|Name                           | Type          | Description |
|-------------------------------|---------------|-------------|
| `trace_id`                    | `trace_id`    | Trace identifier |
| `span_id`                     | `int8`        | Span identifier |
| `time`                        | `timestamptz` | Date and time when the even has occurred |
| `event_name`                  | `text`        | Name of the event |
| `event_tags`                  | `tag_map`     | Key-value pairs for event tags |
| `dropped_tags_count`          | `integer`     | Number of dropped event tags |
| `trace_state`                 | `text`        | [Trace State](https://opentelemetry.io/docs/reference/specification/trace/api/#tracestate) |
| `service_name`                | `text`        | Name of the service |
| `span_name`                   | `text`        | Name of the span |
| `span_kind`                   | `enum`        | [Span Kind](https://opentelemetry.io/docs/reference/specification/trace/api/#spankind) |
| `span_start_time`             | `timestamptz` | Start date and time of the span |
| `span_end_time`               | `timestamptz` | Date and time of the span en |
| `span_time_range`             | `tstzrange`   | A tstzrange representation of Start and End times of the span |
| `span_duration_ms`            | `float8`      | Duration of the span in milliseconds |
| `span_tags`                   | `tag_map`     | Key-value pairs for span tags. See details on `tag_map` type below |
| `dropped_span_tags_count`     | `integer`     | Number of dropped span tags |
| `resource_tags`               | `tag_map`     | [Resource](https://opentelemetry.io/docs/reference/specification/overview/#resources) tags |
| `resource_dropped_tags_count` | `integer`     | Number of dropped resource tags |
| `status_code`                 | `enum`        | [Status Code](https://opentelemetry.io/docs/reference/specification/trace/api/#set-status) |
| `status_message`              | `text`        | Status message |

Below is an example of a simple query on the `event` view:

```SQL
select
        service_name,
        span_name,
        status_message
    from events
    where
            start_time >= now() - interval'10 minutes'
        and event_tags -> 'signal' = '"🆘"'
```

### 1.2.3. `link` view <a name="para-1-2-3"></a>

!TODO: Find docs on linked_spans

# 2. Examples of SQL queries <a name="para-2"></a>

General notes on the queries:
- When building timeseries graphs, cosinder using the [`$__interval`](https://grafana.com/docs/grafana/latest/variables/variable-types/global-variables/#__interval) variable provided by Grafana
- To make the bucketing configurable, we can rely on the `timescaledb` function `time_bucket` and the corresponding Grafana variable [`$bucket_interval`](https://docs.timescale.com/timescaledb/latest/tutorials/grafana/visualizations/histograms/#create-a-price-transaction-histogram-with-raw-data)
- We limit the `start_time` using grafana time filter `$__timeFilter`

Bigger windows come at a cost. We don't recommend completely removing `start_time` filters, as it will have significant performance impact.

- PostgreSQL has very versatile [`interval` type](https://www.postgresql.org/docs/current/datatype-datetime.html#DATATYPE-INTERVAL-INPUT). Make sure to get familiar with it.


## 2.1. Top 20 slowest traces <a name="para-2-1"></a>

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

## 2.2. Timeseries with the request rate per service <a name="para-2-2"></a>

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

## 2.3. Timeseries with average duration per service <a name="para-2-3"></a>

!TODO: Make sure this is the query

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

## 2.4. Most common errors in spans <a name="para-2-4"></a>

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
## 2.5. Timeseries with error ratio <a name="para-2-5"></a>

```SQL
select
        time_bucket('$__interval', start_time) as "Time",
        coalesce(count(*) filter (where status_code = 'error')::numeric / count(*), 0) as "Error ratio"
    from ps_trace.span s
    where
            $__timeFilter(start_time)
        and (  span_kind = 'server'
            or parent_span_id is null)
        and service_name = '${service}'
    group by 1
    order by 1
```
