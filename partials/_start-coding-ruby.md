---
title: "Quick Start: Ruby and Timescale"
excerpt: Get started with Timescale Cloud or TimescaleDB using Ruby
keywords: [Ruby]
---

import QuickstartIntro from "versionContent/partials/_quickstart-intro.mdx";
import IntegrationPrereqs from "versionContent/partials/_integration-prereqs.mdx";

## Prerequisites

<IntegrationPrereqs />

*   Install [Rails][rails-guide].

## Connect a Rails app to your $SERVICE_SHORT 

Every $SERVICE_LONG is a 100% PostgreSQL database hosted in $CLOUD_LONG with
$COMPANY extensions such as $TIMESCALE_DB. You connect to your $SERVICE_LONG
from a standard Rails app configured for PostgreSQL. 

<Procedure>

1.  **Create a new Rails app configured for PostgreSQL**

    Rails creates and bundles your app, then installs the standard PostgreSQL Gems.

    ```bash
    rails new my_app -d=postgresql
    cd my_app
    ```

1. **Install the TimescaleDB gem**

   1.  Open `Gemfile`, add the following line, then save your changes:

       ```ruby
       gem 'timescaledb'
       ```

   1. In Terminal, run the following command:
   
      ```bash
      bundle install
      ```

1. **Connect your app to your $SERVICE_LONG**

   1.  In `<my_app_home>/config/database.yml` update the configuration to read securely connect to your $SERVICE_LONG
       by adding `url: <%= ENV['DATABASE_URL'] %>` to the default configuration:

       ```yaml
       default: &default
         adapter: postgresql
         encoding: unicode
         pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
         url: <%= ENV['DATABASE_URL'] %>
       ```

   1.  Set the environment variable for `DATABASE_URL` to the value of `Service URL` from
       your [connection details][connection-info]
       ```bash
       export DATABASE_URL="value of Service URL"
       ```

   1. Create the database:
      - **$CLOUD_LONG**: nothing to do. The database is part of your $SERVICE_LONG.  
      - **self-hosted TimescaleDB**, create the database for the project:

          ```bash
          rails db:create
          ```

   1.  Run migrations:

       ```bash
       rails db:migrate
       ```

   1.  Verify the connection from your app to your $SERVICE_LONG:

       ```bash
       echo "\dx" | rails dbconsole
       ```

       The result shows the list of extensions in your $SERVICE_LONG

      |  Name  | Version | Schema | Description  |                                       
      | --  | -- | -- | -- |
      | pg_buffercache      | 1.5     | public     | examine the shared buffer cache| 
      | pg_stat_statements  | 1.11    | public     | track planning and execution statistics of all SQL statements executed| 
      | plpgsql             | 1.0     | pg_catalog | PL/pgSQL procedural language| 
      | postgres_fdw        | 1.1     | public     | foreign-data wrapper for remote PostgreSQL servers| 
      | timescaledb         | 2.18.1  | public     | Enables scalable inserts and complex queries for time-series data (Community Edition)| 
      | timescaledb_toolkit | 1.19.0  | public     | Library of analytical hyperfunctions, time-series pipelining, and other SQL utilities| 

</Procedure>

## Optimize time-series data in hypertables

Hypertables are PostgreSQL tables designed to simplify and accelerate data analysis. Anything 
you can do with regular PostgreSQL tables, you can do with hypertables - but much faster and more conveniently.

In this section, you use the helpers in the timescaledb gem to create and manage a [hypertable][about-hypertables].

<Procedure>

1.  **Generate a migration to create the page loads table**

    ```bash
    rails generate migration create_page_loads
    ```

   This creates the `<my_app_home>/db/migrate/<migration-datetime>_create_page_loads.rb` migration file.

1. **Add hypertable options** 

   Replace the contents of `<my_app_home>/db/migrate/<migration-datetime>_create_page_loads.rb` 
   with the following:

    ```ruby
    class CreatePageLoads < ActiveRecord::Migration[8.0]
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

    The `id` column is not included in the table. This is because $TIMESCALE_DB requires that any `UNIQUE` or `PRIMARY KEY` 
    indexes on the table include all partitioning columns. In this case, this is the time column. A new
    Rails model includes a `PRIMARY KEY` index for id by default: either remove the column or make sure that the index 
    includes time as part of a "composite key."

   For more information, check the Roby docs around [composite primary keys][rails-compostite-primary-keys].

1.  **Create a `PageLoad` model**

    Create a new file called `<my_app_home>/app/models/page_load.rb` and add the following code:

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

1.  **Run the migration**

    ```bash
    rails db:migrate
    ```

</Procedure>

## Insert data your $SERVICE_SHORT

The timescaledb gem provides efficient ways to insert data into hypertables. This section 
shows you how to ingest test data into your hypertable.

<Procedure>

1.  **Create a controller to handle page loads**

    Create a new file called `<my_app_home>/app/controllers/application_controller.rb` and add the following code:

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

1.  **Generate some test data**

    Use `bin/console` to join a Rails console session and run the following code
    to define some random page load access data:

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
    ```

