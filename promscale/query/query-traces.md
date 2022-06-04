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
We intend to support optimization for all the operators available for the native PostgreSQL `jsonb` type.

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
- To make the bucketing configurable, we can rely on the `timescaledb` function `time_bucket` and the corresponding Grafana variable [`$bucket_interval`](https://docs.timescale.com/timescaledb/latest/tutorials/grafana/visualizations/histograms/#prerequisites)
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
# 3. Querying resource and span tags <a name="para-3"></a>

One of the major advantages of having SQL as the query language is the power and freedom it provides. Below we'll show some examples of techniques one can use to gain insights into complex systems and interactions within it.

## 3.1. Simple queries <a name="para-3-1"></a>

The simplest queries we can do would involve only a single table or [view](#para-1-2), for example:

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
This will return certain columns of the `span` view and up to 50 rows.

```SQL
select *
    from link
    limit 5
```
This one will return all columns of the `link` view and up to 50 rows as well.

Such queries can be very useful first exploratory step into a new system. Typicall though the volume and diversity of trace data in modern systems is very high, at the very least we want to limit the scope of our query.

## 3.2. Filtering <a name="para-3-2"></a>

To filter the data we're interested in we're going to use the SQL `where` clause:

```SQL
select
        trace_id,
        span_id,
        status_message
    from span
    where start_time >= now() - interval '30 minutes'
```
Here we limit our query to spans that happened within last 30 minutes. This type of query is far more efficient than those without any filters in the `where` clause, as it allows the optimizer do it's magic, namely eliminating unnecessary [chunks from the hypertable](https://docs.timescale.com/timescaledb/latest/overview/core-concepts/hypertables-and-chunks/#partitioning-in-hypertables-with-chunks=) and using indexes to locate rows that satisfy our quals.

When dealing with timeseries data it is very important to define the time window that is of interest, because the data is partitioned based on the time and thus omitting time filters can drastically hinder the performance of the queries.

When dealing with traces it can be extremely important to pinpoint a particular trace tag. This can be done by using standard PostgreSQL [`json` operators](https://www.postgresql.org/docs/current/functions-json.html#FUNCTIONS-JSONB-OP-TABLE):

```SQL
select *
    from span
    where 
            start_time >= now() - interval '30 minutes'
        and span_tags -> 'pwlen' = '25'

```

Here we are limiting our scope to spans within last 30 minutes that have a tag `pwlen` with exact value `25`. We can specify as many of these as we want combining them with logical operations:

```SQL
select *
    from span
    where 
            start_time >= now() - interval '30 minutes'
        and span_tags -> 'pwlen' = '25'
        and resource_tags -> 'telemetry.sdk.name' = '"opentelemetry"'
```

Notice the single **and** double-quoted string `'"opentelemtry"'`. This is an artefact of PostgreSQL's `->` operator returning a `jsonb` and thus expecting a `jsonb` on the right side of the `=`. This can be worked around by using the more appropriate `->>` operator that returns text, but unfortunately that operator is not supported in the current implementation of `tag_map` type. It is planned for Promscale 1.0.0, so stay tuned!


## 3.3. Joins <a name="para-3-3"></a>

One of the main reasons to use SQL database as a backbone of your observability stack is to be able to conduct correlational analysis of different types of data, namely metrics and spans. And Promscale enables you to do exactly that.

Suppose we want to see how error rate of our service correlates with the overall memory consumption of a container. It's as easy as joining the corresponding metric table with the aforementioned `span` view:

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
There's quite a bit going on in this query, so lets break it down.
First lets have a look at our metric table and its filters:

1. We want some actual memory usage values so we filter out some misses where the value was reported `NaN`
2. We explicitly specify last week as the time window to allow planner to eliminate unecessary partitions on the planning stage. This should speed up our query significantly
3. We explicitly limit the metrics to the container and instance we're interested in. This is also aimed at giving planner more freedom in dealing with the query.
4. The join clause itself is matching only on the generated `time_bucket`. More on this later.

The `span` view we approach slightly differently:

1. The only qual in the `where` clause we specify is the `start_time` matching that of the metric for the same reason
2. We specify a number of filters in the join condition instead for several reasons:
 - We do need to filter out irrelevant rows from the `span` view
 - We want to keep the entries from the metric table to have a good measure of memory consumption regardless if there were errors or not. If we instead put these quals into the `where` clause, all the rows without errors matching the quals would've been filtered out.

Further we'll see how we can leverage full power of SQL by combining all these primitives together.

## 3.4. Grouping <a name="para-3-4"></a>

One of the strengths of SQL in general and PostgreSQL in particular are aggregate functions which perform various operations on groups. We can group data on any set of columns, includinig fields of `tag_map` columns. Below is a simple example:

```SQL
select
        time_bucket('30 minutes', start_time)   as "time",
        span_tags -> 'pwlen'                    as "pwlen",
        count(*)                                as "cnt"
    from span
    where 
            start_time >= now() - interval'1 day'
        and service_name = '${service}'
    group by 1, 2
```

Here we use group by both time and the `pwlen` field of the `span_tags` column using their position in the `select` list. `count(*)` in this case is an [aggregate function](https://www.postgresql.org/docs/current/functions-aggregate.html) that counts the number of rows in the group, in our case a 30-minute window with the same value of `pwlen` field.

Now we can build a more complicated query using both techniques. Lets see how error rate correlates with the memory usage:

```SQL
with joined as
(
    select
            time_bucket('30 minutes', span.start_time)  as "time",
            max(mem.value)::float8                      as "max_mem",
            count(trace_id)::float8                     as "num_errors"
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
)
select 
        corr(max_mem, num_errors) as correlation_factor
    from joined
```

First we've put our [join-query from above](#para-3-3) into a [CTE](https://www.postgresql.org/docs/current/queries-with.html) to improve the readability. This is necessary because PostgreSQL doesn't allow to use nested aggregate functions, thus we need to use a subquery to do what we intended here. We've also added type casts because the `corr` aggregate function expects `float8` (`double precision`) values.


## 3.5. Sorting <a name="para-3-5"></a>

Finally lets mention sorting the data based on `tag_map` column fields. No surprises here, since it behaves as standard PostgreSQL `jsonb` type, same rules apply when sorting. Namely, numeric fields will sort using numeric comparison: [1, 2, 10, 11] and text fields will sort using string comparison: ["1", "10", "11", "2"]

For example:

```SQL
select * 
    from span
    where start_time >= now() - interval'1 hour'
    order by span_tags -> 'pwlen'
```

The output will be sorted based on the value **and type** of `pwlen` 
