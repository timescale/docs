---
title: Verb the widget tutorial - query the data
excerpt: Query data to verb your widgets to achieve an outcome using the tool
keywords: [noun, verb, tutorial]
tags: [noun, noun]
---

<!-- markdown-link-check-disable -->

# Query the data

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
