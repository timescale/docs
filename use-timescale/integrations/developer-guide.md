# Contributing to Timescale Integrations

This guide provides examples of how to integrate TimescaleDB with other technologies.

Not sure what TimescaleDB is? Watch [TimescaleDB in 100 seconds](https://www.youtube.com/watch?v=69Tzh_0lHJ8) 🍿

## Integrating with a database

Timescale technologies are plain PostgreSQL extensions. So, any integration with TimescaleDB, PGAI, Toolkit, etc. can assume it inherits the PostgreSQL consistency and behavior.

### Testing the integration

To easily test the integration, you can use [timescale cloud](https://www.timescale.com/cloud). Sign up for a free account and create a new database.
Use the closest region to your location, it will provide the best performance. You can also setup VPC peering to your private network if necessary to have extra security.

If you prefer to go the local route, you can use the `timescaledb-ha` docker image.

The docker image  can be an esay option to test the integration. It has a local postgres instance and the timescaledb extension already installed and it brings all the dependencies needed.

You can also sign up for a free [timescale cloud](https://www.timescale.com/cloud) account and create a new database.

## Extension

The extension is the core of TimescaleDB. Depending on the host, the installation process is different. In the default docker image suggested above, the extension is already installed.

### Is timescaledb installed?

So, users can easily start because they already have a postgres database and just need to install the extension and enable it.

```sql
CREATE EXTENSION timescaledb;
```

To check if the version of the extension is compatible with the version of TimescaleDB that the integration is tested against, you can run the following query:   

```sql
SELECT default_version, installed_version FROM pg_available_extensions WHERE name = 'timescaledb';
```

In case the user has not installed the extension, the `installed_version` will be `NULL`.

Same check can be done for [pgai](https://github.com/timescale/pgai) and [toolkit](https://github.com/timescale/timescaledb-toolkit).

### Hypertables

The [hypertable](https://docs.timescale.com/use-timescale/latest/hypertables/) automatically extends a PostgreSQL table to an abstract table. Making the original table a time series table, and adding the necessary metadata to it.

To create a hypertable, let's create a example to track the prices of stocks:

```sql
CREATE TABLE stock_prices (
    time TIMESTAMPTZ NOT NULL,
    symbol TEXT NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    volume BIGINT NOT NULL
);
```

Now, let's create the hypertable to automatically partition the data by time:

```sql
SELECT create_hypertable('stock_prices', by_range('time', interval '1 day'));
```

In this case, the `stock_prices` table will be partitioned by time into tables (known as chunks) of 1 day.

Hypertables are fully compatible with PostgreSQL. So, any query that you can run against a normal table, you can run it against a hypertable. It will parallelize the query across the chunks, and ignore the chunks that are not needed.

### Inserting data

Let's create 1 week of hourly data for the stock price of Apple with a single insert statement:

```sql
INSERT INTO stock_prices (time, symbol, price, volume)  
SELECT generate_series(now() - interval '1 week', now(), interval '1 hour') AS time,
       'AAPL' AS symbol,
       random() * 100 AS price,
       random() * 1000 AS volume;
```

Now we have 1 week of data in the `stock_prices` table. In fact it created 7 chunks, one for each day.

Even inserting in the main table, the timescaledb extension will automatically partition the data by time into chunks of 1 day. It will also detect the time column and create the necessary metadata to it. It adds a default index to the time column, which will be one index per chunk.

#### Hypertable Metadata

As users adopts hypertables, the timescaledb extension will create the necessary metadata to it.
To check what hypertables are available, you can run the following query:

```sql
SELECT * FROM timescaledb_information.hypertables;
```

#### Hypertable Dimensions

The dimensions are stored on a different table than the hypertable itself. To access the metadata of the `by_range` hypertables, you can run the following query:

```sql
SELECT * FROM timescaledb_information.dimensions WHERE hypertable_name = 'stock_prices';
```

Most of the times a hypertable has only one dimension, the time dimension. But it can have multiple dimensions if the data is partitioned by more than one column.

#### Hypertable Metadata

All metadata from timescaledb are friendly available in the `timescaledb_information` schema. It brings a lot of information about the hypertables, chunks, compression, jobs, retention policies, etc.


The most fresh data is stored in the most recent chunk. As chunks are getting older, they can enable compression to save disk space and also improve the query performance. They can also discard old data to save disk space using [retention policies](https://docs.timescale.com/api/latest/data-retention/add_retention_policy/). Similarly, you can enable continuous aggregates to pre-compute and store the results of complex queries, and then query the continuous aggregates instead of running the complex queries.

#### Hypertable Chunks

To check the chunks of a hypertable, you can run the following query:

```sql
SELECT * FROM timescaledb_information.chunks WHERE hypertable_name = 'stock_prices';
``` 

Learn more about the chunks in the [Chunks documentation](https://docs.timescale.com/api/latest/informational-views/chunks/).


### Continuous aggregates

A highly adopted feature of TimescaleDB is the [continuous aggregates](https://docs.timescale.com/use-timescale/latest/continuous-aggregates/create-a-continuous-aggregate/). They are materialized views that are continuously updated with the latest data. They are a powerful feature to pre-compute and store the results over time.

Creating simple continuous aggregates is straightforward. Let's create a continuous aggregate to store the average price of the stocks:

```sql
CREATE MATERIALIZED VIEW hourly_stock_prices WITH (timescaledb.continuous) AS
SELECT time_bucket('1 hour', time) as bucket,
       symbol,
       avg(price) as avg_price
FROM stock_prices
GROUP BY bucket, symbol;
```

The underlying implementation is a hypertable itself. So, any query that you can run against a normal materialized view, you can run it against a continuous aggregate. You can also enable compression and retention policies on continuous aggregates to save disk space.

It can also recognize updates and delete operations and automatically update the continuous aggregate. Making the continuous aggregate a real-time view of the data.

The users can recursively create continuous aggregates on top of a continuous aggregate. Making it a powerful feature to pre-compute and store the results of complex queries over time.

### Hyperfunctions and Timescaledb toolkit

The hierarchical data model of hypertables requires some mathematical functions to compose functions over time. As some mathematical functions like "average of the average" is not exactly the same as "average", the [TimescaleDB toolkit](https://github.com/timescale/timescaledb-toolkit) resolves this by bringing a set of SQL functions that are designed to work with time-series data.

Most of the functions can roll up data from a hypertable to a continuous aggregate when the data is updated over time. They can also roll in a window of time.

The [stats_agg](https://docs.timescale.com/api/latest/hyperfunctions/statistical-and-regression-analysis/stats_agg-one-variable/)
function is a good example. It can compute the average of 1 day rolling out data from another continuous aggregate that stores the average of 1 hour data.
Let's create an example of how to use it:

```sql
CREATE MATERIALIZED VIEW hourly WITH (timescaledb.continuous) AS
SELECT time_bucket('1 hour', time) as bucket,
       symbol,
       stats_agg(price) as stats_price,
       candlestick_agg(time, price, volume) as candlestick_price
FROM stock_prices
GROUP BY bucket, symbol;
```
Now let's create a continuous aggregate to store the average of the average price of the stocks:

```sql
CREATE MATERIALIZED VIEW daily WITH (timescaledb.continuous) AS
SELECT time_bucket('1 day', time) as bucket,
       symbol,
       stats_agg(stats_price) as avg_price,
       rollup(candlestick_price) as candlestick_price
FROM hourly
GROUP BY bucket, symbol;
```

Learn more about the hyperfunctions in the [Hyperfunctions documentation](https://docs.timescale.com/api/latest/hyperfunctions/).

### Enable compression

Compressing hypertables can save disk space and improve the query performance. To enable compression, you can run the following query:

```sql
ALTER TABLE stock_prices SET (timescaledb.compress);
```

Now, compression is enabled but no compression policy was defined. A policy can make compression automatic.

You can check the compression settings of a hypertable with the following query:

```sql
SELECT * FROM timescaledb_information.compression_settings WHERE hypertable_name = 'stock_prices';
```

To enable a compression policy, you can run the following query:

```sql
SELECT add_compression_policy('stock_prices', INTERVAL '1 month');
```

If you enable a compression policy, the compression will be applied automatically to the chunks of the hypertable. The process will be triggered by a background job.

You can check the status of the job with the following query:

```sql
SELECT * FROM timescaledb_information.jobs
  WHERE proc_name='policy_compression'
   and hypertable_name = 'stock_prices';
```

The compression stats can be checked with the following query:

```sql
SELECT * FROM hypertable_compression_stats('stock_prices');
```

Learn more about the compression stats in the [Compression Stats documentation](https://docs.timescale.com/api/latest/compression/hypertable_compression_stats/).

Learn more about the compression in the [Compression documentation](https://docs.timescale.com/use-timescale/latest/compression/).


### Infrastructure & Monitoring

If you're integrating as a monitoring solution, intending to monitor the postgres instance, you can start exploring the resume brought by the [telemetry report](https://docs.timescale.com/api/latest/administration/#get_telemetry_report):

```sql
SELECT get_telemetry_report();
```

It gives you a good overview of the postgres instance and the TimescaleDB extension.

## Integrating with charting libraries


If you're integrating with a charting library, in most cases you'll be querying the continuous aggregates. Most of the times, you'll be using the [hyperfunctions](https://docs.timescale.com/api/latest/hyperfunctions/) to pre-compute the data.

You can also save network bandwidth and processing power by [downsampling](https://docs.timescale.com/api/latest/hyperfunctions/downsampling/) the data before querying it.

If you're integrating with a charting library, please, add a screenshot to the README.md file.

Make sure to add the charting library logo to the `assets` folder.

On the `manifest.yml` file, add the category `charts` to the integration.

Learn about [time_bucket](https://docs.timescale.com/api/latest/hyperfunctions/time_bucket/) in the hyperfunctions documentation.

Also, check the [candlestick_agg](https://docs.timescale.com/api/latest/hyperfunctions/candlestick_agg/) and [rollup](https://docs.timescale.com/api/latest/hyperfunctions/rollup/) functions.

Every aggregation function in the toolkit has a corresponding `_agg` function. Also, these functions have several accessors to get the result in different formats.

For example, the `stats_agg` type has the following functions:

- `avg`
- `count`
- `max`
- `min`
- `stddev`
- `variance`
  
For the `candlestick_agg` type, the following functions are available:

- `open`
- `high`
- `low`
- `close`
- `volume`
- `vwap`
- `open_time`
- `close_time`
- `high_time`
- `low_time`

To access the result of the aggregation functions, you can use the corresponding accessor functions. For example, to get the average price, you can use the `avg` accessor:

```sql
SELECT time_bucket, avg(stats_price)
 FROM daily
 WHERE symbol = 'AAPL'
 and time > now() - interval '1 week';
```

To get the OHLCV of the candlestick, you can use the `open`, `high`, `low`, `close` and `volume` accessors:

```sql
SELECT time_bucket,
       open(candlestick_price),
       high(candlestick_price),
       low(candlestick_price),
       close(candlestick_price),
       volume(candlestick_price)
 FROM daily
 WHERE symbol = 'AAPL'
 and time > now() - interval '1 week';
```

Learn more about the accessor functions in the [Hyperfunctions documentation](https://docs.timescale.com/api/latest/hyperfunctions/).

### Metadata from continuous aggregates

You may want to dig deeper into the continuous aggregate metadata. You can get the view definition with the following query:

```sql
SELECT view_definition
 FROM timescaledb_information.continuous_aggregates
 WHERE hypertable_name = 'stock_prices'
   AND view_name = 'daily';
```

You can also get refresh jobs information of the continuous aggregate with the following query:

```sql
SELECT * FROM timescaledb_information.jobs
 WHERE proc_name = 'policy_refresh_continuous_aggregate';
```

In some cases, the metadata will be using the hypertable_id which is a internal identifier. You can get the hypertable name with the following query:

```sql
SELECT config
 FROM timescaledb_information.jobs
 WHERE proc_name = 'policy_refresh_continuous_aggregate'
   AND config->>'mat_hypertable_id' IN (
     SELECT mat_hypertable_id
     FROM _timescaledb_catalog.continuous_agg
     WHERE user_view_name = 'daily'
   );
```

The `_timescaledb_catalog` schema is the internal catalog of TimescaleDB. It stores the metadata of the hypertables, continuous aggregates, jobs, etc.

The `timescaledb_information` schema is the public friendly schema that brings the information of the hypertables, chunks, compression, jobs that are in the catalog.

# Integrating with ORMs

The most feature complete work is done in the Ruby language with the [TimescaleDB Gem](https://github.com/timescale/timescaledb-ruby).

This gem allows you to use TimescaleDB with ActiveRecord. It supports Rails and non-Rails projects.

The gem is fully compatible with TimescaleDB. It supports hypertables, compression, continuous aggregates, etc.

## Migrations

The gem supports migrations to create the hypertables and continuous aggregates.
During the hypertable creation, it's also possible to setup compression and retention policies.


```ruby
hypertable_options = {
  time_column: 'created_at',
  chunk_time_interval: '1 min',
  compress_segmentby: 'identifier',
  compression_interval: '7 days'
}

create_table(:events, id: false, hypertable: hypertable_options) do |t|
  t.string :identifier, null: false
  t.jsonb :payload
  t.timestamps
end

Event.create_continuous_aggregates
```

Note that `create_continuous_aggregates` is a helper method that will create the continuous aggregate for all the time buckets defined in the model via `continuous_aggregate` macro. More details about the macro below.

### Schema dumper

Most of the ORMs organize the schema in a single file. The gem also includes a schema dumper to dump the schema to the migrations.
The schema dumper includes all TimescaleDB specific features, like hypertables, continuous aggregates, compression, etc.

It's very useful to replicate the schema to a new database or to a development environment.

In the case of Rails, the schema dumper will dump the schema to the `db/schema.rb` file. The main changes will be the hypertables and continuous aggregates.

After the table is created, the `create_hypertable` call should be added to the migration. The extra configurations and settings for compression, retention policies, etc. will be dumped to the migration.

The `create_continuous_aggregates` is also called in the migration file to create each continuous aggregate independently. It also respects the dependencies between the continuous aggregates.

## Models

ORMs are mapping Models to the Tables. They often aggregate metadata and logic around the model to ease the usage.

With a few macros, the gem allows you to create the models easily. Let's start with the abstract class to define the hypertable.

```ruby
class Hypertable < ActiveRecord::Base
  self.abstract_class = true

  extend Timescaledb::ActsAsHypertable
  extend Timescaledb::ActsAsTimeVector
  include Timescaledb::ContinuousAggregatesHelper
end
```

Now, the events model can be defined with the following code:

```ruby
class Event < Hypertable
  acts_as_hypertable time_column: "created_at",
    segment_by: "identifier"
end
```

The macros will help to handle extra information about the hypertable and time vector. The information can be accessed at any time in the model.

```ruby
Event.time_column # => :created_at
Event.segment_by_column # => :identifier
```

### The `continuous_aggregate` macro

The `continuous_aggregate` macro will store metadata about the continuous aggregate in the model. It can help you to inject all the repetitive SQL code in a single place.

The continuous aggregate will be created during the migration but this definition will help to also have all the information in a single place. Allowing the model to also access the continuous aggregates data.

```ruby
class Event < Hypertable
  acts_as_hypertable time_column: "created_at",
    segment_by: "identifier"

  scope :count_clicks, -> { where(identifier: "click").select("count(*)::bigint as total") }
  scope :count_views, -> { where(identifier: "view").select("count(*)::bigint as total") }

  continuous_aggregate scopes: [:clicks, :views], timeframes: [:hour, :day, :month]
end
```

In this definition, several views will be defined, crossing all time frames and scopes on independent views.

The materialized view names follows the following pattern:

```
<model_name>_<scope>_by_<timeframe>
```

The model will also be generated for every scope and timeframe. It will follow the following pattern:

```
<model_name>::<scope>By<timeframe>
```

The continuous aggregate will be created during the migration but this definition will help to also have all the information in a single place. Allowing the model to also access the continuous aggregates data.

## Scopes and rollups

Scopes are pretty common in ActiveRecord. They are used to organize the queries in a single place. Timescaledb extensions brings the `time_bucket` hyperfunction to the scopes using the `rollup` method.

For example, to get the number of clicks per hour, you can run the following query:

```ruby
Event.count_clicks.rollup(:hour)
```

The `rollup` is a scope that will inject the `time_bucket` hyperfunction to the query. It will also recognize the segment_by configuration of the model to segment the data by the correct column.

## Nested models

For every scope and timeframe defined in the `continuous_aggregate` macro, a nested model will be generated to query data from the continuous aggregate.

```ruby
Event::CountClicksByHour.first.total
Event::CountClicksByDay.first.total
Event::CountClicksByMonth.first.total
Event::CountViewsByHour.first.total
# ...
```

Remember that the nested models are materialized views. So, they are read-only. They're also automatically refreshed by a background job when a refresh policy is defined. In case it's not defined, the nested model will not be refreshed.

The manual refresh of the nested models can be done with the `refresh_aggregates` method.

```ruby
Event.refresh_aggregates
```

This will refresh all the nested models.

## Hypertable metadata

All hypertable metadata can also be accessed in the model.

```ruby
Event.hypertable.attributes
# => {"hypertable_schema"=>"public",
#     "hypertable_name"=>"events",
#     "owner"=>"tsdbadmin",
#     "num_dimensions"=>1,
#     "num_chunks"=>6,
#     "compression_enabled"=>true}
```

### Compression stats

The compression stats can be accessed in the hypertable metadata.

```ruby
Event.hypertable.compression_stats
# => #<OpenStruct total_chunks=6,
#     number_compressed_chunks=0,
#     before_compression_table_bytes=nil,
#     before_compression_index_bytes=nil,
#     before_compression_toast_bytes=nil,
#     before_compression_total_bytes=nil,
#     after_compression_table_bytes=nil,
#     after_compression_index_bytes=nil,
#     after_compression_toast_bytes=nil,
#     after_compression_total_bytes=nil,
#     node_name=nil>
```

## Chunk operations

The gem also allows to execute operations in the chunks. For example, compress a chunk:

```ruby
Event.hypertable.chunks.first.compress!
```

Checking the compression stats after the compression:

```ruby
Event.hypertable.compression_stats
# => #<OpenStruct total_chunks=6,
#     number_compressed_chunks=1,
#     before_compression_table_bytes=8192,
#     before_compression_index_bytes=16384,
#     before_compression_toast_bytes=8192,
#     before_compression_total_bytes=32768,
#     after_compression_table_bytes=16384,
#     after_compression_index_bytes=16384,
#     after_compression_toast_bytes=8192,
#     after_compression_total_bytes=40960,
#     node_name=nil>
```

## User Defined Actions / Jobs

User can define their own actions to be executed in a cron schedule. These actions are called jobs. A compression, a retenttion policy, a continuous aggregate refresh are good examples.

You can check the jobs that are available with the following query:

```sql
SELECT * FROM timescaledb_information.jobs;
```

If you're having trouble with the jobs, you can check the status of the jobs with the following query:

```sql
SELECT * FROM timescaledb_information.job_stats;
```

You can also get the job errors with the following query:

```sql
SELECT * FROM timescaledb_information.job_errors;
```

Learn more about the job stats and job errors in the [Job Stats documentation](https://docs.timescale.com/api/latest/informational-views/job_stats/) and [Job Errors documentation](https://docs.timescale.com/api/latest/informational-views/job_errors/).

## Guidelines

Timescale is very open to integrations. We're always looking for new integrations. We're always open for co-marketing opportunities and we'll be very happy to help you with the integration.

The integration should be useful for:

- The TimescaleDB community.
- The open-source community.
- The technology it integrates with.

The integration should be self-contained and include:

- A README.md file with the integration instructions.
- A .envrc.example file to set the environment variables needed for the integration.

Sometimes the integration will require additional dependencies. In that case, please, add them to the README.md file. We'll try to keep the list of dependencies minimal and useful.

## Testing

We recommend adding a minimal script to the integration folder to test the integration. This script should at least test the happy path.

## Packaging

If your integration requires additional sources or packaging, please, add it to the README.md file. The repository here is dedicated to integration examples, so we'll try to keep the dependencies minimal.
