---
title: "Quick Start: Ruby and Timescale"
excerpt: Get started with Timescale Cloud or TimescaleDB using Ruby
keywords: [Ruby]
---

import QuickstartIntro from "versionContent/_partials/_quickstart-intro.mdx";

# Ruby quick start

<QuickstartIntro />

This quick start guide shows you how to:

*   [Connect to a Timescale service][connect]
*   [Create a hypertable][create-a-hypertable]
*   [Insert data][insert]
*   [Execute queries][query]
*   [Create continuous aggregates][create-aggregates]
*   [Add compression and retention policies][add-policies]

## Prerequisites

Before you start, make sure you have:

*   Created a Timescale service. For more information, see the
    [start up documentation][install]. Make a note of the `Service URL`,
    `Password`, and `Port` in the Timescale service that you created.
*   Installed [Rails][rails-guide].
*   Installed [psql to connect][psql-install] to the Timescale service.

## Connect to a Timescale service

In this section, you create a connection to your Timescale service through the Ruby
on Rails application.

<Procedure>

<Collapsible heading="Connect to Timescale" headingLevel={3}>

1.  Create a new Rails application configured to use PostgreSQL as the database.
    Your Timescale service works as a PostgreSQL extension.

    ```bash
    rails new my_app -d=postgresql
    ```

    Rails creates and bundles your application, and installs all
    required Gems in the process.

1.  Add the timescaledb gem to your Gemfile:

    ```ruby
    gem 'timescaledb'
    ```

1.  Run bundle install:

    ```bash
    bundle install
    ```

1.  Update `database.yml` located in the `my_app/config` directory with your Timescale service credentials:

    ```yaml
    default: &default
      adapter: postgresql
      encoding: unicode
      pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
      url: <%= ENV['DATABASE_URL'] %>

    development:
      <<: *default
      database: my_app_development

    test:
      <<: *default
      database: my_app_test

    production:
      <<: *default
      database: my_app_production
    ```

1.  Set the environment variable for `DATABASE_URL` to `<SERVICE_URL>` of
    the service:

    ```bash
    export DATABASE_URL="<SERVICE_URL>"
    ```

1.  Create the database and run migrations:

    ```bash
    rails db:create db:migrate
    ```

1.  Verify that TimescaleDB is installed by connecting to your service:

    ```bash
    echo "\dx" | rails dbconsole
    ```

    The result should show the TimescaleDB extension:

    ```bash
                                                       List of installed extensions
    Name         | Version |   Schema   |                                      Description
    ---------------------+---------+------------+---------------------------------------------------------------------------------------
    pg_stat_statements  | 1.10    | public     | track planning and execution statistics of all SQL statements executed
    plpgsql             | 1.0     | pg_catalog | PL/pgSQL procedural language
    timescaledb         | 2.9.3   | public     | Enables scalable inserts and complex queries for time-series data
    timescaledb_toolkit | 1.13.1  | public     | Library of analytical hyperfunctions, time-series pipelining, and other SQL  utilities
    ```

</Collapsible>

</Procedure>

## Create a hypertable

In this section, you'll create a hypertable to store page load data. We'll use the timescaledb gem's helpers to create and manage the hypertable.

<Procedure>

<Collapsible heading="Create a hypertable" headingLevel={3}>

1.  Generate a migration to create the page loads table:

    ```bash
    rails generate migration create_page_loads
    ```

   A new migration file `<migration-datetime>_create_page_loads.rb` is created in
   the `my_app/db/migrate` directory.

