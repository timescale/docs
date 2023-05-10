---
title: Query time-series data tutorial - query the data
excerpt: Query time-series data
products: [cloud, mst, self_hosted]
keywords: [tutorials, query]
tags: [tutorials, beginner]
---

# Query the data

When you have your dataset loaded, you can start constructing some queries to
discover what your data tells you. In this section, you learn how to write
queries that answer these questions:

*   [How many rides take place each day?](#how-many-rides-take-place-every-day)
*   [What is the average fare amount?](#what-is-the-average-fare-amount)
*   [How many rides of each rate type were taken?](#how-many-rides-of-each-rate-type-were-taken)
*   [What kind of trips are going to and from airports?](#what-kind-of-trips-are-going-to-and-from-airports)
*   [How many rides took place on New Year's Day 2016](#how-many-rides-took-place-on-new-years-day-2016)?

## How many rides take place every day?

This dataset contains ride data for January 2016. To find out how many rides
took place each day, you can use a `SELECT` statement. In this case, you want to
count the total number of rides each day, and show them in a list by date.

<Procedure>

### Finding how many rides take place every day

1.  Connect to the Timescale database that contains the NYC taxi dataset.
2.  At the psql prompt, use this query to select all rides taken in the first
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

</Procedure>

## What is the average fare amount?

You can include a function in your `SELECT` query to determine the average fare
paid by each passenger.

<Procedure>

### Finding the average fare amount

1.  Connect to the Timescale database that contains the NYC taxi dataset.
2.  At the psql prompt, use this query to select all rides taken in the first
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

</Procedure>

## How many rides of each rate type were taken?

Taxis in New York City use a range of different rate types for different kinds
of trips. For example, trips to the airport are charged at a flat rate from any
location within the city. This section shows you how to construct a query that
shows you the nuber of trips taken for each different fare type. It also uses a
`JOIN` statement to present the data in a more informative way.

<Procedure>

### Finding the number of rides for each fare type

1.  Connect to the Timescale database that contains the NYC taxi dataset.
2.  At the psql prompt, use this query to select all rides taken in the first
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

</Procedure>

This output is correct, but it's not very easy to read, because you probably
don't know what the different rate codes mean. However, the `rates` table in the
dataset contains a human-readable description of each code. You can use a `JOIN`
statement in your query to connect the `rides` and `rates` tables, and present
information from both in your results.

<Procedure>

### Displaying the number of rides for each fare type

1.  Connect to the Timescale database that contains the NYC taxi dataset.
2.  At the psql prompt, copy this query to select all rides taken in the first
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

</Procedure>

## What kind of trips are going to and from airports

There are two primary airports in the dataset: John F. Kennedy airport, or JFK,
is represented by rate code 2; Newark airport, or EWR, is represented by rate
code 3.

Information about the trips that are going to and from the two airports is
useful for city planning, as well as for organizations like the NYC Tourism
Bureau.

This section shows you how to construct a query that returns trip information for
trips going only to the new main airports.

<Procedure>

### Finding what kind of trips are going to and from airports

1.  Connect to the Timescale database that contains the NYC taxi dataset.
2.  At the psql prompt, use this query to select all rides taken to and from JFK
    and Newark airports, in the first week of January 2016, and return the number
    of trips to that airport, the average trip duration, average trip cost, and
    average number of passengers:

    ```sql
    SELECT rates.description,
        COUNT(vendor_id) AS num_trips,
        AVG(dropoff_datetime - pickup_datetime) AS avg_trip_duration,
        AVG(total_amount) AS avg_total,
        AVG(passenger_count) AS avg_passengers
    FROM rides
    JOIN rates ON rides.rate_code = rates.rate_code
    WHERE rides.rate_code IN (2,3) AND pickup_datetime < '2016-01-08'
    GROUP BY rates.description
    ORDER BY rates.description;
    ```

    The result of the query looks like this:

    ```sql
     description | num_trips | avg_trip_duration |      avg_total      |   avg_passengers
    -------------+-----------+-------------------+---------------------+--------------------
     JFK         |     54832 | 00:46:44.614222   | 63.7791311642836300 | 1.8062080536912752
     Newark      |      4126 | 00:34:45.575618   | 84.3841783809985458 | 1.8979641299079011
    ```

</Procedure>

## How many rides took place on New Year's Day 2016?

New York City is famous for the Ball Drop New Year's Eve celebration in Times
Square. Thousands of people gather to bring in the New Year and then head out
into the city: to their favorite bar, to gather with friends for a meal, or back
home. This section shows you how to construct a query that returns the number of
taxi trips taken on 1 January, 2016, in 30 minute intervals.

In PotsgreSQL, it's not particularly easy to segment the data by 30 minute time
intervals. To do this, you would need to use a `TRUNC` function to calculate the
quotient of the minute that a ride began in divided by 30, then truncate the
result to take the floor of that quotient. When you had that result, you could
multiply the truncated quotient by 30.

In your Timescale database, you can use the `time_bucket` function to segment
the data into time intervals instead.

<Procedure>

### Finding how many rides took place on New Year's Day 2016

1.  Connect to the Timescale database that contains the NYC taxi dataset.
2.  At the psql prompt, use this query to select all rides taken on the first
    day of January 2016, and return a count of rides for each 30 minute interval:

    ```sql
    SELECT time_bucket('30 minute', pickup_datetime) AS thirty_min, count(*)
    FROM rides
    WHERE pickup_datetime < '2016-01-02 00:00'
    GROUP BY thirty_min
    ORDER BY thirty_min;
    ```

    The result of the query starts like this:

    ```sql
         thirty_min      | count
    ---------------------+-------
     2016-01-01 00:00:00 | 10920
     2016-01-01 00:30:00 | 14350
     2016-01-01 01:00:00 | 14660
     2016-01-01 01:30:00 | 13851
     2016-01-01 02:00:00 | 13260
     2016-01-01 02:30:00 | 12230
     2016-01-01 03:00:00 | 11362
    ```

</Procedure>
