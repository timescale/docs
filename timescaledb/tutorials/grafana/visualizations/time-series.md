# Build a time-series graph in Grafana 
A time-series graph is a line graph consisting series of data points in order on
cartesian coordinates. They are useful for visualizing trends and fluctuations 
in the data. The time-series graph is the most common type of graph in Grafana
and is therefore the default panel type.

They answer questions like:

* What is the hourly stock price of AMD today?
* How many users signed up to my website each day in the past week?
* What was the temperature in yesterday?

## Data for Grafana time-series graphs 
To plot a time-series graph, Grafana requires you to provide a time column and 
the respective value column. To plot multiple time-series graphs at once you 
need to provide multiple value columns.

Below you find an example of valid time-series data:
```bash
       Time         | Value 1 | Value 2 |
--------------------+---------+---------+
2022-02-08 07:30:01 |      10 |       1 |
2022-02-08 07:31:01 |      15 |       2 |
2022-02-08 07:32:01 |      20 |       3 |
2022-02-08 07:33:01 |      25 |       4 |
2022-02-08 07:34:01 |      30 |       5 |
```

## What you'll learn
This tutorial shows you how to:
* Create a time-series graph from raw data
* Create a time-series graph from pre-aggregated data
* Create multiple time-series graphs in a single panel

## Prerequisites
Before you begin, make sure you have:
* Installed Grafana version&nbsp;8.5 or higher
* Installed [TimescaleDB][install-timescale]
* Imported the stock trade data from the [Getting Started Tutorial][gsg-data]

If you are new to Grafana, see the
[Grafana tutorials][grafana-tutorials]
to get familiar with creating your first dashboard and visualizations before you
start.

The examples in this section use these variables and Grafana functions:
* `$symbol`: a variable used to filter results by stock symbols.
* `$bucket_interval`: the interval size to pass to the `time_bucket`
  function when aggregating data.
* `$__timeFrom()::timestamptz` & `$__timeTo()::timestamptz`:
  Grafana variables. You change the values of these variables by
  using the dashboard's date chooser when viewing your graph.
