---
title: "Quick Start: Ruby and TimescaleDB"
excerpt: Get started with TimescaleDB for a Ruby application
keywords: [Ruby]
---

import QuickstartIntro from "versionContent/_partials/_quickstart-intro.mdx";

# Ruby quick start

<QuickstartIntro />

This quick start guide walks you through:

*   [Connecting to TimescaleDB][connect]
*   [Creating a relational table][create-table]
*   [Creating a hypertable][create-hypertable]
*   [Inserting data][insert]
*   [Executing a query][query]

## Prerequisites

Before you start, make sure you have:

*   Installed TimescaleDB. For more information, see the
    [installation documentation][install]. Make a note of the `Service URL`,
    `Password`, and `Port` in the TimescaleDB Cloud instance that you created.
*   Installed [Rails][rails-guide].
*   Installed [psql to connect][psql-install] to TimescaleDB.

<Highlight type="cloud" header="Run all tutorials free" button="Try for free">
Your Timescale trial is completely free for you to use for the first
thirty days. This gives you enough time to complete all the tutorials and run
a few test projects of your own.
</Highlight>

## Connect to TimescaleDB

In this section, you create a connection to TimescaleDB Cloud through the Ruby
on Rails application.

<Procedure>

<Collapsible heading="Connecting to TimescaleDB" headingLevel={3}>

1.  Create a new Rails application configured to use PostgreSQL as the database.
    TimescaleDB is a PostgreSQL extension.

    ```bash
    rails new my_app -d=postgresql
    ```

    Rails creates and bundles your application, and installs all
    required Gems in the process.

1.  Update `port` in the `database.yml` located in the `my_app/config`
    directory with `<PORT>` of the TimescaleDB Cloud instance.

1.  Set the environment variable for `DATABASE_URL` to `<SERVICE_URL>` of
    TimescaleDB Cloud. For example in a `ZSH` shell edit the `~/.zshrc` file with:

    ```bash
    export DATABASE_URL="<SERVICE_URL>"
    ```

1.  Save the `~/.zshrc` file and load the environment variables using:

    ```bash
    source ~/.zshrc
    ```

1.  Add TimescaleDB to Rails migration:

    ```ruby
    rails generate migration add_timescale
    ```

    A new migration file `<migration-datetime>_add_timescale.rb` is created in
    the `my_app/db/migrate` directory.

1.  Update the contents of the `<migration-datetime>_add_timescale.rb` file with
    these instructions to load the TimescaleDB extension to PostgreSQL:

    ```ruby
    class AddTimescale < ActiveRecord::Migration[7.0]
      def change
       create_table :page_loads, id: false do |t|
          t.string :user_agent

          t.timestamps
       end
      end
    end
    ```

1.  Add the TimescaleDB extension to the PostgreSQL database:

    ```ruby
       rails db:migrate
    ```

1.  Connect to TimescalDB Cloud using Rails:

    ```bash
    echo "\dx" | rails dbconsole
    ```

    If the connection is successful, you are prompted for the password to
    connect to TimescaleDB. Type the `<PASSWORD>` for `tsdbadmin` in the
    TimescaleDB Cloud.

    The result is similar to this:

    ```bash
                                                       List of installed extensions
    Name         | Version |   Schema   |                                      Description
    ---------------------+---------+------------+---------------------------------------------------------------------------------------
    pg_stat_statements  | 1.10    | public     | track planning and execution statistics of all SQL statements executed
    plpgsql             | 1.0     | pg_catalog | PL/pgSQL procedural language
    timescaledb         | 2.9.3   | public     | Enables scalable inserts and complex queries for time-series data
    timescaledb_toolkit | 1.13.1  | public     | Library of analytical hyperfunctions, time-series pipelining, and other SQL  utilities
    (4 rows)
    ```

    <Highlight type="important">
    To ensure that your tests run successfully, in the
    `config/environments/test.rb` file, add
    `config.active_record.verify_foreign_keys_for_fixtures = false`.
    Otherwise you get an error because TimescaleDB uses internal foreign keys.
    </Highlight>

