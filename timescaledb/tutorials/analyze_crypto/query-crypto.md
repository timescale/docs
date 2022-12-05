---
title: Verb the widget tutorial - query the data
excerpt: Query data to verb your widgets to achieve an outcome using the tool
keywords: [noun, verb, tutorial]
tags: [noun, noun]
---

<!-- markdown-link-check-disable -->

# Query the data

Use this section to talk about the queries that readers can do on the dataset.
Make sure you reference which questions are being answered by the queries.

## The first query

This should be the simplest query. Start by explaining which question the query
answers. Then explain how the query is constructed, then provide the query in a
code block.

Provide example results of the query, using either a code block or, if more
appropriate, an image.

## The second query

Continue to build on the first query you presented, providing more information,
explaining the query, and continuing to explain which questions are being
answered. Repeat as required.

Include any reference-style links at the bottom of the page.

How did Bitcoin price in USD vary over time?

SELECT time_bucket('7 days', time) AS period,
        last(price, time) AS price
FROM crypto_ticks
WHERE symbol = 'BTC/USD'
GROUP BY period
ORDER BY period;

         period         |  price
------------------------+---------
 2022-10-31 00:00:00+00 | 20917.5
 2022-11-07 00:00:00+00 | 16304.4
 2022-11-14 00:00:00+00 | 16257.7
 2022-11-21 00:00:00+00 | 16419.6
 2022-11-28 00:00:00+00 | 16952.9
(5 rows)

How did the trading volume of Bitcoin vary over time in USD?

SELECT time_bucket('7 days', time) AS period,
        symbol,
        sum(day_volume)
FROM crypto_ticks
WHERE symbol = 'BTC/USD'
GROUP BY symbol, period
ORDER BY period;

         period         | symbol  |    sum
------------------------+---------+------------
 2022-10-31 00:00:00+00 | BTC/USD |  783747868
 2022-11-07 00:00:00+00 | BTC/USD | 4205018656
 2022-11-14 00:00:00+00 | BTC/USD | 1540567801
 2022-11-21 00:00:00+00 | BTC/USD | 1934759217
 2022-11-28 00:00:00+00 | BTC/USD | 1858508868
(5 rows)
