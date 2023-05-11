---
title: Using Tableau to visualize data in TimescaleDB
excerpt: Use Tableau to plot and visualize your data
products: [cloud, mst, self_hosted]
keywords: [visualizations, analytics, Tableau]
---

# Using Tableau to visualize data in TimescaleDB

[Tableau][get-tableau] is a popular analytics platform that enables you to gain
greater intelligence about your business. It is an ideal tool for visualizing
data stored in [TimescaleDB][timescale-products].

This tutorial covers:

*   Setting up Tableau to work with TimescaleDB
*   Running queries on TimescaleDB from within Tableau
*   Visualize data in Tableau

### Prerequisites

To complete this tutorial, you need a cursory knowledge of the Structured Query
Language (SQL). The tutorial walks you through each SQL command, but it is
helpful if you've seen SQL before.

To start, [install TimescaleDB][install-timescale]. When your installation is
complete, you can proceed to ingesting or creating sample data and finishing the
tutorial.

Also, [get a copy or license of Tableau][get-tableau].

You also want to [complete the Cryptocurrency tutorial][crypto-tutorial], as it
sets up and configures the data you need to complete the remainder of this
tutorial. You can visualize many of the queries found at the end of the
Cryptocurrency tutorial.

### Step 1: Setup Tableau to connect to TimescaleDB

Locate the `host`, `port`, and `password` of your TimescaleDB instance.

Connecting your TimescaleDB instance to Tableau takes just a few clicks, thanks
to Tableau's  built-in Postgres connector. To connect to your database add a new
connection and under the  'to a server' section, select PostgreSQL as the
connection type. Then enter your database  credentials.

### Step 2: Run a simple query in Tableau

Let's use the built-in SQL editor in Tableau. To run a query, add custom SQL to your data source
by dragging and dropping the "New Custom SQL" button (in the bottom left of the Tableau desktop
user interface) to the place that says 'Drag tables here'.

Type a query in the dialog box. In this case, use the first
query from the [Cryptocurrency Tutorial][crypto-tutorial]:

```sql
SELECT time_bucket('7 days', time) AS period,
      last(closing_price, time) AS last_closing_price
FROM btc_prices
WHERE currency_code = 'USD'
GROUP BY period
ORDER BY period
```

You should see the same results in Tableau that you see when you run the query in the
`psql` command line.

Let's also name our data source 'btc_7_days', which you can see below.

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/screenshots-for-tableau-tutorial/tableau-simple-query-results.png" alt="Using Tableau to view time-series data"/>

### Step 3: Visualize data in Tableau

Results in a table are only so useful, graphs are much better! So in our final
step, let's take our output from the previous step and turn it into an interactive
graph in Tableau.

To do this, create a new worksheet (or dashboard) and then select your desired data source
(in our case 'btc_7_days'), as shown below.

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/screenshots-for-tableau-tutorial/tableau-new-worksheet.png" alt="New worksheet in Tableau to examine time-series data"/>

In the far left pane, you'll see a section Tableau calls 'Dimensions' and 'Measures'.
Whenever you use Tableau, it classifies your fields as either dimensions or
measures. A measure is a field that is a dependent variable, meaning its value is a
function of one or more dimensions. For example, the price of an item on a given day
is a measure based on which day is in question. A dimension, therefore, is an
independent variable. In our example, the given day does not change based on
any other value in our database.

To put it in more direct terms, July 4, 1776 is still July 4, 1776, even if the
price of tea skyrockets. However, the price of tea may change, depending on which
day you are looking into.

So, in this case, move the dimension `period` into the Columns section of
your worksheet, and examine the `last_closing_price` measure depending
on a given `period`. In Tableau, you can drag and drop these elements into the
proper place, like this:

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/screenshots-for-tableau-tutorial/tableau-dimension-measure-setup.png" alt="New dimensions and measures in Tableau to examine time-series data"/>

Now this graph doesn't quite have the level of fidelity you want because
the data points are being grouped by year. To fix this, click on the drop down
arrow on period and select 'exact date'.

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/screenshots-for-tableau-tutorial/tableau-granular.png" alt="Analyze granular data in Tableau to examine time-series data"/>

Tableau is a powerful business intelligence tool and an ideal companion to data
stored in TimescaleDB. This tutorial only scratched the surface of the kinds of
data you can visualize using Tableau.

### Conclusion

In this tutorial, you learned how to setup Tableau to examine time-series data
stored in TimescaleDB.

Ready for more learning? Here's a few suggestions:

*   [Time Series Forecasting using TimescaleDB, R, Apache MADlib and Python][time-series-forecasting]
*   [Continuous Aggregates][continuous-aggregates]
*   [Migrate your own Data][migrate]

[continuous-aggregates]: /use-timescale/:currentVersion:/continuous-aggregates/
[crypto-tutorial]: /tutorials/:currentVersion:/analyze-cryptocurrency-data/
[get-tableau]: https://www.tableau.com/products/trial/
[install-timescale]: /getting-started/latest/
[migrate]: /use-timescale/:currentVersion:/migration/
[time-series-forecasting]: /tutorials/:currentVersion:/time-series-forecast/
[timescale-products]: https://www.timescale.com/products/