</Collapsible>

</Procedure>

## Create a relational table

In this section, you create a table to store the user agent or browser and time
when a visitor loads a page. You could easily extend this simple example to
store a host of additional web analytics of interest to you.

<Procedure>

<Collapsible heading="Creating a relational table" headingLevel={3}>

1.  Generate a Rails scaffold to represent the user agent information in a table:

    ```ruby
    rails generate scaffold PageLoads user_agent:string
    ```

   A new migration file `<migration-datetime>_create_page_loads.rb` is created in
   the `my_app/db/migrate` directory.
   TimescaleDB requires that any `UNIQUE` or `PRIMARY KEY` indexes on the table
   include all partitioning columns, which in this case is the time column. A new
   Rails model includes a `PRIMARY KEY` index for id by default, so you need to
   either remove the column or make sure that the index includes time as part of
   a "composite key."

  Composite keys aren't supported natively by Rails, but if you need to keep
  your `id` column around for some reason you can add support for them with
  the [`composite_primary_keys` gem](https://github.com/composite-primary-keys/composite_primary_keys).

1.  Change the migration code in the `<migration-datetime>_create_page_loads.rb`
    file located at the `my_app/db/migrate` directory to:

    ```ruby
        class CreatePageLoads < ActiveRecord::Migration[7.0]
         def change
         create_table :page_loads, id: false do |t|
           t.string :user_agent

           t.timestamps
         end
       end
     end
    ```

    Rails generates all the helper files and a database migration.
1.  Create the table in the database:

    ```ruby
    rails db:migrate
    ```

1.  Confirm that the table exists using and the model is properly mapped using:

    ```ruby
    rails runner 'p PageLoad.count'
    0
    ```

1.  View the structure of the `page_loads` table in the `rails dbconsole` output:

    ```ruby
    echo "\d page_loads" | rails dbconsole
    ```

    The result is similar to:

    ```ruby
                                 Table "public.page_loads"
        Column   |              Type              | Collation | Nullable | Default
     ------------+--------------------------------+-----------+----------+---------
      user_agent | character varying              |           |          |
      created_at | timestamp(6) without time zone |           | not null |
      updated_at | timestamp(6) without time zone |           | not null |
    ```

</Collapsible>

</Procedure>

## Create a hypertable

When you have created the relational table, you can create a hypertable.
Creating tables and indexes, altering tables, inserting data, selecting data,
and most other tasks are executed on the hypertable.

<Procedure>

<Collapsible heading="Creating a hypertable" headingLevel={3}>

1.  Create a migration to modify the `page_loads` database and create a hypertable:

    ```ruby
    rails generate migration add_hypertable
    ```

    A new migration file `<migration-datetime>_add_hypertable.rb` is created in
    the `my_app/db/migrate` directory.

1.  Change the migration code in the `<migration-datetime>_add_hypertable.rb`
    file located at the `my_app/db/migrate` directory to:

    ```ruby
    class AddHypertable < ActiveRecord::Migration[7.0]
      def change
       execute "SELECT create_hypertable('page_loads', 'created_at');"
      end
    end
    ```

1.  Generate the hypertable:

    ```ruby
    rails db:migrate
    ```

1.  View the hypertable:

    ```ruby
    echo "\d page_loads" | rails dbconsole
    ```

    The result is similar to:

    ```ruby
                                 Table "public.page_loads"
        Column   |              Type              | Collation | Nullable | Default
     ------------+--------------------------------+-----------+----------+---------
      user_agent | character varying              |           |          |
      created_at | timestamp(6) without time zone |           | not null |
      updated_at | timestamp(6) without time zone |           | not null |
    Indexes:
      "page_loads_created_at_idx" btree (created_at DESC)
    Triggers:
      ts_insert_blocker BEFORE INSERT ON page_loads FOR EACH ROW EXECUTE FUNCTION _timescaledb_internal.insert_blocker()
    ```

</Collapsible>

</Procedure>

## Insert rows of data

You can insert data into your hypertables in several different ways. Create a
new view and controller so that you can insert a value into the database, store
the user agent and time in the database, retrieve the user agent of the browser
for site visitor. You can then create a `PageLoad` object, store the user agent
information and time, and save the object to TimescaleDB database.

<Procedure>

<Collapsible heading="Inserting rows into TimescaleDB" headingLevel={3}>

1.  Create a new view and controller so that you can insert a value into the database:

    ```ruby
    rails generate controller static_pages home
    ```

    This generates the view and controller files for a page called
    `/static_pages/home` for the website.  The `static_pages_controller.rb` file
    is located at `/my_app/app/controllers` directory.

1.  Add this line to the `static_pages_controller.rb` file to retrieve the user
    agent of browser for the site visitor.

    ```ruby
    class StaticPagesController < ApplicationController
      def home
        @agent = request.user_agent
      end
    end
    ```

1.  Print the `@agent` variable that you created to the `home.html.erb` file, located
    at `/my_app/app/views/static_pages/`:

    ```html
    <h1>StaticPages#home</h1>
    <p>Find me in app/views/static_pages/home.html.erb</p>
    <p>Request: <&= @agent &></p>
    ```

1.  Start the Rails server:

    ```bash
    rails s
    ```

    Go to `http://localhost:3000/static_pages/home`. You should see a printout
    of the user agent for the browser.

1.  Update the `static_pages_controller.rb` controller file to create a
    `PageLoad` object, store the user agent information and time, and save the
    object to TimescaleDB `tsdb` database:

    ```ruby
    class StaticPagesController < ApplicationController
       def home
          PageLoad.create(user_agent: request.user_agent)
       end
    end
    ```

    When you go to the browser and refresh the page several times. In the Rails
    console window commit messages appears:

    ```ruby
    Started GET "/static_pages/home" for ::1 at 2023-02-22 07:02:16 +0530
    Processing by StaticPagesController#home as HTML
    TRANSACTION (268.7ms)  BEGIN
    ↳ app/controllers/static_pages_controller.rb:3:in 'home'
    PageLoad Create (207.8ms)  INSERT INTO "page_loads" ("user_agent", "created_at", "updated_at") VALUES ($1, $2, $3)  [["user_agent", "Mozilla/5.0    (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"], ["created_at", "2023-02-22 01:32:16.465709"], ["updated_at", "2023-02-22 01:32:16.465709"]]
    ↳ app/controllers/static_pages_controller.rb:3:in 'home'
    TRANSACTION (206.5ms)  COMMIT
    ↳ app/controllers/static_pages_controller.rb:3:in 'home'
    Rendering layout layouts/application.html.erb
    Rendering static_pages/home.html.erb within layouts/application
    Rendered static_pages/home.html.erb within layouts/application (Duration: 0.1ms | Allocations: 7)
    Rendered layout layouts/application.html.erb (Duration: 9.4ms | Allocations: 2389)
    Completed 200 OK in 917ms (Views: 10.4ms | ActiveRecord: 682.9ms | Allocations: 4542)
    ```

1.  Connect to TimescaleDB `tsdb` database using psql:

    ```bash
    psql -x <SERVICE_URL>
    ```

1.  View the entries in the TimescaleDB `tsdb` database:

    ```sql
    SELECT * FROM page_loads ORDER BY created_at DESC;
    ```

    The result is similar to:

    ```bash
    -[ RECORD 1 ]---------------------------------------------------------------------------------------------------------------------
    user_agent | Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/202.0.0.0 Safari/537.36
    created_at | 2023-02-22 01:32:53.935198
    updated_at | 2023-02-22 01:32:53.935198
    -[ RECORD 2 ]---------------------------------------------------------------------------------------------------------------------
    user_agent | Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/202.0.0.0 Safari/537.36
    created_at | 2023-02-22 01:32:45.146997
    updated_at | 2023-02-22 01:32:45.146997
    ```

</Collapsible>

</Procedure>

## Execute a query

This section covers how to execute queries against your database.
You can retrieve the data that you inserted and view it.

<Procedure>

<Collapsible heading="Executing a simple query" headingLevel={3}>

1.  In the `static_pages_controller.rb` file modify the `home` method
    to [use Active Record to query][active-record-query] on all items in
    the `page_load` database and store them in an array:

    ```ruby
    class StaticPagesController < ApplicationController
      def home
        PageLoad.create(:user_agent => request.user_agent)
      end
    end
    ```

1.  Modify the `home.html.erb` view to iterate over the array and display
    each item:

     ```ruby
    <h1>Static Pages requests: <%= PageLoad.count &amp;></h1>
    ```

   Now, each time you refresh the page, you can see that a record is being inserted
   into the `tsdb` TimescaleDB database, and the counter is incremented on the page.

1.  You need to have a lot of page loads to research and explore
    the [time_bucket] function. You can use [Apache Bench][ab] aka `ab` to
    request 50,000 times parallelizing 10 times.

    ```bash
    ab -n 50000 -c 10 http://localhost:3000/static_pages/home
    ```

   [Apache Bench][ab] creates thousands of records in the hypertable. You can
   count how many "empty requests" Rails supports.

1.  After the `ab` command begins running, you can start a rails console
    and try some queries using the [time_bucket] function.

    ```bash
    rails console
    ```

1.  View the number of requests per minute:

    ```ruby
    PageLoad
      .select("time_bucket('1 minute', created_at) as time, count(1) as total")
      .group('time').order('time')
      .map {|result| [result.time, result.total]}
    ```

    The result is similar to:

    ```ruby
    PageLoad Load (357.7ms)  SELECT time_bucket('1 minute', created_at) as time, count(1) as total FROM "page_loads" GROUP BY time ORDER BY time
     =>
     [2023-02-22 01:32:00 UTC, 6],
     [2023-02-22 05:57:00 UTC, 3],
     [2023-02-22 05:59:00 UTC, 75],
    ```

</Collapsible>

</Procedure>

## Create scopes to reuse

Scopes are very useful for decomposing complex SQL statements into Ruby objects.
It also allows to introduce parameters and reuse queries as you need. create some
useful scopes that can help to summarize and easily access the `time_bucket`
function:

<Procedure>

<Collapsible heading="Executing queries using scopes" headingLevel={3}>

1.  In the `page_load.rb` file located at `my_app/app/models` directory, add
    these scopes:

    ```ruby
    class PageLoad < ApplicationRecord
      scope :last_month, -> { where('created_at > ?', 1.month.ago) }
      scope :last_week, -> { where('created_at > ?', 1.week.ago) }
      scope :last_hour, -> { where('created_at > ?', 1.hour.ago) }
      scope :yesterday, -> { where('DATE(created_at) = ?', 1.day.ago.to_date) }
      scope :today, -> { where('DATE(created_at) = ?', Date.today) }
    end
    ```

1.  In a new Ruby console you can run these commands to get the views for
    various requests:

    ```ruby
    PageLoad.last_week.count     # Total of requests from last week
    PageLoad.last_hour.first     # First request from last hour
    PageLoad.last_hour.all       # All requests from last hour
    PageLoad.last_hour.limit(10) # 10 requests from last hour
    ```

    You can also combine the scopes with other ActiveRecord methods, for example:

     ```ruby
     # Count chrome users from last hour
     PageLoad.last_hour.where("user_agent like '%Chrome%'").count
     ```

1.  Add a new scope that counts per minute dimension, in the `page_load.rb` file:

   ```ruby
   class PageLoad < ApplicationRecord

      scope :counts_per, -> (time_dimension) {
       select("time_bucket('#{time_dimension}', created_at) as time, count(1) as total")
       .group(:time).order(:time)
        .map {|result| [result.time, result.total]}
       }
    end
    ```

1.  In the Ruby console explore other time frames:

     ```ruby
     PageLoad.counts_per('1 hour')
     ```

     The result is similar to:

     ```ruby
     PageLoad Load (299.7ms)  SELECT time_bucket('1 hour', created_at) as time, count(1) as total FROM "page_loads" GROUP BY "time" ORDER BY "time" ASC
     =>
     [2023-02-22 01:00:00 UTC, 6],
     [2023-02-22 05:00:00 UTC, 78],
     [2023-02-22 06:00:00 UTC, 13063],
     [2023-02-22 07:00:00 UTC, 4114],
    ```

</Collapsible>

</Procedure>

## Add performance and path attributes to PageLoad

To get deeper in requests, move the example to watch all server requests and
store the endpoint path and the time necessary to return the response.

<Procedure>

<Collapsible heading="Adding performace and path attributes" headingLevel={3}>

1.  Add columns to the database using rails migrations:

    ```bash
    rails g migration add_performance_to_page_load path:string performance:float
    ```

    The Rails generator understands the naming convention of the
    migration and the extra parameters to create a new migration file
    `<migration-datetime>_add_performance_to_page_load.rb` in
    the `my_app/db/migrate` directory

1.  To add the two columns in the database, run `rails db:migrate`.

    The result is similar to:

    ```ruby
    == 20230226173116 AddPerformanceToPageLoad: migrating =========================
    -- add_column(:page_loads, :path, :string)
    -> 0.6050s
    -- add_column(:page_loads, :performance, :float)
    -> 0.3076s
    == 20230226173116 AddPerformanceToPageLoad: migrated (0.9129s) ================
    ```

1.  To hook the application controller with some [around_action] hook, in the
    `application_controller.rb` file located in `my_app/app/controllers`
    directory add these:

     ```ruby
     class ApplicationController < ActionController::Base
        around_action do |controller, action|
          performance = Benchmark.measure(&action.method(:call))

         PageLoad.create(path: request.path,
           performance: performance.real,
           user_agent: request.user_agent)
        end
    end
    ```

    This creates a record for PageLoad record for any request happening in the
    system.

1.  To view the latest record, in the Rails console, run :`PageLoad.order(:created_at).last`

    The result is similar to:

    ```ruby
    PageLoad Load (318.2ms)  SELECT "page_loads".* FROM "page_loads" ORDER BY "page_loads"."created_at" DESC LIMIT $1  [["LIMIT", 1]]
    =>
    #<PageLoad:0x000000010950a410
    user_agent:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
    created_at: Sun, 26 Feb 2023 15:49:35.186955000 UTC +00:00,
    updated_at: Sun, 26 Feb 2023 15:49:35.186955000 UTC +00:00,
    path: "/static_pages/home",
    performance: 1.094204000197351>
    ```

    This example uses only the **real** performance from [benchmark] but you can
    collect additional metrics to see more details about your system.

</Collapsible>

</Procedure>

## Explore aggregation functions

Now that you know what pages exist, you can explore the results. You can go
page by page, or all pages together, and group by path or not:

<Procedure>

<Collapsible heading="Exploring aggregation functions" headingLevel={3}>

1.  In the `page_load.rb` file located at `my_app/app/models` directory, add
    these scopes, for average response time, `min` and `max` requests, and
    collect unique paths from page loads:

    ```ruby
    class PageLoad < ApplicationRecord
      scope :per_minute, -> { time_bucket('1 minute') }
      scope :per_hour, -> { time_bucket('1 hour') }
      scope :per_day, -> { time_bucket('1 day') }
      scope :per_week, -> { time_bucket('1 week') }
      scope :per_month, -> { time_bucket('1 month') }
      scope :average_response_time_per_minute, -> { time_bucket('1 minute', value: 'avg(performance)') }
      scope :average_response_time_per_hour, -> { time_bucket('1 hour', value: 'avg(performance)') }
      scope :worst_response_time_last_minute, -> { time_bucket('1 minute', value: 'max(performance)') }
      scope :worst_response_time_last_hour, -> { time_bucket('1 hour', value: 'max(performance)') }
      scope :best_response_time_last_hour, -> { time_bucket('1 hour', value: 'min(performance)') }
      scope :paths, -> { distinct.pluck(:path) }
      scope :time_bucket, -> (time_dimension, value: 'count(1)') {
        select(<<~SQL)
          time_bucket('#{time_dimension}', created_at) as time, path,
          #{value} as value
        SQL
         .group('time, path').order('path, time')
        }
    end
    ```

1.  In the Rails console,to collect unique paths from page loads:

    ```ruby
     PageLoad.paths # => ["/page_loads/new", "/static_pages/home"]
    ```

    The result is similar to:

    ```ruby
    PageLoad Pluck (276.1ms)  SELECT DISTINCT "page_loads"."path" FROM "page_loads"
    => [nil, "/static_pages/home"]
    ```

1.  In the Ruby console, to get the actual metrics generated for the response
    time filtering by methods that contains `response_time` use:

    ```ruby
    PageLoad.methods.grep /response_time/
    ```

    The result is similar to:

    ```ruby
    PageLoad.methods.grep /response_time/
    # => [:average_response_time_per_hour,
    #  :average_response_time_per_minute,
    #   :worst_response_time_last_hour,
    #   :worst_response_time_last_minute,
    #   :best_response_time_last_hour]
    ```

1.  To build a summary based on every single page, and to recursively navigate to
    all of the pages and build a summary for each page, add the following to
    `page_load.rb` in the `my_app/app/models/` folder:

    ```ruby
    def self.resume_for(path)
       filter = where(path: path)
       get = -> (scope_name) { filter.send(scope_name).first&.value}
       metrics.each_with_object({}) do |metric, resume|
           resume[metric] = get[metric]
       end
    end

    def self.metrics
       methods.grep /response_time/
    end

    def self.statistics
       paths.each_with_object({}) do |path, resume|
         resume[path] = resume_for(path)
       end
    end
    ```

1.  In the Rails console, to view the summary based on every single page, run
    `PageLoad.resume_for("/page_loads/new")`.

    The result is similar to:

   ```ruby
   => {:average_response_time_per_minute=>0.10862650000490248,
   :average_response_time_per_hour=>0.060067999991588295,
   :worst_response_time_last_minute=>0.20734900003299117,
   :worst_response_time_last_hour=>0.20734900003299117,
   :best_response_time_last_hour=>0.009765000082552433},
   ```

1.  In the Rails console,to recursively navigate into all of the pages and build
    a summary for each page:

    The result is similar to:

    ```ruby
    "/page_loads/new"=>
    {:average_response_time_per_minute=>0.10862650000490248,
    :average_response_time_per_hour=>0.060067999991588295,
    :worst_response_time_last_minute=>0.20734900003299117,
    :worst_response_time_last_hour=>0.20734900003299117,
    :best_response_time_last_hour=>0.009765000082552433},
    "/static_pages/home"=>
    {:average_response_time_per_minute=>1.214221078382038,
    :average_response_time_per_hour=>4.556298695798993,
    :worst_response_time_last_minute=>2.2735520000569522,
    :worst_response_time_last_hour=>1867.2145019997843,
    :best_response_time_last_hour=>1.032415000256151}}
    ```

</Collapsible>

</Procedure>

[connect]: #connect-to-timescaledb
[create-table]: #create-a-relational-table
[create-hypertable]: #create-a-hypertable
[insert]: #insert-rows-of-data
[query]: #execute-a-query
[install]: /getting-started/latest/
[psql-install]: /use-timescale/:currentVersion:/connecting/psql/
[rails-guide]: https://guides.rubyonrails.org/getting_started.html
[ab]: https://httpd.apache.org/docs/2.4/programs/ab.html
[active-record-query]: https://guides.rubyonrails.org/active_record_querying.html
[around_action]: https://guides.rubyonrails.org/action_controller_overview.html#after-filters-and-around-filters
[benchmark]: https://github.com/ruby/benchmark
[time_bucket]: /api/:currentVersion:/hyperfunctions/time_bucket/
