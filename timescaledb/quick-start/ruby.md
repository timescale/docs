---
title: "Quick Start: Ruby and TimescaleDB"
excerpt: Get started with TimescaleDB for a Ruby application
keywords: [Ruby]
---

# Quick Start: Ruby and TimescaleDB

## Goal

This quick start guide is designed to get the Rails developer up
and running with TimescaleDB as their database. In this tutorial,
you'll learn how to:

*   [Connect to TimescaleDB](#connect-ruby-to-timescaledb)
*   [Create a relational table](#create-a-relational-table)
*   [Generate a Hypertable](#generate-hypertable)
*   [Insert a batch of rows into your Timescale database](#insert-rows-into-timescaledb)
*   [Execute a query on your Timescale database](#execute-a-query)

## Prerequisites

To complete this tutorial, you need a cursory knowledge of the Structured Query
Language (SQL). The tutorial walks you through each SQL command, but it is
helpful if you've seen SQL before.

To start, [install TimescaleDB][install-timescale]. Once your installation is complete,
we can proceed to ingesting or creating sample data and finishing the tutorial.

You also need to [install Rails][rails-install].

## Connect Ruby to TimescaleDB

### Step 1: Create a new Rails application

Let's start by creating a new Rails application configured to use PostgreSQL as the
database. TimescaleDB is a PostgreSQL extension.

```bash
rails new my_app -d=postgresql
```

Rails finishes creating and bundling your application, installing all required Gems in the process.

### Step 2: Configure the TimescaleDB database

Locate your TimescaleDB credentials in order to connect to your TimescaleDB instance.

You'll need the following credentials:

*   password
*   username
*   host URL
*   port
*   database name

In the `default` section of the `config/database.yml` section, configure your database:

```yaml
default: &default
  adapter: postgresql
  encoding: unicode
  # For details on connection pooling, see Rails configuration guide
  # http://guides.rubyonrails.org/configuring.html#database-pooling
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
  host: [your hostname]
  port: [your port]
  username: [your username]
  password: [your password]
```

<highlight type="warning">
Experienced Rails developers might want to set and retrieve environment variables for the username and password of the database. For the purposes of this quick start, we hard code the `host`, `port`, `username`, and `password`. This is *not* advised for code or databases of consequence.
</highlight>

Then configure the database name in the `development`, `test`, and `production` sections. Let's call our
database `tsdb` like so:

```ruby
development:
  <<: *default
  database: tsdb
```

Repeat the step for the `test` and `production` sections further down this file.

Your final file should look like this (without all the automatically generated comments):

```yaml
default: &default
  adapter: postgresql
  encoding: unicode
  # For details on connection pooling, see Rails configuration guide
  # http://guides.rubyonrails.org/configuring.html#database-pooling
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
  host: [your hostname]
  port: [your port]
  username: [your username]
  password: [your password]

development:
  <<: *default
  database: tsdb

test:
  <<: *default
  database: tsdb

production:
  <<: *default
  database: tsdb
```

#### Create the database

Now we can run the following `rake` command to create the database in TimescaleDB:

```bash
rails db:create
```

This creates the `tsdb` database in your TimescaleDB instance and a `schema.rb`
file that represents the state of your TimescaleDB database.

## Create a relational table

### Step 1: Add TimescaleDB to your Rails migration

First, let's setup our database to include the TimescaleDB extension.
Start by creating a migration:

```bash
rails generate migration add_timescale
```

In your `db/migrate` project folder, you'll see a new migration file for
`[some sequence of numbers]_add_timescale.rb`. Replace the contents of that
file with the following to instruct the database to load the TimescaleDB
extension to PostgreSQL:

```ruby
class AddTimescale < ActiveRecord::Migration[5.2]
  def change
    enable_extension("timescaledb") unless extensions.include? "timescaledb"
  end
end
```

### Step 2: Run database migrations

Now we can run the following `rails` command to add the TimescaleDB extension
to our database:

```bash
rails db:migrate
```

<highlight type="warning">
In order for the command to work, you need to make sure there is a database named `postgres` in your TimescaleDB deployment. This database is sometimes not present by default.
</highlight>

With `rails dbconsole` you can test that the extension has been added by running the `\dx`
command:

```bash
echo "\dx" | rails dbconsole
```

The output should be something like the following:

```
                                      List of installed extensions
    Name     | Version |   Schema   |                            Description
-------------+---------+------------+-------------------------------------------------------------------
 plpgsql     | 1.0     | pg_catalog | PL/pgSQL procedural language
 timescaledb | 2.1.1   | public     | Enables scalable inserts and complex queries for time-series data
(2 rows)
```

<highlight type="note">
To ensure that your tests run successfully, add `config.active_record.verify_foreign_keys_for_fixtures = false`
to your `config/environments/test.rb` file. Otherwise you get an error because TimescaleDB
uses internal foreign keys.
</highlight>

### Step 3: Create a table

Suppose we wanted to create a table to store the user agent (browser) and time
whenever a visitor loads our page. You could easily extend this simple example
to store a host of additional web analytics of interest to you. We can generate
a Rails scaffold to represent this information in a table:

```bash
rails generate scaffold PageLoads user_agent:string
```

TimescaleDB requires that any `UNIQUE` or `PRIMARY KEY` indexes on your table
include all partitioning columns, which in our case is the time column. A new Rails model
includes a `PRIMARY KEY` index for `id` by default, so we need to either remove the
column or make sure that the index includes time as part of a "composite key."

<highlight type="tip">
Composite keys aren't supported natively by Rails, but if you need to keep
your `id` column around for some reason you can add support for them with
the [`composite_primary_keys` gem](https://github.com/composite-primary-keys/composite_primary_keys).
</highlight>

To satisfy this TimescaleDB requirement, we need to change the migration code to _not_ create a `PRIMARY KEY` using the `id` column when `create_table` is used.
To do this we can change the migration implementation:

```rb
class CreatePageLoads < ActiveRecord::Migration[6.0]
  def change
    create_table :page_loads, id: false do |t|
      t.string :user_agent

      t.timestamps
    end
  end
end
```

Rails generates all the helper files and a database migration. We can then run
a `rails db:migrate` command again to create the table in our database.

```bash
rails db:migrate
```

Now, we can confirm that our table exists using and the model is properly mapped
using a simple `rails runner` command:

```bash
rails runner 'p PageLoad.count'
0
```

And we can view the structure of the `page_loads` table combining
the `\d page_loads` command in the `rails dbconsole` output:

```bash
 echo "\d page_loads" | rails dbconsole
                          Table "public.page_loads"
   Column   |              Type              | Collation | Nullable | Default
------------+--------------------------------+-----------+----------+---------
 user_agent | character varying              |           |          |
 created_at | timestamp(6) without time zone |           | not null |
 updated_at | timestamp(6) without time zone |           | not null |
```

## Generate hypertable

In TimescaleDB, the primary point of interaction with your data is a [hypertable][hypertables],
the abstraction of a single continuous table across all space and time
intervals, such that one can query it via standard SQL.

Virtually all user interactions with TimescaleDB are with hypertables. Creating tables
and indexes, altering tables, inserting data, selecting data, etc. can (and should)
all be executed on the hypertable.

A hypertable is defined by a standard schema with column names and types, with at
least one column specifying a time value.

<highlight type="tip">
The TimescaleDB documentation on [schema management and indexing](/timescaledb/latest/how-to-guides/schema-management/)
explains this in further detail.
</highlight>

Let's create this migration to modify the `page_loads` database and create a
hypertable by first running the following command:

```bash
rails generate migration add_hypertable
```

In your `db/migrate` project folder, you'll see a new migration file for
`[some sequence of numbers]_add_hypertable`.

Then we can write the migration to first remove the `id` column and then add
our hypertable like so:

```ruby
class AddHypertable < ActiveRecord::Migration[5.2]
  def change
    remove_column :page_loads, :id
    execute "SELECT create_hypertable('page_loads', 'created_at');"
  end
end
```

Run `rails db:migrate` to generate the hypertable.

We can confirm this in `psql` by running the `\d page_loads` command and seeing the
following:

```
                         Table "public.page_loads"
   Column   |            Type             | Collation | Nullable | Default
------------+-----------------------------+-----------+----------+---------
 user_agent | character varying           |           |          |
 time       | timestamp without time zone |           | not null |
 created_at | timestamp without time zone |           | not null |
 updated_at | timestamp without time zone |           | not null |
Indexes:
    "page_loads_time_idx" btree ("time" DESC)
Triggers:
    ts_insert_blocker BEFORE INSERT ON page_loads FOR EACH ROW EXECUTE PROCEDURE _timescaledb_internal.insert_blocker()
```

## Insert rows into TimescaleDB

Create a new view and controller so that we can insert a value into
the database and see our results. When the view displays, you can store
the user agent and time into the database.

```bash
rails generate controller static_pages home
```

This generates the view and controller files for a page called `/static_pages/home`
in our site. Let's first add a line to the `static_pages_controller.rb`
file to retrieve the user agent of the site visitor's browser:

```ruby
class StaticPagesController < ApplicationController
  def home
    @agent = request.user_agent
  end
end
```

Subsequently, in the `home.html.erb` file, print the `@agent`
variable you just created:

```erb
<h1>StaticPages#home</h1>
<p>Find me in app/views/static_pages/home.html.erb</p>
<p>
  Request: <%= @agent %>
</p>
```

Start your Rails server on the command line:

```bash
rails s
```

And, in your browser, visit `http://localhost:3000/static_pages/home`. You should
see a printout of the user agent for your browser.

Now that we've successfully obtained the user agent and passed it as a variable
to the view, we can create a `PageLoad` object, store the user agent information
and time, and save the object to our TimescaleDB database. In the `static_pages_controller.rb`
controller file, add the following:

```ruby
class StaticPagesController < ApplicationController
  def home
    PageLoad.create(user_agent: request.user_agent)
  end
end
```

Go back to your browser and refresh the page several times. You should see commit messages
in your Rails console window, like so:

```bash
Started GET "/static_pages/home" for ::1 at 2020-04-15 14:02:18 -0700
Processing by StaticPagesController#home as HTML
   (79.5ms)  BEGIN
  ↳ app/controllers/static_pages_controller.rb:6
  PageLoad Create (79.9ms)  INSERT INTO "page_loads" ("user_agent", "time", "created_at", "updated_at") VALUES ($1, $2, $3, $4)  [["user_agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Safari/605.1.15"], ["time", "2020-04-15 21:02:18.106769"], ["created_at", "2020-04-15 21:02:18.187643"], ["updated_at", "2020-04-15 21:02:18.187643"]]
  ↳ app/controllers/static_pages_controller.rb:6
   (80.0ms)  COMMIT
  ↳ app/controllers/static_pages_controller.rb:6
  Rendering static_pages/home.html.erb within layouts/application
  Rendered static_pages/home.html.erb within layouts/application (0.5ms)
Completed 200 OK in 266ms (Views: 20.9ms | ActiveRecord: 239.4ms)
```

You can view these entries in TimescaleDB by running the following command in `psql`:

```sql
SELECT * FROM page_loads ORDER BY time DESC;
```

The output should look like this:

```
                                                      user_agent                                                       |         created_at         |         updated_at         
-----------------------------------------------------------------------------------------------------------------------+----------------------------+----------------------------
 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Safari/605.1.15 | 2020-04-15 21:02:18.187643 | 2020-04-15 21:02:18.187643
 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Safari/605.1.15 | 2020-04-15 21:02:17.404137 | 2020-04-15 21:02:17.404137
 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Safari/605.1.15 | 2020-04-15 21:02:14.82468  | 2020-04-15 21:02:14.82468
 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Safari/605.1.15 | 2020-04-15 21:02:12.957934 | 2020-04-15 21:02:12.957934
(4 rows)
```

## Execute a query

So far, we've created a TimescaleDB table and inserted data into it. Now, let's
retrieve data and display it.

In our `static_pages_controller.rb` file let's modify the `home` method
and [use Active Record to query][active-record-query] all items in
the `page_load` database and store them in an array:

```ruby
class StaticPagesController < ApplicationController
  def home
    PageLoad.create(:user_agent => request.user_agent)
  end
end
```

And we can modify our `home.html.erb` view to iterate over the array and display
each item:

```ruby
<h1>Static Pages requests: <%= PageLoad.count %> </h1>
```

Now, each time we refresh our page, we can see that a record is being inserted
into the `tsdb` TimescaleDB database, and the counter is incremented on the page.

## Generating requests

We need to have a lot of page loads to continue our research and explore the
[time_bucket] function.

Let's use [Apache Bench][ab] aka `ab` to request 50,000 times parallelizing 10
times.

```bash
ab -n 50000 -c 10 http://localhost:3000/static_pages/home
```

Now, you can grab a tea and relax while it creates thousands of records in
your first hypertable. You'll be able to count how many 'empty requests' your
Rails supports.

## Counting requests per minute

Once the `ab` command begins running, we can start a rails console
and try some queries using the [time_bucket] function.

```bash
rails console
```

Now, let's start counting how many requests we have per minute:

```ruby
PageLoad
  .select("time_bucket('1 minute', created_at) as time, count(1) as total")
  .group('time').order('time')
  .map {|result| [result.time, result.total]}
# => [
#      [2021-04-14 20:38:00 UTC, 11770],
#      [2021-04-14 20:39:00 UTC, 11668], ...]
```

It works! Now, let's create some useful scopes that can help to summarize and
easily access the `time_bucket` function:

## Creating scopes to reuse

Scopes are very useful for decomposing complex SQL statements into Ruby objects.
It also allow to introduce params and reuse queries as you need.

Examples of scopes:

```ruby
class PageLoad < ApplicationRecord
  scope :last_month, -> { where('created_at > ?', 1.month.ago) }
  scope :last_week, -> { where('created_at > ?', 1.week.ago) }
  scope :last_hour, -> { where('created_at > ?', 1.hour.ago) }
  scope :yesterday, -> { where('DATE(created_at) = ?', 1.day.ago.to_date) }
  scope :today, -> { where('DATE(created_at) = ?', Date.today) }
end
```

And you can also combine the scopes with other ActiveRecord methods:

```ruby
PageLoad.last_week.count     # Total of requests from last week
PageLoad.last_hour.first     # First request from last hour
PageLoad.last_hour.all       # All requests from last hour
PageLoad.last_hour.limit(10) # 10 requests from last hour

# Count chrome users from last hour
PageLoad.last_hour.where("user_agent ilikes '%Chrome%'").count
```

Now, let's introduce a scope that counts per time dimension:

```ruby
class PageLoad < ApplicationRecord
  scope :counts_per, -> (time_dimension) {
    select("time_bucket('#{time_dimension}', created_at) as time, count(1) as total")
      .group(:time).order(:time)
      .map {|result| [result.time, result.total]}
  }

end
```

Exploring other time frames:

```ruby
PageLoad.counts_per('1 hour')
# PageLoad Load (1037.3ms)  SELECT time_bucket('1 hour', created_at) as time, count(1) as total FROM "page_loads" WHERE (created_at > '2021-04-08 12:03:14.800902') GROUP BY time ORDER BY time
# => [[2021-04-14 21:00:00 UTC, 185836],
#     [2021-04-14 22:00:00 UTC, 155286], ... ]
```

## Add performance and path attributes to PageLoad

Let's get deeper in requests, moving our example to watch all server requests and
store the endpoint path and the time necessary to return the response.

First, we need to add columns to the database using rails migrations:

```bash
rails g migration add_performance_to_page_load path:string performance:float
```

The Rails generator is smart enough to understand the naming convention of the
migration and the extra params to suggest a code like this:

```ruby
class AddPerformanceToPageLoad < ActiveRecord::Migration[6.0]
  def change
    add_column :page_loads, :path, :string
    add_column :page_loads, :performance, :float
  end
end
```

And, now we can run migrations with `rails db:migrate` to get the two columns in
the database.

## Hooking application controller to collect performance data

Our next step is make the PageLoad record creation happen in any request
happening in the system. So, let's hook the application controller with some
[around_action] hook.

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

We're using only the **real** performance from [benchmark]
but you can collect additional metrics to see more details about your system.

You can refresh the page and check the latest record in the rails console:

```ruby
PageLoad.order(:created_at).last
# PageLoad Load (1.7ms)  SELECT "page_loads".* FROM "page_loads" ORDER BY "page_loads"."created_at" DESC LIMIT $1  [["LIMIT", 1]]
# => #<PageLoad:0x00007fdafc5c69d8 path: "/static_pages/home", performance: 0.049275, ...>
```

## Exploring aggregation functions

Now that we know what pages exist, we can explore page by page (or all the
pages together), grouping by path or not.

```ruby
class PageLoad < ApplicationRecord
  scope :time_bucket, -> (time_dimension, value: 'count(1)') {
    select(<<~SQL)
          time_bucket('#{time_dimension}', created_at) as time, path,
          #{value} as value
      SQL
      .group('time, path').order('path, time')
  }
end
```

And we can build scopes reusing previous scopes to have easy names for the most
used queries:

```ruby
scope :per_minute, -> { time_bucket('1 minute') }
scope :per_hour, -> { time_bucket('1 hour') }
scope :per_day, -> { time_bucket('1 day') }
scope :per_week, -> { time_bucket('1 week') }
scope :per_month, -> { time_bucket('1 month') }
```

Create some average response depending on the timeframe:

```ruby
scope :average_response_time_per_minute, -> { time_bucket('1 minute', value: 'avg(performance)') }
scope :average_response_time_per_hour, -> { time_bucket('1 hour', value: 'avg(performance)') }
```

And also, understand the limits `max` and `min` of the requests:

```ruby
scope :worst_response_time_last_minute, -> { time_bucket('1 minute', value: 'max(performance)') }
scope :worst_response_time_last_hour, -> { time_bucket('1 hour', value: 'max(performance)') }
scope :best_response_time_last_hour, -> { time_bucket('1 hour', value: 'min(performance)') }
```

Finally, let's build some useful method that can create a resume for every
different path. So, first step is collect unique paths from the page loads:

```ruby
scope :paths, -> { distinct.pluck(:path) }
```

Testing on Ruby console we have:

```ruby
PageLoad.paths # => ["/page_loads/new", "/static_pages/home"]
# (151.6ms)  SELECT DISTINCT "page_loads"."path" FROM "page_loads"
```

Now, let's have a look in the actual metrics we generate for the response time
filtering by methods that contains `response_time`.

```ruby
PageLoad.methods.grep /response_time/
# => [:average_response_time_per_minute,
# :worst_response_time_last_minute,
# :average_response_time_per_hour,
# :worst_response_time_last_hour,
# :best_response_time_last_hour]
```

Now, it's time to build our summary based on every single page:

```ruby
def self.resume_for(path)
  filter = where(path: path)
  get = -> (scope_name) { filter.send(scope_name).first.value}
  metrics.each_with_object({}) do |metric, resume|
    resume[metric] = get[metric]
  end
end

def self.metrics
  methods.grep /response_time/
end
```

Trying it on console:

```ruby
PageLoad.resume_for("/page_loads/new")
# => {:average_response_time_per_minute=>0.967591333319433,
# :worst_response_time_last_minute=>2.892941999947652,
# :average_response_time_per_hour=>0.48624183332625154,
# :worst_response_time_last_hour=>2.892941999947652,
# :best_response_time_last_hour=>0.0030219999607652426}
```

And you can keep combining other filters like:

```ruby
PageLoad.last_week.resume_for("/page_loads/new")
PageLoad.yesterday.resume_for("/page_loads/new")
PageLoad.today.resume_for("/page_loads/new")
```

The last step is to recursively navigate into all of the pages and build a summary
for each:

```ruby
def self.statistics
  paths.each_with_object({}) do |path, resume|
    resume[path] = resume_for(path)
  end
end
```

And now, testing again on console:

```ruby
PageLoad.statistics
# => {"/page_loads/new"=>
#  {:average_response_time_per_minute=>0.967591333319433,
#   :worst_response_time_last_minute=>2.892941999947652,
#   :average_response_time_per_hour=>0.48624183332625154,
#   :worst_response_time_last_hour=>2.892941999947652,
#   :best_response_time_last_hour=>0.0030219999607652426},
# "/static_pages/home"=>
#  {:average_response_time_per_minute=> ...}
```

And you can also explore different data frames for the statistics:

```ruby
PageLoad.yesterday.statistics # => {...}
PageLoad.last_week.statistics # => {...}
```

As you can see in the console, every single query is being executed
independent, which is suboptimal but covers different options.

Now that you get some basics of the TimescaleDB instance from your Rails application,
be sure to check out these advanced TimescaleDB tutorials:

*   [Time Series Forecasting using TimescaleDB, R, Apache MADlib and Python][time-series-forecasting]
*   [Continuous Aggregates][continuous-aggregates]
*   [Try Other Sample Datasets][other-samples]
*   [Migrate your own Data][migrate]

[ab]: https://httpd.apache.org/docs/2.4/programs/ab.html
[active-record-query]: https://guides.rubyonrails.org/active_record_querying.html
[around_action]: https://guides.rubyonrails.org/action_controller_overview.html#after-filters-and-around-filters
[benchmark]: https://github.com/ruby/benchmark
[continuous-aggregates]: /timescaledb/:currentVersion:/how-to-guides/continuous-aggregates/
[hypertables]: /timescaledb/:currentVersion:/overview/core-concepts/
[install-timescale]: /install/latest/
[migrate]: /timescaledb/:currentVersion:/how-to-guides/migrate-data/
[other-samples]: /timescaledb/:currentVersion:/tutorials/sample-datasets/
[rails-install]: https://guides.rubyonrails.org/getting_started.html
[time_bucket]: /api/:currentVersion:/hyperfunctions/time_bucket/
[time-series-forecasting]: /timescaledb/:currentVersion:/tutorials/time-series-forecast/
