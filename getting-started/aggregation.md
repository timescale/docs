---
title: Aggregation
excerpt: Create an aggregate and query it
products: [cloud]
keywords: [continuous aggregates, create]
layout_components: [next_prev_large]
content_group: Getting started
---

import CaggsIntro from "versionContent/_partials/_caggs-intro.mdx";
import CaggsTypes from "versionContent/_partials/_caggs-types.mdx";
import CandlestickIntro from "versionContent/_partials/_candlestick_intro.mdx";

# Aggregation

Aggregation refers to a number of different calculations that you can perform on
your data. For example, if you have data showing temperature changes over time,
you can calculate an average of those temperatures, or a count of how many
readings have been taken. Average, sum, and count are all example of simple
aggregates.

<CaggsIntro />

<CaggsTypes />

In this section, you create a simple aggregation by finding the average trade
price over a week. Then, you create a materialized
view, transform it into a continuous aggregate, and query it for more
information about the trading data.

## Find average stock prices for the last week

Timescale has custom SQL functions that can help make time-series analysis
easier and faster. In this section, you'll learn about another common
Timescale function, `time_bucket` which allows you to take a time column and
"bucket" the values based on an interval of your choice.

Time bucketing is useful for data like stock data which has a lot of
information. Instead of looking at each trade individually, you can combine the
data into bigger buckets and look at, for example, the data for each day. You
can then perform an aggregation and, for example, get the average of the
values for each day.

In this section, you time bucket the entire dataset for the last week into
days, and calculate the average of each bucket:

<CodeBlock canCopy={false} showLineNumbers={false} children={`
SELECT
  time_bucket('1 day', time) AS bucket,
  symbol,
  avg(price)
FROM stocks_real_time srt
WHERE time > now() - INTERVAL '1 week'
`} />

Then, you organize the results by bucket and symbol:

<CodeBlock canCopy={false} showLineNumbers={false} children={`
GROUP BY bucket, symbol
ORDER BY bucket, symbol
`} />

<Procedure>

### Finding average stock prices for the last week

1.  At the command prompt, use the `psql` connection string from the cheat sheet
    you downloaded to connect to your database.
1.  At the `psql` prompt, type this query:

    ```sql
    SELECT
      time_bucket('1 day', time) AS bucket,
      symbol,
      avg(price)
    FROM stocks_real_time srt
    WHERE time > now() - INTERVAL '1 week'
    GROUP BY bucket, symbol
    ORDER BY bucket, symbol;
    ```

    The data you get back looks a bit like this:

    <CodeBlock canCopy={false} showLineNumbers={true} children={`
                 bucket         | symbol |        avg
    ------------------------+--------+--------------------
     2023-06-01 00:00:00+00 | AAPL   |  179.3242530284364
     2023-06-01 00:00:00+00 | ABNB   | 112.05498586371293
     2023-06-01 00:00:00+00 | AMAT   | 134.41263567849518
     2023-06-01 00:00:00+00 | AMD    | 119.43332772033834
     2023-06-01 00:00:00+00 | AMZN   |  122.3446364966392
     ...
    `} />

</Procedure>

You might notice that the `bucket` column doesn't start at the time that you run
the query. For more information about how time buckets are calculated, see the
[time bucketing section][time-buckets].

## Create an aggregate query

<CandlestickIntro />

In this section, you use a `SELECT` statement to find the high and low values
with `min` and `max` functions, and the open and close values with `first` and
`last` functions. You then aggregate the data into 1 day buckets, like this:

<CodeBlock canCopy={false} showLineNumbers={false} children={`
SELECT
  time_bucket('1 day', "time") AS day,
  symbol,
  max(price) AS high,
  first(price, time) AS open,
  last(price, time) AS close,
  min(price) AS low
FROM stocks_real_time srt
`} />

Then, you organize the results by day and symbol:

<CodeBlock canCopy={false} showLineNumbers={false} children={`
GROUP BY day, symbol
ORDER BY day DESC, symbol
`} />

<Procedure>

### Creating an aggregate query

1.  At the command prompt, use the `psql` connection string from the cheat sheet
    you downloaded to connect to your database.
1.  At the `psql` prompt, type this query:

    <TryItOutCodeBlock query="getting-started-srt-aggregation" />

1.  Type `q` to return to the `psql` prompt.

</Procedure>

## Create a continuous aggregate

Now that you have an aggregation query, you can use it to create a continuous
aggregate.

In this section, your query starts by creating a materialized view called
`stock_candlestick_daily`, then converting it into a Timescale continuous
aggregate:

<CodeBlock canCopy={false} showLineNumbers={false} children={`
CREATE MATERIALIZED VIEW stock_candlestick_daily
WITH (timescaledb.continuous) AS
`} />

Then, you give the aggregate query you created earlier as the contents for the
continuous aggregate:

<CodeBlock canCopy={false} showLineNumbers={false} children={`
SELECT
  time_bucket('1 day', "time") AS day,
  symbol,
  max(price) AS high,
  first(price, time) AS open,
  last(price, time) AS close,
  min(price) AS low
FROM stocks_real_time srt
GROUP BY day, symbol
`} />

When you run this query, you create the view, and populate the view with the
aggregated calculation. This can take a few minutes to run, because it needs to
perform these calculations across all of your stock trade data the first time.

When you continuous aggregate has been created and the data aggregated for the
first time, you can query your continuous aggregate. For example, you can look
at all the aggregated data, like this:

<CodeBlock canCopy={false} showLineNumbers={false} children={`
SELECT * FROM stock_candlestick_daily
  ORDER BY day DESC, symbol;
`} />

Or you can look at a single stock, like this:

<CodeBlock canCopy={false} showLineNumbers={false} children={`
SELECT * FROM stock_candlestick_daily
WHERE symbol='TSLA';
`} />

<Procedure>

### Creating a continuous aggregate

1.  At the command prompt, use the `psql` connection string from the cheat sheet
    you downloaded to connect to your database.
1.  At the `psql` prompt, type this query:

    ```sql
    CREATE MATERIALIZED VIEW stock_candlestick_daily
    WITH (timescaledb.continuous) AS
    SELECT
      time_bucket('1 day', "time") AS day,
      symbol,
      max(price) AS high,
      first(price, time) AS open,
      last(price, time) AS close,
      min(price) AS low
    FROM stocks_real_time srt
    GROUP BY day, symbol;
    ```

1.  Query your continuous aggregate for all stocks:

    <TryItOutCodeBlock query="getting-started-cagg" />

1.  Query your continuous aggregate for Tesla stock:

    <TryItOutCodeBlock query="getting-started-cagg-tesla" />

</Procedure>

For more information about how continuous aggregates work, see the
[continuous aggregates section][continuous-aggregates].

[continuous-aggregates]: /use-timescale/:currentVersion:/continuous-aggregates
[time-buckets]: /use-timescale/:currentVersion:/time-buckets/
