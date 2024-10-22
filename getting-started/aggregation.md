---
title: Continuous aggregation
excerpt: Create an aggregate and query it
products: [cloud]
keywords: [continuous aggregates, create]
layout_components: [next_prev_large]
content_group: Getting started
---

import CaggsIntro from "versionContent/_partials/_caggs-intro.mdx";
import CaggsTypes from "versionContent/_partials/_caggs-types.mdx";
import CandlestickIntro from "versionContent/_partials/_candlestick_intro.mdx";

# Continuous aggregation

Aggregation is a way of combing data to get insights from it. At its simplest,
aggregation is something like looking for an average. For example, if you have
data showing temperature changes over time, you can calculate an average of
those temperatures, or a count of how many readings have been taken. Average,
sum, and count are all example of simple aggregates.

However, aggregation calculations can get big and slow, quickly. If you want to
find the average open and closing values of a range of stocks for each day, then
you need something a little more sophisticated. That's where $COMPANY 
$CAGGs come in. A $CAGG can minimize the number of
records that you need to look up to perform your query.

## $CAGG_CAPs

<CaggsIntro />

<CaggsTypes />

In this section, you create a $CAGG, and query it for more
information about the trading data.

## Create an aggregate query

<CandlestickIntro />

In this section, you use a `SELECT` statement to find the high and low values
with `min` and `max` functions, and the open and close values with `first` and
`last` functions. You then aggregate the data into 1-day buckets, like this:

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

    <TryItOutCodeBlock queryId="getting-started-srt-aggregation" />

1.  Type `q` to return to the `psql` prompt.

</Procedure>

## Create a $CAGG

Now that you have an aggregation query, you can use it to create a $CAGG.

In this section, your query starts by creating a materialized view called
`stock_candlestick_daily`, then converting it into a $COMPANY $CAGG:

<CodeBlock canCopy={false} showLineNumbers={false} children={`
CREATE MATERIALIZED VIEW stock_candlestick_daily
WITH (timescaledb.continuous) AS
`} />

Then, you give the aggregate query you created earlier as the contents for the
$CAGGs:

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

When your $CAGG has been created and the data aggregated for the
first time, you can query your $CAGG. For example, you can look
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

### Creating a $CAGG

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

1.  Query your $CAGG for all stocks:

    <TryItOutCodeBlock queryId="getting-started-cagg" />

1.  Query your $CAGG for Tesla stock:

    <TryItOutCodeBlock queryId="getting-started-cagg-tesla" />

</Procedure>

For more information about how $CAGGs work, see the
[$CAGGs section][continuous-aggregates].

[continuous-aggregates]: /use-timescale/:currentVersion:/continuous-aggregates
[time-buckets]: /use-timescale/:currentVersion:/time-buckets/
