# Quick Start: Ruby and TimescaleDB

### Goal
This quick start guide is designed to get the Rails developer up 
and running with TimescaleDB as their database. In this tutorial, 
you’ll learn how to:

* [Connect to TimescaleDB](#new_database)
* [Create a relational table](#create_table)
* [Generate a Hypertable](#create_hypertable) 
* [Insert a batch of rows into your Timescale database](#insert_rows)
* [Execute a query on your Timescale database](#execute_query)

### Pre-requisites

To complete this tutorial, you will need a cursory knowledge of the Structured Query 
Language (SQL). The tutorial will walk you through each SQL command, but it will be 
helpful if you've seen SQL before.

To start, [install TimescaleDB][install-timescale]. Once your installation is complete, 
we can proceed to ingesting or creating sample data and finishing the tutorial.

Obviously, you will need to [install Rails][rails-install] as well.

### Connect Ruby to TimescaleDB [](new-database)

#### Step 1: Create a new Rails application
Let’s start by creating a new Rails application configured to use PostgreSQL as the 
database. TimescaleDB is a PostgreSQL extension.

```bash
rails new my_app -d=postgresql
```

Rails will finish creating and bundling your application, installing all required Gems in the process.

#### Step 2: Configure the TimescaleDB database

Locate your TimescaleDB credentials in order to connect to your TimescaleDB instance.

You’ll need the following credentials:

* password
* username
* host URL
* port
* database name

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
Experienced Rails developers will want to set and retrieve environment variables for the username and password of the database. For the purposes of this quick start, we will hard code the `host`, `port`, `username`, and `password`. This is *not* advised for code or databases of consequence.
</highlight>

Then configure the database name in the `development`, `test`, and `production` sections. Let’s call our 
database `my_app_db` like so:

```ruby
development:
  <<: *default
  database: my_app_db
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
  database: my_app_db

test:
  <<: *default
  database: my_app_db

production:
  <<: *default
  database: my_app_db
```

Now we can run the following `rake` command to create the database in TimescaleDB:

```bash
rake db:create
```

This will create the `my_app_db` database in your TimescaleDB instance and a `schema.rb` 
file that represents the state of your TimescaleDB database.

### Create a relational table [](create_table)

#### Step 1: Add TimescaleDB to your Rails migration

First, let's setup our database to include the TimescaleDB extension. We will
start by creating a migration:

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

#### Step 2: Create the database

Now we can run the following `rake` command to add the TimescaleDB extension
to our database:

```bash
rake db:migrate
```

<highlight type="warning">
In order for the command to work, you will need to make sure there is a database named `postgres` in your TimescaleDB deployment. This database is sometimes not present by default.
</highlight>

In `psql` you can test that the extension has been added by running the `\dx`
command and seeing something like the following:

```
                                      List of installed extensions
    Name     | Version |   Schema   |                            Description                            
-------------+---------+------------+-------------------------------------------------------------------
 plpgsql     | 1.0     | pg_catalog | PL/pgSQL procedural language
 timescaledb | 1.6.1   | public     | Enables scalable inserts and complex queries for time-series data
(2 rows)
```

#### Step 3: Create a table 

Suppose we wanted to create a table to store the user agent (browser) and time 
whenever a visitor loads our page. You could easily extend this simple example 
to store a host of additional web analytics of interest to you. We can generate 
a Rails scaffold to represent this information in a table:

```bash
rails generate scaffold PageLoads user_agent:string time:timestamp
```

Rails generates all the helper files and a database migration. We can then run 
a `rake` command to create the table in our database.

```bash
rake db:migrate
```

If we connect to our Timescale instance using `psql`, we can view our database 
and the `page_loads` table that was created through our migration process using 
the `\dt` command:

```bash
                 List of relations
 Schema |         Name         | Type  |   Owner   
--------+----------------------+-------+-----------
 public | ar_internal_metadata | table | tsdbadmin
 public | page_loads           | table | tsdbadmin
 public | schema_migrations    | table | tsdbadmin
(3 rows)
```

And we can view the structure of the `page_loads` table using 
the `\d page_loads` command:

```bash
                                        Table "public.page_loads"
   Column   |            Type             | Collation | Nullable |                Default                 
------------+-----------------------------+-----------+----------+----------------------------------------
 id         | bigint                      |           | not null | nextval('page_loads_id_seq'::regclass)
 user_agent | character varying           |           |          | 
 time       | timestamp without time zone |           |          | 
 created_at | timestamp without time zone |           | not null | 
 updated_at | timestamp without time zone |           | not null | 
Indexes:
    "page_loads_pkey" PRIMARY KEY, btree (id)
```

### Generate hypertable [](create_hypertable)

In TimescaleDB, the primary point of interaction with your data is a [hypertable][hypertables], 
the abstraction of a single continuous table across all space and time 
intervals, such that one can query it via standard SQL.

Virtually all user interactions with TimescaleDB are with hypertables. Creating tables 
and indexes, altering tables, inserting data, selecting data, etc. can (and should) 
all be executed on the hypertable.

A hypertable is defined by a standard schema with column names and types, with at 
least one column specifying a time value.

<highlight type="tip">
The TimescaleDB documentation on [schema management and indexing](/how-to-guides/schema-management/) 
explains this in further detail.
</highlight>

TimescaleDB requires that any `UNIQUE` or `PRIMARY KEY` indexes on your table
include all partitioning columns, in our case the time. A new Rails model will 
include a `PRIMARY KEY` index for `id` by default, so we need to either remove the 
column or make sure that the index includes time as part of a "composite key". 
Composite keys aren't supported natively by Rails, but if you need to keep 
your `id` column around for some reason you can add support for them with 
the [`composite_primary_keys` gem][composite-primary-key-gem].

In our case we won't be making use of the `id` column (time-series data is generally 
searched by time instead) so we're just going to drop it entirely with the 
`remove_column` line below.

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
    execute "SELECT create_hypertable('page_loads', 'time');"
  end
end
```

When we run `rake db:migrate` we will generate the hypertable.

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

### Insert rows into TimescaleDB [](insert_rows)

Let’s create a new view and controller so that we can insert a value into 
the database and see our results. When our view displays, we will store 
the user agent and time into our database.

```bash
rails generate controller static_pages home
```

This will generate the view and controller files for a page called `/static_pages/home` 
in our site. Let’s first add a line to the `static_pages_controller.rb` 
file to retrieve the user agent of the site visitor’s browser:

```ruby
class StaticPagesController < ApplicationController
  def home
    @agent = request.user_agent
  end
end
```

Subsequently, in the `home.html.erb` file, we will print the `@agent` 
variable we just created:

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

Now that we’ve successfully obtained the user agent and passed it as a variable 
to the view, we can create a `PageLoad` object, store the user agent information 
and time, and save the object to our TimescaleDB database. In the `static_pages_controller.rb` 
controller file, add the following:

```ruby
class StaticPagesController < ApplicationController
  def home
    @agent = request.user_agent

    page_load = PageLoad.new(:user_agent => request.user_agent, :time => Time.now)
    page_load.save

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
                                                      user_agent                                                       |            time            |         created_at         |         updated_at         
-----------------------------------------------------------------------------------------------------------------------+----------------------------+----------------------------+----------------------------
 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Safari/605.1.15 | 2020-04-15 21:02:18.106769 | 2020-04-15 21:02:18.187643 | 2020-04-15 21:02:18.187643
 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Safari/605.1.15 | 2020-04-15 21:02:17.323409 | 2020-04-15 21:02:17.404137 | 2020-04-15 21:02:17.404137
 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Safari/605.1.15 | 2020-04-15 21:02:14.743669 | 2020-04-15 21:02:14.82468  | 2020-04-15 21:02:14.82468
 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Safari/605.1.15 | 2020-04-15 21:02:12.628455 | 2020-04-15 21:02:12.957934 | 2020-04-15 21:02:12.957934
(4 rows)
```

### Execute a query [](execute_query)

So far, we’ve created a TimescaleDB table and inserted data into it. Now, let’s 
retrieve data and display it.

In our `static_pages_controller.rb` file let’s modify the `home` method 
and [use Active Record to query][active-record-query] all items in 
the `page_load` database and store them in an array:

```ruby
class StaticPagesController < ApplicationController
  def home
    page_load = PageLoad.new(:user_agent => request.user_agent, :time => Time.now)
    page_load.save

    @views = PageLoad.all
  end
end
```

And we can modify our `home.html.erb` view to iterate over the array and display 
each item:

```ruby
<h1>StaticPages#home</h1>
<p>Find me in app/views/static_pages/home.html.erb</p>

<table>
    <% @views.each do |v| %>
        <tr>
            <td><%= v.user_agent %></td>
            <td><%= v.time %></td>
        </tr>
    <% end %>
</table>
```

Now, each time we refresh our page, we can see that a record is being inserted 
into the `my_app_db` TimescaleDB database, and all records are being displayed 
on the page.


### Next steps

Now that you’re able to connect, read, and write to a TimescaleDB instance from your 
Rails application, and generate the scaffolding necessary to build a new application 
from an existing TimescaleDB instance, be sure to check out these advanced TimescaleDB 
tutorials:

- [Time Series Forecasting using TimescaleDB, R, Apache MADlib and Python][time-series-forecasting]
- [Continuous Aggregates][continuous-aggregates]
- [Try Other Sample Datasets][other-samples]
- [Migrate your own Data][migrate]


[install-timescale]: /how-to-guides/install-timescaledb/
[setup-psql]: /getting-started/access-timescaledb/install-psql/
[install]: /how-to-guides/install-timescaledb/
[indexing-api-guide]: /how-to-guides/schema-management/indexing/
[crypto-tutorial]: /tutorials/analyze-cryptocurrency-data
[time-series-forecasting]: /tutorials/time-series-forecast/
[continuous-aggregates]: /tutorials/continuous-aggs-tutorial
[other-samples]: /tutorials/sample-datasets/
[migrate]: /how-to-guides/migrate-data/
[hypertables]: /overview/core-concepts/
[active-record-query]: https://guides.rubyonrails.org/v2.3.11/active_record_querying.html
[rails-install]: https://guides.rubyonrails.org/v5.0/getting_started.html
[composite-primary-key-gem]: https://github.com/composite-primary-keys/composite_primary_keys