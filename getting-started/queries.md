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

<CodeBlock canCopy={false} showLineNumbers={false} children={`
SELECT * FROM stocks_real_time srt
`} />

You don't want everything from the entire table, though, so you can use a `WHERE`
statement to add a condition on to the statement. In this section, you add a
`WHERE` condition to limit your results to only the last four days, like this:

<CodeBlock canCopy={false} showLineNumbers={false} children={`
WHERE time > now() - INTERVAL '4 days'
`} />

You can also limit the number of rows that get returned with a `LIMIT` clause:

<CodeBlock canCopy={false} showLineNumbers={false} children={`
LIMIT 10
`} />

<Procedure>

### Using SELECT to return data

1.  At the command prompt, use the `psql` connection string from the cheat sheet
    you downloaded to connect to your database.
1.  At the `psql` prompt, type this query.

    <Highlight type="note">
    Get a sneak peek at the results by clicking "Run query" below. This runs the
    SQL query against a live instance curated by Timescale.
    </Highlight>

    <TryItOutCodeBlock queryId="getting-started-srt-4-days" />

1.  Type `q` to return to the `psql` prompt.

</Procedure>

## Use ORDER BY to organize results

In the previous section, you ordered the results of your query by time in
descending order, so the most recent trades were at the top of the list. You can
change how your results are displayed using an `ORDER BY` statement.

In this section, you query Tesla's stock with a `SELECT` query like this,
which asks for all of the trades from the `stocks_real_time srt` table, with the
`TSLA` symbol, and which has day volume data:

<CodeBlock canCopy={false} showLineNumbers={false} children={`
SELECT * FROM stocks_real_time srt
WHERE symbol='TSLA' and day_volume is not null
`} />

Then, you add an `ORDER BY` statement to order the results by time in descending
order, and also by day volume in descending order. The day volume shows the
total number of trades for this stock for the day. Every time another trade
occurs, the day volume figure increases by 1. Here is the `ORDER BY` statement:

<CodeBlock canCopy={false} showLineNumbers={false} children={`
ORDER BY time DESC, day_volume desc
`} />

Finally, to limit the number of results, you can use a `LIMIT` clause again:

<CodeBlock canCopy={false} showLineNumbers={false} children={`
LIMIT 10
`} />

<Procedure>

### Using ORDER BY to organize results

1.  At the command prompt, use the `psql` connection string from the cheat sheet
    you downloaded to connect to your database.
1.  At the `psql` prompt, type this query:

    <TryItOutCodeBlock queryId="getting-started-srt-orderby" />

    There are multiple trades every second, but you know that the order is
    correct, because the `day_volume` column is ordered correctly.

</Procedure>

## Get the first and last value

Timescale has custom SQL functions that can help make time-series analysis
easier and faster. In this section, you learn about two common Timescale
functions: `first` to find the earliest value within a group, and `last` to find
the most recent value within a group.

The `first()` and `last()` functions retrieve the first and last value of one
column when ordered by another. For example, the stock data has a timestamp
column called `time`, and a numeric column called `price`. You can use
`first(price, time)` to get the first value in the `price` column when ordered
with an increasing `time` column.

In this query, you start by selecting the `first()` and `last()` trading price
for every stock in the `stocks_real_time srt` table for the last four days:

<CodeBlock canCopy={false} showLineNumbers={false} children={`
SELECT symbol, first(price,time), last(price, time)
FROM stocks_real_time srt
WHERE time > now() - INTERVAL '4 days'
`} />

Then, you organize the results so that you can see the first and last value for
each stock together with a `GROUP BY` statement, and in alphabetical order with
an `ORDER BY` statement, like this:

<CodeBlock canCopy={false} showLineNumbers={false} children={`
GROUP BY symbol
ORDER BY symbol
`} />

For more information about these functions, see the API documentation for
[first()][first], and [last()][last].

<Procedure>

### Getting the first and last value

1.  At the command prompt, use the `psql` connection string from the cheat sheet
    you downloaded to connect to your database.
1.  At the `psql` prompt, type this query:

    <TryItOutCodeBlock queryId="getting-started-srt-first-last" />

1.  Type `q` to return to the `psql` prompt.

</Procedure>

## Use time buckets to get values

To make it easier to look at numbers over different time ranges, you can use the
Timescale `time_bucket` function. Time buckets are used to group data, so that
you can perform calculations over different time periods.

In this section, you use the same query as the previous section to find the
`first` and `last` values, but start by organising the data into 1-day time
buckets.

Start by declaring the time_bucket interval to use, and give your time bucket a
name:

<CodeBlock canCopy={false} showLineNumbers={false} children={`
SELECT time_bucket('1 day', time) AS bucket,
`} />

Then, you can add the query in the same way as you used before:

<CodeBlock canCopy={false} showLineNumbers={false} children={`
    symbol, first(price,time), last(price, time)
FROM stocks_real_time srt
WHERE time > now() - INTERVAL '4 days'
`} />

Finally, organize the results with `GROUP BY` and `ORDER BY`, like this:

<CodeBlock canCopy={false} showLineNumbers={false} children={`
GROUP BY symbol
ORDER BY symbol
`} />

For more information about time bucketing, see the [time bucket section][time-buckets].

<Procedure>

### Using time buckets to get values

1.  At the command prompt, use the `psql` connection string from the cheat sheet
    you downloaded to connect to your database.
1.  At the `psql` prompt, type this query:

    <TryItOutCodeBlock queryId="getting-started-srt-buckets" />

1.  Type `q` to return to the `psql` prompt.

    <Highlight type="note">
    When you create a hypertable, Timescale automatically creates an index on
    the time column. However, you often need to filter your time-series data on
    other columns as well. Using indexes appropriately helps your queries
    perform better. For more information about indexing, see the
    [about indexing section](https://docs.timescale.com/use-timescale/latest/schema-management/about-indexing/)
    </Highlight>

</Procedure>

[first]: /api/:currentVersion:/hyperfunctions/first/
[last]: /api/:currentVersion:/hyperfunctions/last/
[time-buckets]: /use-timescale/:currentVersion:/time-buckets/