1. **Insert the generated data into your $SERVICE_LONG**

    ```bash
    # Insert the data in batches
    PageLoad.insert_all(generate_sample_page_loads, returning: false)
   ```

1.  **Validate the test data in your $SERVICE_LONG**

   ```bash
   PageLoad.count
   PageLoad.first
   ```

</Procedure>

## Reference

This section lists the most common tasks you might perform with the timescaledb gem.

### Query scopes

The timescaledb gem provides several convenient scopes for querying your time-series data.


- Built-in time-based scopes:

    ```ruby
    PageLoad.last_hour.count
    PageLoad.today.count
    PageLoad.this_week.count
    PageLoad.this_month.count
    ```

- Browser-specific scopes:

    ```ruby
    # Count requests by browser
    PageLoad.chrome_users.last_hour.count
    PageLoad.firefox_users.last_hour.count
    PageLoad.safari_users.last_hour.count

    # Performance analysis
    PageLoad.slow_requests.last_hour.count
    PageLoad.fast_requests.last_hour.count
    ```

- Query continuous aggregates:

  This query fetches the average and standard deviation from the performance stats for the `/products` path over the last day.

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

### Timescaledb features

The timescaledb gem provides utility methods to access hypertable and chunk information. Every model that uses 
the `acts_as_hypertable` method has access to these methods. 


#### Access hypertable and chunk information

- View chunk or hypertable information:

    ```ruby
    PageLoad.chunks.count
    PageLoad.hypertable.detailed_size
    ```

- Compress/Decompress chunks:

    ```ruby
    PageLoad.chunks.uncompressed.first.compress!  # Compress the first uncompressed chunk
    PageLoad.chunks.compressed.first.decompress!  # Decompress the oldest chunk
    PageLoad.hypertable.compression_stats # View compression stats

    ```

#### Access hypertable stats

You collect hypertable stats using methods that provide insights into your hypertable's structure, size, and compression 
status:

- Get basic hypertable information:

    ```ruby
    hypertable = PageLoad.hypertable
    hypertable.hypertable_name  # The name of your hypertable
    hypertable.schema_name      # The schema where the hypertable is located
    ```

- Get detailed size information:

    ```ruby
    hypertable.detailed_size # Get detailed size information for the hypertable
    hypertable.compression_stats # Get compression statistics
    hypertable.chunks_detailed_size # Get chunk information
    hypertable.approximate_row_count # Get approximate row count
    hypertable.dimensions.map(&:column_name) # Get dimension information
    hypertable.continuous_aggregates.map(&:view_name) # Get continuous aggregate view names
    ```

#### Continuous aggregates 

The `continuous_aggregates` method generates a class for each continuous aggregate.

- Get all the continuous aggregate classes:

   ```ruby
   PageLoad.descendants # Get all continuous aggregate classes
   ```

- Manually refresh a continuous aggregate:

   ```ruby
   PageLoad.refresh_aggregates
   ```

- Create or drop a continuous aggregate:

  Create or drop all the continuous aggregates in the proper order to build them hierarchically. See more about how it
  works in this [blog post][ruby-blog-post].

   ```ruby
   PageLoad.create_continuous_aggregates
   PageLoad.drop_continuous_aggregates
   ```

   


## Next steps

Now that you have integrated the ruby gem into your app:

* Learn more about the [timescaledb gem](https://github.com/timescale/timescaledb-ruby).
* Check out the [official docs](https://timescale.github.io/timescaledb-ruby/).
* Follow the [LTTB][LTTB], [Open AI long-term storage][open-ai-tutorial], and [candlesticks][candlesticks] tutorials.

[connect]: #connect-to-timescaledb
[create-a-hypertable]: #create-a-hypertable
[insert]: #insert-data
[query]: #execute-queries
[create-aggregates]: #execute-queries
[add-policies]: #manage-chunks-and-compression
[manage-chunks]: #manage-chunks-and-compression
[install]: /getting-started/latest/
[psql-install]: /integrations/:currentVersion:/psql/
[rails-guide]: https://guides.rubyonrails.org/install_ruby_on_rails.html#installing-rails
[connection-info]: /integrations/:currentVersion:/find-connection-details/
[about-hypertables]: /use-timescale/:currentVersion:/hypertables/
[rails-compostite-primary-keys]: https://guides.rubyonrails.org/active_record_composite_primary_keys.html
[ruby-blog-post]: https://www.timescale.com/blog/building-a-better-ruby-orm-for-time-series-and-analytics
[LTTB]: https://timescale.github.io/timescaledb-ruby/toolkit_lttb_tutorial/
[open-ai-tutorial]: https://timescale.github.io/timescaledb-ruby/chat_gpt_tutorial/
[candlesticks]: https://timescale.github.io/timescaledb-ruby/toolkit_candlestick/
