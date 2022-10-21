---
title: Query IoT data tutorial - query the data
excerpt: Query IoT data
keywords: [tutorials, query, iot]
tags: [tutorials, IoT]
---

# Query the data

Now that you have your dataset loaded, you can start constructing some queries
to discover what your data tells you. In this section, you learn how to write
queries that answer these questions:

*   How many rides take place each day?
*   What is the average fare amount?
*   How many rides of each rate type were taken?
*   What kind of trips are going to and from airports?

## How many rides take place every day?

This dataset contains ride data for January 2016. To find out how many rides
took place each day, you can use a `SELECT` statement. In this case, you want to
count the total number of rides each day, and show them in a list by date.

<procedure>

### Finding how many rides take place every day

1.  Connect to the Timescale Cloud database that contains the NYC taxi dataset.
1.  At the psql prompt, use this query to select all rides taken in the first
    week of January 2016, and return a count of rides for each day:

    ```sql
    SELECT date_trunc('day', pickup_datetime) as day,
    COUNT(*) FROM rides
    WHERE pickup_datetime < '2016-01-08'
    GROUP BY day
    ORDER BY day;
    ```

    The result of the query looks like this:

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
     ```

</procedure>

## What is the average fare amount?

You can include a function in your `SELECT` query to determine the average fare
paid by each passenger.

<procedure>

### Finding the average fare amount

1.  Connect to the Timescale Cloud database that contains the NYC taxi dataset.
1.  At the psql prompt, use this query to select all rides taken in the first
    week of January 2016, and return the average fare paid on each day:

    ```sql
    SELECT date_trunc('day', pickup_datetime)
    AS day, avg(fare_amount)
    FROM rides
    WHERE pickup_datetime < '2016-01-08'
    GROUP BY day
    ORDER BY day;
    ```

    The result of the query looks like this:

    ```sql
             day         |         avg
    ---------------------+---------------------
     2016-01-01 00:00:00 | 12.8569325028909943
     2016-01-02 00:00:00 | 12.4344713599355563
     2016-01-03 00:00:00 | 13.0615900461571986
     2016-01-04 00:00:00 | 12.2072927308323660
     2016-01-05 00:00:00 | 12.0018670885154013
     2016-01-06 00:00:00 | 12.0002329017893009
     2016-01-07 00:00:00 | 12.1234180337303436
    ```

</procedure>

## How many rides of each rate type were taken?

Taxis in New York City use a range of different rate types for different kinds
of trips. For example, trips to the airport are charged at a flat rate from any
location within the city. This section shows you how to construct a query that
shows you the nuber of trips taken for each different fare type. It also uses a
`JOIN` statement to present the data in a more informative way.

<procedure>

### Finding the number of rides for each fare type

1.  Connect to the Timescale Cloud database that contains the NYC taxi dataset.
1.  At the psql prompt, use this query to select all rides taken in the first
    week of January 2016, and return the total number of trips taken for each
    rate code:

    ```sql
    SELECT rate_code, COUNT(vendor_id) AS num_trips
    FROM rides
    WHERE pickup_datetime < '2016-01-08'
    GROUP BY rate_code
    ORDER BY rate_code;
    ```

    The result of the query looks like this:

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
    ```

</procedure>

This output is correct, but it's not very easy to read, because you probably
don't know what the different rate codes mean. However, the `rates` table in the
dataset contains a human-readable description of each code. You can use a `JOIN`
statement in your query to connect the `rides` and `rates` tables, and present
information from both in your results.

<procedure>

### Displaying the number of rides for each fare type

1.  Connect to the Timescale Cloud database that contains the NYC taxi dataset.
1.  At the psql prompt, copy this query to select all rides taken in the first
    week of January 2016, join the `rides` and `rates` tables, and return the
    total number of trips taken for each rate code, with a description of the
    rate code:

    ```sql
    SELECT rates.description, COUNT(vendor_id) AS num_trips
    FROM rides
    JOIN rates ON rides.rate_code = rates.rate_code
    WHERE pickup_datetime < '2016-01-08'
    GROUP BY rates.description
    ORDER BY LOWER(rates.description);
    ```

    The result of the query looks like this:

    ```sql
          description      | num_trips
    -----------------------+-----------
     group ride            |        17
     JFK                   |     54832
     Nassau or Westchester |       967
     negotiated fare       |      7193
     Newark                |      4126
     standard rate         |   2266401
    ```

</procedure>

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
