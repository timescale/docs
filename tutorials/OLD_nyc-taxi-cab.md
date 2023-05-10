---
title: IoT analysis and monitoring
excerpt: Analyze IoT data with TimescaleDB
keywords: [IoT, analytics, monitor]
---

# Introduction to IoT: New York City Taxicabs

Use case: IoT Analysis and Monitoring

In this tutorial, you learn:

1.  How to get started with TimescaleDB
2.  How to use TimescaleDB to analyze and monitor data from IoT sensors

Dataset: <Tag type="download">[nyc_data.tar.gz](https://timescaledata.blob.core.windows.net/datasets/nyc_data.tar.gz)</Tag>
Estimated time for completion: 25 minutes.

### Prerequisites

To complete this tutorial, you need a cursory knowledge of the
Structured Query Language (SQL). The tutorial walks you through each
SQL command, but it is helpful if you've seen SQL before.

### Accessing Timescale

There are multiple options for using Timescale to follow along with this tutorial. **All connection information
and database naming** throughout this tutorial assumes you are connected to **Timescale**, our hosted,
fully managed database-as-a-service. [Sign up for a free, 30-day demo account][cloud-signup], no credit-card
required. Once you confirm the account and get logged in, proceed to the **Background** section below.

If you would like to follow along with a local or on-prem install, you can follow the [install TimescaleDB][install-timescale]
instructions. Once your installation is complete, you need to create a tutorial database and
install the **Timescale** extension.

Using `psql` from the command line, create a database called `nyc_data` and install the extension:

```sql
CREATE DATABASE tsdb;
\c tsdb
CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;
```

You're all set to follow along locally!

### Background

New York City is home to more than 8.3 million people. In this tutorial,
we analyze and monitor data from New York's yellow cab taxis
using TimescaleDB in order to identify ways to gain efficiency and
reduce greenhouse gas emissions. The analysis we perform is similar to
the kind of analysis data science organizations in many problem
domains use to plan upgrades, set budgets, allocate resources, and more.

In this tutorial, you complete three missions:

*   **Mission 1: Gear up [5-15 minutes]** You learn how to setup and connect to a *TimescaleDB* instance and load data from a CSV file in your local terminal using *psql*.
*   **Mission 2: Analysis [10 minutes]** You learn how to analyze a time-series dataset using TimescaleDB and *PostgreSQL*.
*   **Mission 3: Monitoring [10 minutes]** You learn how to use TimescaleDB to monitor IoT devices. You'll also learn about using TimescaleDB in conjunction with other PostgreSQL extensions like *PostGIS*, for querying geospatial data.

### Mission 1: Gear up

For this tutorial, we use yellow taxi cab data from the
[New York City Taxi and Limousine Commission][NYCTLC]
(NYC TLC). The NYC TLC is the agency responsible for licensing and
regulating New York City's Yellow taxi cabs and other for-hire
vehicles. These vehicles are famous for getting New Yorkers
and tourists wherever they need to go across all five boroughs.

The NYC TLC has over 200,000 licensee vehicles completing
about 1 million trips each day. That's a lot of trips! They've
made their taxi utilization data publicly available. And, because nearly all of this data
is time-series data, proper analysis requires a purpose-built
time-series database. We use the unique functions
of TimescaleDB to complete our missions in this tutorial.

#### Download and load data

Let's start by downloading the dataset. In the interest of (downloading) time
and space (on your machine), we'll only grab data for the month of January 2016, a dataset
containing ~11 million records!

This download contains two files:

1.  `nyc_data.sql` - A SQL file that sets up the necessary tables
1.  `nyc_data_rides.csv` - A CSV file with the ride data

You can download the files from the below link:

<!--- This link no longer works, deleted. LKB 2023-05-10

<Tag type="download">[nyc_data.tar.gz]()</Tag>

-->

#### Get connected to TimescaleDB

To connect to the database, you'll need to make sure the `psql`
utility is installed on your command line. Follow the instructions for
your platform in order to
[setup the psql command-line utility][setup-psql].

Next, locate your `host`, `port`, and `password`.

Afterward, connect to your TimescaleDB instance from `psql`
by typing the command below into your terminal,
ensuring that you replace the {curly brackets} with your real
password, hostname, and port number.

```bash
psql -x "postgres://tsdbadmin:{YOUR_PASSWORD_HERE}@{YOUR_HOSTNAME_HERE}:{YOUR_PORT_HERE}/tsdb?sslmode=require"
```

You should see the following connection message:

```bash
=require
psql (12.4)
SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, bits: 256, compression: off)
Type "help" for help.

tsdb=>
```

To verify that TimescaleDB is installed, run the `\dx` command
to list all installed extensions to your PostgreSQL database.
You should see something similar to the following output:

```sql
                  List of installed extensions
| Name        | Version | Schema     | Description                                  |
|-------------|---------|------------|----------------------------------------------|
| plpgsql     | 1.0     | pg_catalog | PL/pgSQL procedural language                 |
| timescaledb | 1.6.0   | public     | Enables scalable inserts and complex queries |
```

#### Define your data schema

As mentioned above, the NYC TLC collects ride-specific data from every
vehicle in its fleet, generating data from millions of rides every day.

They collect the following data about each ride:

*   Pickup date and time (as a timestamp)
*   Pickup location (latitude and longitude)
*   Drop off date and time (as a timestamp)
*   Drop off location (latitude and longitude)
*   Trip distance (in miles)
*   Fares (in USD)
*   Passenger count
*   Rate type (e.g, standard, airport, etc.)
*   Payment type (Cash, credit card, etc.)

To efficiently store that data, we're going to need three tables:

1.  A [hypertable][hypertables] called `rides`, which stores all of the above data for each ride taken.
2.  A regular Postgres table called `payment_types`, which maps the payment types to their English description.
3.  A regular Postgres table called `rates`, which maps the numeric rate codes to their English description.

The `nyc_data.sql` script defines the schema for our three tables. The script
automatically configures your TimescaleDB instance with the appropriate
`rides`, `payment_types`, and `rates` tables.

In the command below, be sure to substitute the items in the curly braces with
information from your TimescaleDB instance, as you did earlier. Also take
note that this command includes the Timescale database that is automatically created
for you. If you are running the database locally, replace the database name as needed.

```bash
psql -x "postgres://tsdbadmin:{YOUR_PASSWORD_HERE}@{|YOUR_HOSTNAME_HERE}:{YOUR_PORT_HERE}/tsdb?sslmode=require" < nyc_data.sql
```

Alternatively, you can run each script manually from the `psql` command
line. This first script creates a table called `rides`, which stores
trip data. Notice also that we are creating a few indexes to help with later
queries in this tutorial:

```sql
CREATE TABLE "rides"(
    vendor_id TEXT,
    pickup_datetime TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    dropoff_datetime TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    passenger_count NUMERIC,
    trip_distance NUMERIC,
    pickup_longitude  NUMERIC,
    pickup_latitude   NUMERIC,
    rate_code         INTEGER,
    dropoff_longitude NUMERIC,
    dropoff_latitude  NUMERIC,
    payment_type INTEGER,
    fare_amount NUMERIC,
    extra NUMERIC,
    mta_tax NUMERIC,
    tip_amount NUMERIC,
    tolls_amount NUMERIC,
    improvement_surcharge NUMERIC,
    total_amount NUMERIC
);
SELECT create_hypertable('rides', 'pickup_datetime', 'payment_type', 2, create_default_indexes=>FALSE);
CREATE INDEX ON rides (vendor_id, pickup_datetime DESC);
CREATE INDEX ON rides (rate_code, pickup_datetime DESC);
CREATE INDEX ON rides (passenger_count, pickup_datetime DESC);
```

This script creates table `payment_types` and preconfigure
the types of payments taxis can accept:

```sql
CREATE TABLE IF NOT EXISTS "payment_types"(
    payment_type INTEGER,
    description TEXT
);
INSERT INTO payment_types(payment_type, description) VALUES
(1, 'credit card'),
(2, 'cash'),
(3, 'no charge'),
(4, 'dispute'),
(5, 'unknown'),
(6, 'voided trip');
```

This script creates table `rates` and preconfigure
the types of rates taxis can charge:

```sql
CREATE TABLE IF NOT EXISTS "rates"(
    rate_code   INTEGER,
    description TEXT
);
INSERT INTO rates(rate_code, description) VALUES
(1, 'standard rate'),
(2, 'JFK'),
(3, 'Newark'),
(4, 'Nassau or Westchester'),
(5, 'negotiated fare'),
(6, 'group ride');
```

You can confirm the success of these scripts by running the `\dt` command
in the `psql` command line. You should see the following:

```sql
           List of relations
 Schema |     Name      | Type  |  Owner
--------+---------------+-------+----------
 public | payment_types | table | postgres
 public | rates         | table | postgres
 public | rides         | table | postgres
(3 rows)
```

#### Load trip data into TimescaleDB

Next, let's upload the taxi cab data into your TimescaleDB instance.
The data is in the file called `nyc_data_rides.csv` and we load it
into the `rides` hypertable. To do this, we'll use the `psql` `\copy` command below.

>:WARNING: The PostgreSQL `\COPY` command is single-threaded and doesn't support batching
inserts into multiple transactions. With nearly 11 million rows of data this import can take
10 minutes or more depending on your Internet connection.

```sql
\COPY rides FROM nyc_data_rides.csv CSV;
```

A faster alternative is the [Parallel COPY command][parallel-copy], written in GoLang, that Timescale makes
available to the community. Once installed, issuing the following command imports the CSV file
in multiple threads, 5,000 rows at a time, significantly improving import speed. Set `--workers` <= CPUs (or CPUs x 2)
if they support Hyperthreading. **Be sure to replace your connection string, database name, and file location appropriately.**

```bash
timescaledb-parallel-copy --connection {CONNECTION STRING} --db-name {DATABASE NAME} --table rides --file {PATH TO `nyc_data_rides.csv`} --workers 4 --truncate --reporting-period 30s
```

With this Parallel Copy command you can get updates every 30 seconds on the progress of your import.

Once the import is complete, you can validate your setup by running the following command:

```sql
SELECT * FROM rides LIMIT 5;
```

If you see something similar to the following result, congrats
you've successfully completed Mission 1!

>:TIP: You can toggle expanded display on or off by using the `\x` flag on the `psql` command line. The output below is what you'd see when expanded display is on.

```sql
-[ RECORD 1 ]---------+--------------------
vendor_id             | 1
pickup_datetime       | 2016-01-01 00:00:01
dropoff_datetime      | 2016-01-01 00:11:55
passenger_count       | 1
trip_distance         | 1.20
pickup_longitude      | -73.979423522949219
pickup_latitude       | 40.744613647460938
rate_code             | 1
dropoff_longitude     | -73.992034912109375
dropoff_latitude      | 40.753944396972656
payment_type          | 2
fare_amount           | 9
extra                 | 0.5
mta_tax               | 0.5
tip_amount            | 0
tolls_amount          | 0
improvement_surcharge | 0.3
total_amount          | 10.3
-[ RECORD 2 ]---------+--------------------
vendor_id             | 1
pickup_datetime       | 2016-01-01 00:00:02
dropoff_datetime      | 2016-01-01 00:11:14
passenger_count       | 1
trip_distance         | 6.00
pickup_longitude      | -73.947151184082031
pickup_latitude       | 40.791046142578125
rate_code             | 1
dropoff_longitude     | -73.920768737792969
dropoff_latitude      | 40.865577697753906
payment_type          | 2
fare_amount           | 18
extra                 | 0.5
mta_tax               | 0.5
tip_amount            | 0
tolls_amount          | 0
improvement_surcharge | 0.3
total_amount          | 19.3
```

### Mission 2: Analysis

Let's say that the NYC Taxi and Limousine Commission has made it a key
goal to mitigate the impact of global warming by reducing their greenhouse
gas emissions by 20% by 2024. Given the number of taxi rides taken each
day, they believe studying past taxi rider history and behavior enables
them to plan for the future.

In this tutorial, we limit analysis of historical taxi ride data
to all NYC TLC taxi rides taken in January 2016. You can imagine that in a
more expansive scenario, you would want to examine rides taken over several years.

#### How many rides took place on each day?

The first question to explore is simple: *How many rides took place on each day during January 2016?*

Since TimescaleDB supports full SQL, all that's required is a simple SQL query
to count the number of rides and group/order them by the day they took place,
as seen below:

```sql
-- What's the total number of rides that took place everyday for first 5 days
SELECT date_trunc('day', pickup_datetime) as day, COUNT(*) FROM rides GROUP BY day ORDER BY day;
```

With this information, we know *how many* rides are taken each day, and we can
identify the days of the week and month in which the most rides take place.
Your result should look like this:

```sql
         day         | count
---------------------+--------
 2016-01-01 00:00:00 | 345037
 2016-01-02 00:00:00 | 312831
 2016-01-03 00:00:00 | 302878
 2016-01-04 00:00:00 | 316171
 2016-01-05 00:00:00 | 343251
 2016-01-06 00:00:00 | 348516
 2016-01-07 00:00:00 | 364894
 2016-01-08 00:00:00 | 392070
 2016-01-09 00:00:00 | 405825
 2016-01-10 00:00:00 | 351788
 2016-01-11 00:00:00 | 342651
 2016-01-12 00:00:00 | 367390
 2016-01-13 00:00:00 | 395090
 2016-01-14 00:00:00 | 396473
 2016-01-15 00:00:00 | 401289
 2016-01-16 00:00:00 | 411899
 2016-01-17 00:00:00 | 379156
 2016-01-18 00:00:00 | 341481
 2016-01-19 00:00:00 | 385187
 2016-01-20 00:00:00 | 382105
 2016-01-21 00:00:00 | 399654
 2016-01-22 00:00:00 | 420162
 2016-01-23 00:00:00 |  78133
 2016-01-24 00:00:00 | 159766
 2016-01-25 00:00:00 | 282087
 2016-01-26 00:00:00 | 327655
 2016-01-27 00:00:00 | 359180
 2016-01-28 00:00:00 | 383326
 2016-01-29 00:00:00 | 414039
 2016-01-30 00:00:00 | 435369
 2016-01-31 00:00:00 | 361505
 2017-11-17 00:00:00 |      2
(32 rows)
```

#### What is the average fare amount for passengers?

But this initial analysis is incomplete. We also need to understand how long each
ride is. After all, if we're looking to lessen the impact on the environment, we
probably want to discourage idle taxis and short trips.

One way we can glean insight into the duration of trips is by looking into
the daily average fare amount for rides with only one passenger. Once
again, this is a simple SQL query with some conditional statements,
shown in the query below:

```sql
-- What is the daily average fare amount for rides with only one passenger
-- for first 7 days?
SELECT date_trunc('day', pickup_datetime)
AS day, avg(fare_amount)
FROM rides
WHERE passenger_count = 1
AND pickup_datetime < '2016-01-08'
GROUP BY day ORDER BY day;
```

>:TIP: Queries like the ones above execute up to 20x faster on large datasets with TimescaleDB vs. a vanilla PostgreSQL database, thanks to Timescale's automatic time and space partitioning.

Your result should look like this:

```sql
         day         |         avg
---------------------+---------------------
 2016-01-01 00:00:00 | 12.5464748850129787
 2016-01-02 00:00:00 | 12.1129878886746750
 2016-01-03 00:00:00 | 12.8262352076841150
 2016-01-04 00:00:00 | 11.9116533573721472
 2016-01-05 00:00:00 | 11.7534235580737452
 2016-01-06 00:00:00 | 11.7824805635293235
 2016-01-07 00:00:00 | 11.9498961299166930
(7 rows)
```

#### How many rides took place for each rate type?

Of course, the fare amount only gives us a certain amount of insight. Some fares
are pre-set, regardless of the length. For example, trips to and from the airport are
a flat rate from within the city. So, let's examine the breakdown of
rides by ride type. This is also a fairly straightforward SQL query:

```sql
-- How many rides of each rate type took place in the month?
SELECT rate_code, COUNT(vendor_id) AS num_trips
FROM rides
WHERE pickup_datetime < '2016-02-01'
GROUP BY rate_code
ORDER BY rate_code;
```

After running the query above, you'll get the following output,
which shows how many rides of each rate code took place:

```sql
 rate_code | num_trips
-----------+-----------
         1 |  10626315
         2 |    225019
         3 |     16822
         4 |      4696
         5 |     33688
         6 |       102
        99 |       216
(7 rows)
```

While that's technically correct, you'd like to use something more human
readable. To do that, we can use the power of SQL joins, and combine
these results with the contents of the `rates` table, like in the query below:

```sql
-- How many rides of each rate type took place?
-- Join rides with rates to get more information on rate_code
SELECT rates.description, COUNT(vendor_id) AS num_trips,
  RANK () OVER (ORDER BY COUNT(vendor_id) DESC) AS trip_rank FROM rides
  JOIN rates ON rides.rate_code = rates.rate_code
  WHERE pickup_datetime < '2016-02-01'
  GROUP BY rates.description
  ORDER BY LOWER(rates.description);
```

>:TIP: This is a simple illustration of a powerful point: By allowing JOINs over hypertables and regular PostgreSQL tables, TimescaleDB allows you to combine your time-series data with your relational or business data to unearth powerful insights.

Your result should look like this, joining the information in the `rates` table
with the query you ran earlier:

```sql
      description      | num_trips | trip_rank
-----------------------+-----------------------
 group ride            |       102 |          6
 JFK                   |    225019 |          2
 Nassau or Westchester |      4696 |          5
 negotiated fare       |     33688 |          3
 Newark                |     16822 |          4
 standard rate         |  10626315 |          1
(6 rows)
```

#### Analysis of rides to JFK and EWR

From your work calculating rides by rate type, the NYC TLC noticed that
rides to John F Kennedy International Airport (JFK) and Newark International
Airport (EWR) were the second and fourth most popular ride types, respectively.
Given this popularity in airport rides and consequent carbon footprint,
the city of New York thinks that airport public transportation could be
an area of improvement - reducing traffic in the city and overall carbon
footprint associated with airport trips.

Prior to instituting any programs, they would like you to more closely
examine trips to JFK (code 2) and Newark (code 3). For each airport, they
would like to know the following for the month of January:

*   Number of trips to that airport
*   Average trip duration (i.e drop off time - pickup time)
*   Average trip cost
*   Average tip
*   Minimum, Maximum and Average trip distance
*   Average number of passengers

To do this, we can run the following query:

```sql
-- For each airport: num trips, avg trip duration, avg cost, avg tip, avg distance, min distance, max distance, avg number of passengers
SELECT rates.description, COUNT(vendor_id) AS num_trips,
   AVG(dropoff_datetime - pickup_datetime) AS avg_trip_duration, AVG(total_amount) AS avg_total,
   AVG(tip_amount) AS avg_tip, MIN(trip_distance) AS min_distance, AVG (trip_distance) AS avg_distance, MAX(trip_distance) AS max_distance,
   AVG(passenger_count) AS avg_passengers
 FROM rides
 JOIN rates ON rides.rate_code = rates.rate_code
 WHERE rides.rate_code IN (2,3) AND pickup_datetime < '2016-02-01'
 GROUP BY rates.description
 ORDER BY rates.description;
```

Which produces the following output:

```sql
-[ RECORD 1 ]-----+--------------------
description       | JFK
num_trips         | 225019
avg_trip_duration | 00:45:46.822517
avg_total         | 64.3278115181384683
avg_tip           | 7.3334228220728027
min_distance      | 0.00
avg_distance      | 17.2602816651038357
max_distance      | 221.00
avg_passengers    | 1.7333869584346211
-[ RECORD 2 ]-----+--------------------
description       | Newark
num_trips         | 16822
avg_trip_duration | 00:35:16.157472
avg_total         | 86.4633688027582927
avg_tip           | 9.5461657353465700
min_distance      | 0.00
avg_distance      | 16.2706122934252764
max_distance      | 177.23
avg_passengers    | 1.7435501129473309
```

Based on your analysis, you are able to identify:

*   There are 13x more rides to JFK than Newark. This often leads to heavy traffic on the roads to and from JFK, especially during peak times. They've decided to explore road improvements to those areas, as well as increasing public transport to and from the airport (e.g, buses, subway, trains, etc.)
*   Each airport ride has on average the same number of passengers per trip (~1.7 passengers per trip).
*   The trip distances are roughly the same 16-17 miles.
*   JFK is about 30% cheaper, most likely because of NJ tunnel and highway tolls.
*   Newark trips are 22% (10 min) shorter.

This data is useful not just for city planners, but also for airport travellers
and tourism organizations like the NYC Tourism Bureau. For example, a tourism
organization could recommend cost-conscious travelers who'd rather not fork out
$84 for a ride to Newark to use public transport instead, like the NJ Transit
train from Penn Station ($15.25 for an adult ticket). Similarly, they could
recommend to those travelling to JFK airport, and who are weary of heavy traffic,
to take the subway and airtrain instead, for just $7.50.

Moreover, you could also make recommendations for those flying out of
New York City about which airport to choose. For example, from the data above,
we can recommend those travellers who think they'd be in a rush and who don't
mind paying a little extra to consider flying out of Newark over JFK.

If you've made it this far, you've successfully completed Mission 2 and now
have a basic understanding of how to analyze time-series data using TimescaleDB!

### Mission 3: Monitoring

We can also use the time-series data from taxi rides to monitor
a ride's current status.

>:WARNING: A more realistic setup would involve creating a data pipeline that streams sensor data directly from the cars into TimescaleDB. However, we use the January 2016 data to illustrate the underlying principles that are applicable regardless of setup.

#### How many rides took place every 5 minutes for the first day of 2016?

It's January 1, 2016. NYC riders have celebrated New Year's Eve, and are using taxi
cabs to travel to and from their first gathering of the new year.

The first thing you might like to know is how many rides have recently taken
place. We can approximate that by counting the number of rides that were
completed on the first day of 2016, in 5 minute intervals.

While it's easy to count how many rides took place, there is no easy way
to segment data by 5 minute time intervals in PostgreSQL. As a result, we
need to use a query similar to the query below:

```sql
-- Vanilla Postgres query for num rides every 5 minutes
SELECT
  EXTRACT(hour from pickup_datetime) as hours,
  trunc(EXTRACT(minute from pickup_datetime) / 5)*5 AS five_mins,
  COUNT(*)
FROM rides
WHERE pickup_datetime < '2016-01-02 00:00'
GROUP BY hours, five_mins;
```

It may not be immediately clear why the above query returns rides segmented
by 5 minute buckets, so let's examine it more closely, using the sample time
of 08:49:00.

In the above query, we first extract the hour that a ride took place in:

```sql
EXTRACT(hour from pickup_datetime) as hours
```

So for 08:49 our result for `hours` would be 8. Then we need to calculate, `five_mins`,
the closest multiple of 5 minutes for a given timestamp. To do this, we calculate
the quotient of the minute that a ride began in divided by 5. Then we truncate
the result to take the floor of that quotient. Afterward, we multiply that truncated
quotient by 5 to, in essence, find the 5 minute bucket that the minute is closest to:

```sql
trunc(EXTRACT(minute from pickup_datetime) / 5)*5 AS five_mins
```

So our result for time of 08:49 would be `trunc(49/5)*5 = trunc(9.8)*5 = 9*5 = 45`,
so this time would be in the 45&nbsp;min bucket. After extracting both the hours and which
5 minute interval the time fell into, we then group our results, first by the
`hours` and then the `five_mins` interval. Whew, that was a lot for a conceptually
simple question!

Segmentation by arbitrary time intervals is common in time-series analysis,
but can sometimes be unwieldy in vanilla PostgreSQL. Thankfully,
TimescaleDB has many custom-built SQL functions to make time-series
analysis quick and simple. For example, `time_bucket` is a more powerful
version of the PostgreSQL `date_trunc` function. It allows for arbitrary
time intervals, rather than the standard day, minute, hour provided by `date_trunc`.

So when using TimescaleDB, the complex query above turns into a simpler
SQL query, as seen below:

```sql
-- How many rides took place every 5 minutes for the first day of 2016?
-- using the TimescaleDB "time_bucket" function
SELECT time_bucket('5 minute', pickup_datetime) AS five_min, count(*)
FROM rides
WHERE pickup_datetime < '2016-01-02 00:00'
GROUP BY five_min
ORDER BY five_min;
```

The result of your query should start something like this:

```sql
      five_min       | count
---------------------+-------
 2016-01-01 00:00:00 |   703
 2016-01-01 00:05:00 |  1482
 2016-01-01 00:10:00 |  1959
 2016-01-01 00:15:00 |  2200
 2016-01-01 00:20:00 |  2285

```

#### How many rides on New Year's morning originated from within 400m of Times Square, in 30 minute buckets?

New York City is famous for its annual Ball Drop New Year's Eve
celebration in Times Square. Thousands of people gather to bring in the
new year together and then head home, to their favorite bar, or first
gathering of the new year.

This matters to your analysis because you'd like to understand taxi demand
in peak times, and there's no more peak time in New York than the Times Square area
on the first day of the year.

To answer this question, your first guess might be to use our friend `time_bucket`
from the previous section to count rides initiated in 30 minute intervals. But
there's one piece of information we don't have: how do we figure out
which rides started *near Times Square*?

This requires that we make use of the pickup latitude and longitude columns
in our `rides` hypertable. To use the pickup location, we'll need to get our
hypertable ready for geospatial queries.

The good news is that TimescaleDB is compatible with all other PostgreSQL
extensions and, for geospatial data, we'll use [PostGIS][postgis]. This allows us
to slice data by time and location with the speed and scale of TimescaleDB!

```sql
-- Geospatial queries - TimescaleDB + POSTGIS -- slice by time and location
-- Install the extension in the database
CREATE EXTENSION postgis;
```

Then, run the `\dx` command in `psql` to verify that PostGIS was installed properly.
You should see the PostGIS extension in your extension list, as noted below:

```sql
                                        List of installed extensions
     Name     | Version |   Schema   |                             Description
 -------------+---------+------------+---------------------------------------------------------------------
  plpgsql     | 1.0     | pg_catalog | PL/pgSQL procedural language
  postgis     | 2.5.1   | public     | PostGIS geometry, geography, and raster spatial types and functions
  timescaledb | 1.6.0   | public     | Enables scalable inserts and complex queries for time-series data
 (3 rows)
 ```

Now, we need to alter our table to work with PostGIS. To start, we'll add
geometry columns for ride pick up and drop off locations:

```sql
-- Create geometry columns for each of our (lat,long) points
ALTER TABLE rides ADD COLUMN pickup_geom geometry(POINT,2163);
ALTER TABLE rides ADD COLUMN dropoff_geom geometry(POINT,2163);
```

Next we'll need to convert the latitude and longitude points into geometry coordinates
so that it plays well with PostGIS:

>:WARNING: This next query may take several minutes. Updating both columns in one UPDATE statement
as shown reduces the amount of time it takes to update all rows in the `rides` table.

```sql
-- Generate the geometry points and write to table
UPDATE rides SET pickup_geom = ST_Transform(ST_SetSRID(ST_MakePoint(pickup_longitude,pickup_latitude),4326),2163),
   dropoff_geom = ST_Transform(ST_SetSRID(ST_MakePoint(dropoff_longitude,dropoff_latitude),4326),2163);
```

Lastly, we need one more piece of info: Times Square is located at (`lat`, `long`) (`40.7589`,`-73.9851`).

Now, we have all the information to answer our original question:
*How many rides on New Year's morning originated within 400m of Times Square, in 30 minute buckets?*

```sql
-- How many taxis pick up rides within 400m of Times Square on New Years Day, grouped by 30 minute buckets.
-- Number of rides on New Years Day originating within 400m of Times Square, by 30 min buckets
-- Note: Times Square is at (lat, long) (40.7589,-73.9851)
SELECT time_bucket('30 minutes', pickup_datetime) AS thirty_min, COUNT(*) AS near_times_sq
FROM rides
WHERE ST_Distance(pickup_geom, ST_Transform(ST_SetSRID(ST_MakePoint(-73.9851,40.7589),4326),2163)) < 400
AND pickup_datetime < '2016-01-01 14:00'
GROUP BY thirty_min ORDER BY thirty_min;
```

You should get the following results:

```sql
     thirty_min      | near_times_sq
---------------------+---------------
 2016-01-01 00:00:00 |            74
 2016-01-01 00:30:00 |           102
 2016-01-01 01:00:00 |           120
 2016-01-01 01:30:00 |            98
 2016-01-01 02:00:00 |           112
 2016-01-01 02:30:00 |           109
 2016-01-01 03:00:00 |           163
 2016-01-01 03:30:00 |           181
 2016-01-01 04:00:00 |           214
 2016-01-01 04:30:00 |           185
 2016-01-01 05:00:00 |           158
 2016-01-01 05:30:00 |           113
 2016-01-01 06:00:00 |           102
 2016-01-01 06:30:00 |            91
 2016-01-01 07:00:00 |            88
 2016-01-01 07:30:00 |            58
 2016-01-01 08:00:00 |            72
 2016-01-01 08:30:00 |            94
 2016-01-01 09:00:00 |           115
 2016-01-01 09:30:00 |           118
 2016-01-01 10:00:00 |           135
 2016-01-01 10:30:00 |           160
 2016-01-01 11:00:00 |           212
 2016-01-01 11:30:00 |           229
 2016-01-01 12:00:00 |           244
 2016-01-01 12:30:00 |           230
 2016-01-01 13:00:00 |           235
 2016-01-01 13:30:00 |           238
(28 rows)
```

From the figure above, you can surmise that few people wanted to leave
by taxi around midnight, while many left by taxi between 03:00-05:00, after the
bars, clubs, and other New Year's Eve parties closed. This is useful information
for capacity planning, reducing idling vehicles, and pre-positioning alternative
transportation with a smaller carbon footprint, such as shuttle buses to/from
subway and train lines.

As an aside, the data also shows you that rides then picked up in the mid-morning
hours, as people headed to breakfast and other New Years activities. New York is
truly the city that never sleeps and Times Square is a good reflection of that!

### Conclusions and next steps

In this tutorial you learned how to get started with TimescaleDB.

In **Mission 1**, you learned how to setup and connect to a TimescaleDB instance
and load data from a CSV file using `psql`.

In **Missions 2 and 3** you learned how to use TimescaleDB to conduct analysis and
monitoring on a large dataset. You learned about hypertables, saw how TimescaleDB
supports full SQL, and how JOINs enable you to combine your time-series data
with your relational or business data.

You also learned about special TimescaleDB SQL functions like `time_bucket` and
how they make time-series analysis possible in fewer lines of code, as well
as how TimescaleDB is compatible with other extensions like *PostGIS*, for fast
querying by time and location.

Ready for more learning? Here's a few suggestions:

*   [Time Series Forecasting using TimescaleDB, R, Apache MADlib and Python][time-series-forecasting]
*   [Continuous Aggregates][continuous-aggregates]
*   [Try Other Sample Datasets][other-samples]
*   [Migrate your own Data][migrate]

[NYCTLC]: https://www1.nyc.gov/site/tlc/about/tlc-trip-record-data.page
[cloud-signup]: https://console.cloud.timescale.com/signup
[continuous-aggregates]: /getting-started/:currentVersion:/create-cagg/
[hypertables]: /use-timescale/:currentVersion:/hypertables
[install-timescale]: /getting-started/latest/
[migrate]: /use-timescale/:currentVersion:/migration/
[other-samples]: /tutorials/:currentVersion:/sample-datasets/
[parallel-copy]: https://github.com/timescale/timescaledb-parallel-copy
[postgis]: http://postgis.net/documentation
[setup-psql]: /use-timescale/:currentVersion:/connecting/psql
[time-series-forecasting]: /tutorials/:currentVersion:/time-series-forecast/
