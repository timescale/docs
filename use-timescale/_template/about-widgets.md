{/* vale off */}
# About widgets
This page collects all the concept information about the feature. It answers the
question "What is it"? This page should not include any procedures, but it can
contain code samples if they are being used to explain the feature. Break this
page up in a way that is logical, starting from simpler concepts and moving to
more complicated ones. Use diagrams and screenshots sparingly, and ensure they add
value.

For example:

```txt
Time-series data usually grows very quickly. Large data volumes can become slow
when aggregating the data into useful summaries. To make aggregating data
faster, TimescaleDB uses continuous aggregates. For example, if you have a table
of temperature readings over time in a number of locations, and you want to find
the average temperature in each location, you can calculate the average as a
one-off, with a query like this:

```sql
SELECT time_bucket('1 day', time) as day,
       location,
       avg(temperature)
FROM temperatures
GROUP BY day, location;
```

If you want to run this query more than once, the database needs to scan the
entire table and recalculate the average every time. In most cases, though, the
data in the table has not changed significantly, so there is no need to scan the
entire dataset. Continuous aggregates automatically, and in the background,
maintain the results from the query, and allow you to retrieve them in the same
way as any other data.
```

Include reference-style links at the bottom of the page.