1.  Update the migration file in `db/migrate` with hypertable options:

    ```ruby
    class CreatePageLoads < ActiveRecord::Migration[7.0]
      def change
        hypertable_options = {
          time_column: 'created_at',
          chunk_time_interval: '1 day',
          compress_segmentby: 'path',
          compress_orderby: 'created_at',
          compress_after: '7 days',
          drop_after: '30 days'
        }

        create_table :page_loads, id: false, primary_key: [:created_at, :user_agent, :path], hypertable: hypertable_options do |t|
          t.timestamptz :created_at, null: false
          t.string :user_agent
          t.string :path
          t.float :performance
        end
      end
    end
    ```

    Note that the `id` column is not included in the table. This is because Timescale requires that any `UNIQUE` or `PRIMARY KEY` indexes on the table include all partitioning columns, which in this case is the time column. A new
    Rails model includes a `PRIMARY KEY` index for id by default, so you need to either remove the column or make sure that the index includes time as part of a "composite key."

    Check the official docs around [composite primary keys](https://guides.rubyonrails.org/active_record_composite_primary_keys.html) for more information.

1.  Create a PageLoad model in `app/models/page_load.rb`:

    ```ruby
    class PageLoad < ApplicationRecord
      extend Timescaledb::ActsAsHypertable
      include Timescaledb::ContinuousAggregatesHelper

      acts_as_hypertable time_column: "created_at",
        segment_by: "path",
        value_column: "performance"

      # Basic scopes for filtering by browser
      scope :chrome_users, -> { where("user_agent LIKE ?", "%Chrome%") }
      scope :firefox_users, -> { where("user_agent LIKE ?", "%Firefox%") }
      scope :safari_users, -> { where("user_agent LIKE ?", "%Safari%") }

      # Performance analysis scopes
      scope :performance_stats, -> { 
        select("stats_agg(#{value_column}) as stats_agg")
      }

      scope :slow_requests, -> { where("performance > ?", 1.0) }
      scope :fast_requests, -> { where("performance < ?", 0.1) }

      # Set up continuous aggregates for different timeframes
      continuous_aggregates scopes: [:performance_stats],
        timeframes: [:minute, :hour, :day],
        refresh_policy: {
          minute: {
            start_offset: '3 minute',
            end_offset: '1 minute',
            schedule_interval: '1 minute'
          },
          hour: {
            start_offset: '3 hours',
            end_offset: '1 hour',
            schedule_interval: '1 minute'
          },
          day: {
            start_offset: '3 day',
            end_offset: '1 day',
            schedule_interval: '1 minute'
          }
        }
    end
    ```

1.  Run the migration:

    ```bash
    rails db:migrate
    ```

</Collapsible>

</Procedure>

## Insert data

Now that we have our hypertable set up, let's insert some data. The timescaledb gem provides efficient ways to insert data into hypertables.

<Procedure>

<Collapsible heading="Insert data into Timescale" headingLevel={3}>

1.  Create a controller to handle page loads in `app/controllers/application_controller.rb`:

    ```ruby
    class ApplicationController < ActionController::Base
      around_action :track_page_load

      private

      def track_page_load
        start_time = Time.current
        yield
        end_time = Time.current
        
        PageLoad.create(
          path: request.path,
          user_agent: request.user_agent,
          performance: (end_time - start_time)
        )
      end
    end
    ```

1.  For testing purposes, you can also generate sample data:

    ```ruby
    def generate_sample_page_loads(total: 1000)
      time = 1.month.ago
      paths = %w[/ /about /contact /products /blog]
      browsers = [
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:89.0) Gecko/20100101 Firefox/89.0",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15"
      ]

      total.times.map do
        time = time + rand(60).seconds
        {
          path: paths.sample,
          user_agent: browsers.sample,
          performance: rand(0.1..2.0),
          created_at: time,
          updated_at: time
        }
      end
    end

    # Insert the data in batches
    PageLoad.insert_all(generate_sample_page_loads, returning: false)
    ```

</Collapsible>

</Procedure>

## Execute queries

The timescaledb gem provides several convenient scopes for querying your time-series data.

<Procedure>

<Collapsible heading="Execute queries" headingLevel={3}>

1.  Use built-in time-based scopes:

    ```ruby
    PageLoad.last_hour.count
    PageLoad.today.count
    PageLoad.this_week.count
    PageLoad.this_month.count
    ```

1.  Use browser-specific scopes:

    ```ruby
    # Count requests by browser
    PageLoad.chrome_users.last_hour.count
    PageLoad.firefox_users.last_hour.count
    PageLoad.safari_users.last_hour.count

    # Performance analysis
    PageLoad.slow_requests.last_hour.count
    PageLoad.fast_requests.last_hour.count
    ```

1.  Query continuous aggregates:

    ```ruby
    # Access aggregated performance stats through generated classes
    PageLoad::PerformanceStatsPerMinute.last_hour
    PageLoad::PerformanceStatsPerHour.last_day
    PageLoad::PerformanceStatsPerDay.last_month

    # Get statistics for a specific path
    stats = PageLoad::PerformanceStatsPerHour.last_day.where(path: '/products').select("average(stats_agg) as average, stddev(stats_agg) as stddev").first
    puts "Average: #{stats.average}"
    puts "Standard Deviation: #{stats.stddev}"
    ```

    This query fetches the average and standard deviation from the performance stats for the `/products` path over the last day.

</Collapsible>

</Procedure>

## Timescaledb features directly in your model

The timescaledb gem provides utility methods to access hypertable and chunk information. Every model that uses the `acts_as_hypertable` method has access to these methods. 

<Procedure>

<Collapsible heading="Access hypertable and chunk information" headingLevel={3}>

1.  View chunk or hypertable information:

    ```ruby
    PageLoad.chunks.count
    PageLoad.hypertable.detailed_size
    ```

1.  Compress/Decompress chunks:

    ```ruby
    PageLoad.chunks.uncompressed.first.compress!  # Compress the first uncompressed chunk
    PageLoad.chunks.compressed.first.decompress!  # Decompress the oldest chunk
    PageLoad.hypertable.compression_stats # View compression stats

    ```

</Collapsible>

<Collapsible heading="Access hypertable stats" headingLevel={3}>

Hypertable stats can be collected through various methods that provide insights into your hypertable's structure, size, and compression status:

1. Get basic hypertable information:

    ```ruby
    hypertable = PageLoad.hypertable
    hypertable.hypertable_name  # The name of your hypertable
    hypertable.schema_name      # The schema where the hypertable is located
    ```

1. Get detailed size information:

    ```ruby
    hypertable.detailed_size # Get detailed size information for the hypertable
    hypertable.compression_stats # Get compression statistics
    hypertable.chunks_detailed_size # Get chunk information
    hypertable.approximate_row_count # Get approximate row count
    hypertable.dimensions.map(&:column_name) # Get dimension information
    hypertable.continuous_aggregates.map(&:view_name) # Get continuous aggregate view names
    ```

</Collapsible>

<Collapsible heading="Access continuous aggregates" headingLevel={3}>

The `continuous_aggregates` method will generate a class for each continuous aggregate. To get all the continuous aggregate classes, you can use the `descendants` method.

```ruby
PageLoad.descendants # Get all continuous aggregate classes
```

To manually refresh a continuous aggregate, you can use the `refresh_aggregates` method.

```ruby
PageLoad.refresh_aggregates
```

To create or drop a continuous aggregate, you can use the `create_continuous_aggregate` and `drop_continuous_aggregate` methods.

```ruby
# migration scope
PageLoad.create_continuous_aggregates
PageLoad.drop_continuous_aggregates
```

It will create or drop all the continuous aggregates in the proper order to build them hierarchically.

See more about it works in this [blog post announcement](https://www.timescale.com/blog/building-a-better-ruby-orm-for-time-series-and-analytics).

</Collapsible>

</Procedure>

Next steps:

* [Learn more about the timescaledb gem](https://github.com/timescale/timescaledb-ruby)
* [Check out official docs](https://timescale.github.io/timescaledb-ruby/)
* [Try the LTTB tutorial](https://timescale.github.io/timescaledb-ruby/toolkit_lttb_tutorial/)
* [Check out the toolkit tutorial](https://timescale.github.io/timescaledb-ruby/toolkit_tutorial/)
* [Check out the Rails tutorial](https://timescale.github.io/timescaledb-ruby/rails_tutorial/)

[connect]: #connect-to-timescaledb
[create-a-hypertable]: #create-a-hypertable
[insert]: #insert-data
[query]: #execute-queries
[create-aggregates]: #execute-queries
[add-policies]: #manage-chunks-and-compression
[manage-chunks]: #manage-chunks-and-compression
[install]: /getting-started/latest/
[psql-install]: /use-timescale/:currentVersion:/integrations/psql/
[rails-guide]: https://guides.rubyonrails.org/getting_started.html
