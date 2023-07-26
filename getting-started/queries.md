---
title: Queries
excerpt: Query your time-series data
products: [cloud]
keywords: [queries]
layout_components: [next_prev_large]
content_group: Getting started
---

# Queries

Timescale supports full SQL, so you don't need to learn a custom query language.
This section contains some simple queries that you can run directly on this
page. When you have constructed the perfect query, use the copy button to use it
on your own database.

Most of the queries in this section look for the last four days of data. This is
to account for the fact there are no stock trades over the weekends, and to make
sure that you always get some data in your results.

The main building block of all SQL queries is the `SELECT` statement. It is an
instruction to select data from a database. Doing a quick `SELECT` query is
often the first thing you do with a new database, just to make sure that your
data is stored in your database in the way you expect it to be.

## Use SELECT to return data

This first section uses a `SELECT` statement to ask your database to return
everything, represented by the asterisk, from the `stocks_real_time srt` table,
like this:

```sql
SELECT * FROM stocks_real_time srt
```

You don't want everything from the entire table, though, so you can use a `WHERE`
statement to add a condition on to the statement. In this section, you add a
`WHERE` condition to limit your results to only the last four days, like this:

```sql
WHERE time > now() - INTERVAL '4 days'
```

<Procedure>

### Using SELECT to return data

1.  At the command prompt, use the `psql` connection string from the cheat sheet
    you downloaded to connect to your database.
1.  At the `psql` prompt, type this query:

    ```sql
    SELECT * FROM stocks_real_time srt
    WHERE time > now() - INTERVAL '4 days';
    ```

    The data you get back looks a bit like this:

    ```sql
              time          | symbol |    price     | day_volume
    ------------------------+--------+--------------+------------
     2023-06-07 12:00:04+00 | C      |        47.39 |
     2023-06-07 12:00:04+00 | T      |        15.67 |
     2023-06-07 12:00:04+00 | SQ     |        66.27 |
     2023-06-07 12:00:04+00 | CRM    |        213.1 |
     2023-06-07 12:00:04+00 | CVX    |        155.9 |
     2023-06-07 12:00:04+00 | BAC    |        29.34 |
     ...
    ```

1.  Type `q` to return to the `psql` prompt.

</Procedure>

## Use ORDER BY to organize results

In the previous section, you ordered the results of your query by time in
descending order, so the most recent trades were at the top of the list. You can
change how your results are displayed using an `ORDER BY` statement.

In this section, you query Tesla's stock with a `SELECT` query like this,
which asks for all of the trades from the `stocks_real_time srt` table, with the
`TSLA` symbol, and which has day volume data:

```sql
SELECT * FROM stocks_real_time srt
WHERE symbol='TSLA' and day_volume is not null
```

Then, you add an `ORDER BY` statement to order the results by time in descending
order, and also by day volume in descending order. The day volume shows the
total number of trades for this stock for the day. Every time another trade
occurs, the day volume figure increases by 1. Here is the `ORDER BY` statement:

```sql
ORDER BY time DESC, day_volume desc
```

Finally, because Tesla has such a large volume of trades, and you might not
want to see all of them, you can add a limit to the number of results you want
to see, like this:

```sql
LIMIT 10
```

<Procedure>

### Using ORDER BY to organize results

1.  At the command prompt, use the `psql` connection string from the cheat sheet
    you downloaded to connect to your database.
1.  At the `psql` prompt, type this query:

    ```sql
    SELECT * FROM stocks_real_time srt
    WHERE symbol='TSLA' and day_volume is not null
    ORDER BY time DESC, day_volume desc
    LIMIT 10;
    ```

    The data you get back looks a bit like this:

    ```sql
              time          | symbol |  price   | day_volume
    ------------------------+--------+----------+------------
     2023-06-06 20:15:06+00 | TSLA   |   221.61 |  143483212
     2023-06-06 19:57:44+00 | TSLA   | 221.6775 |  139585954
     2023-06-06 19:57:43+00 | TSLA   |   221.68 |  139541647
     2023-06-06 19:57:42+00 | TSLA   |    221.7 |  139537050
     2023-06-06 19:57:42+00 | TSLA   |  221.655 |  139519760
     2023-06-06 19:57:41+00 | TSLA   |   221.65 |  139497262
     2023-06-06 19:57:39+00 | TSLA   |   221.65 |  139481020
     2023-06-06 19:57:38+00 | TSLA   |   221.64 |  139469621
     2023-06-06 19:57:37+00 | TSLA   |   221.66 |  139448852
     2023-06-06 19:57:36+00 | TSLA   |   221.65 |  139430492
    (10 rows)
    ```

    There are multiple trades every second, but you know that the order is
    correct, because the `day_volume` column is ordered correctly.

</Procedure>

## Get the first and last value

Timescale has custom SQL functions that can help make time-series analysis
easier and faster. In this section, you'll learn about two common Timescale
functions: `first` to find the earliest value within a group, and `last` to find
the most recent value within a group.

The `first()` and `last()` functions retrieve the first and last value of one
column when ordered by another. For example, the stock data has a timestamp
column called `time`, and a numeric column called `price`. You can use
`first(price, time)` to get the first value in the `price` column when ordered
with an increasing `time` column.

In this query, you start by selecting the `first()` and `last()` trading price
for every stock in the `stocks_real_time srt` table for the last four days:

```sql
SELECT symbol, first(price,time), last(price, time)
FROM stocks_real_time srt
WHERE time > now() - INTERVAL '4 days'
```

Then, you organize the results so that you can see the first and last value for
each stock together with a `GROUP BY` statement, and in alphabetical order with
an `ORDER BY` statement, like this:

```sql
GROUP BY symbol
ORDER BY symbol
```

For more information about these functions, see the API documentation for
[first()][first], and [last()][last].

<Procedure>

### Getting the first and last value

1.  At the command prompt, use the `psql` connection string from the cheat sheet
    you downloaded to connect to your database.
1.  At the `psql` prompt, type this query:

    ```sql
    SELECT symbol, first(price,time), last(price, time)
    FROM stocks_real_time srt
    WHERE time > now() - INTERVAL '4 days'
    GROUP BY symbol
    ORDER BY symbol;
    ```

    The data you get back looks a bit like this:

    ```sql
     symbol |  first   |   last
    --------+----------+----------
     AAPL   | 179.0507 |   179.04
     ABNB   |   118.83 | 117.9694
     AMAT   |   133.55 | 134.8964
     AMD    | 122.6476 |   125.13
     AMZN   | 126.5599 |   126.69
     ...
    ```

1.  Type `q` to return to the `psql` prompt.

</Procedure>

[first]: /api/:currentVersion:/hyperfunctions/first
[last]: /api/:currentVersion:/hyperfunctions/last
