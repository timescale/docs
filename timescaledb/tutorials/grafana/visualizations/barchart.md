# Build a bar chart in Grafana

A bar chart also known as a bar graph displays data using a number of bars, each representing a specific category. A bar chart is an effective way to compare items between different groups. It consists of two axes, vertical, and horizontal. It is important to note that the longer a bar is, the greater its value.

They can answer questions like

* Which stock has the highest traded volume today?
* What was the transaction volume distribution of stocks last week?
* How many students in grade A are above a certain age range?

## Data for Grafana bar charts

To plot a bar graph, Grafana requires you to provide only one data frame which is the supported format and it needs to have at least one string field that is used as the category for an X or Y axis and one or more numerical fields. To plot multiple bar graphs in a single panel on Grafana, you have to provide multiple value columns.

This tutorial shows you how to:

1. [Create a bar graph with pre-aggregated data using time_bucket()][#create-a-bar-chart-with-preaggregated-data].
2. [Create multiple bar graphs in a single panel][#create-multiple-bar-chart].
3. [Create a stacked bar graph with pre-aggregated][#create-stacked-bar-chart].

When presenting data using a bar graph, there are several kinds to consider, the vertical, horizontal, and stacked bar graph which shall be discussed in the tutorial.

## Prerequisites

Before you begin, make sure you have:

* Installed [Grafana][install-grafana] version&nbsp;8.5 or higher
* Installed [TimescaleDB][install-timescale]
* Imported the stock trade data from the [Getting Started Tutorial][gsg-data]

If you are new to Grafana, see the [Grafana tutorials][grafana-tutorials]
to get familiar with creating your first dashboard and visualizations. Also
see [this tutorial on adding variables to Grafana][variables-tutorial].

The examples in this section use these variables and Grafana functions:

* `$symbol`: a variable used to filter results by stock symbols.
* `$__timeFrom()::timestamptz` & `$__timeTo()::timestamptz`:
  Grafana variables. You change the values of these variables by
  using the dashboard's date chooser when viewing your graph.
* `$bucket_interval`: the interval size to pass to the `time_bucket`
  function when aggregating data.

## Create a bar chart with preaggregated data

Create a bar chart visualization using the data in the table `stocks_real_time`.

<procedure>

### Creating a bar chat with preaggregated data

  1. In the query editor, use this SQL to query a bar chart dataset. Use the variable `$bucket interval`
     for the time period covered by the bar chart.

        ```sql
        SELECT
            time_bucket('$bucket_interval', time) AS time,
            symbol,
            AVG(price) as price
        FROM stocks_real_time srt
        WHERE symbol = $symbol
            AND time >= $__timeFrom()::timestamptz AND time < $__timeTo()::timestamptz
        GROUP BY time_bucket('$bucket_interval', time), symbol;
        ```

  1. Select a stock from the dashboard variable option. Adjust the time range of the dashboard if needed.

  1. The returned data looks like this:

        <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tutorials/visualizations/barchart/Tabledataforgoogle.png" alt="Screenshot of the table view of valid time series data for google stock."/>

        Time is an important factor in any time-series data used by Grafana, it must have a column named time with timestamp data. The timestamps are usually in ascending order, it mostly throws when otherwise.

  1. Select bar chart as your visualization type

        <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tutorials/visualizations/barchart/barchartvisualisation.png" alt="Screenshot of the Grafana dashboard. The 'Visualizations' tab is focused. Underneath, 'Bar chart' shows as a visualization type."/>

  1. Grafana turns the query into something that looks like this:

        <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tutorials/visualizations/barchart/googlebarchart.png" alt="Screenshot of the vertical bar graph produced by Grafana. The vertical bar graph represents the price of Google in the past 2 months."/>

        This shows a vertical bar chart price distribution of Google stock which ranges between $2836 and $2108 within a specific period.

  1. Converting this vertical chart to a horizontal bar chart looks like this, it gives room for a
     longer label along the vertical axis if needed. On the right side of the dashboard, scroll to the bar chart section. Click the drop down and select horizontal as orientation.

        <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tutorials/visualizations/barchart/horizontalbarchart.png" alt="Screenshot of the Grafana dashboard. The 'horizontal orientation' tab is focused. Underneath, 'X-Axis' shows the orientation type."/>

  1. The bar chart should look like this:

        <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tutorials/visualizations/barchart/googlebarchart.png" alt="Screenshot of the horizontal bar graph produced by Grafana. The horizontal bar graph represents the price of google in the past 2 months."/>

</procedure>

## Create multiple bar charts

To compare the distributions of 4 or more different stocks, create a panel with multiple bar chart. Go to the variable section in the settings page of your panel, the symbol variable, and enable the multi-value option. This allows you to select more than one value for the $symbol. The database returns the transactions for all selected values, and Grafana buckets them in separate bar charts.

<procedure>

### Creating multiple bar chart in a single panel

  1. Fetch all company symbols from the dataset in the [Getting Started Tutorial][gsg-data] using
      the query below:

       ```sql
        SELECT
            DISTINCT symbol FROM company ORDER BY symbol ASC;     
        ```

  1. Select type query to have the option to add the query above, and update as shown below:

     <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tutorials/visualizations/barchart/Variables.png" alt="Grafana screenshot showing the Variables > Edit dialog. The variable name is 'symbol', the type is 'query', and the query written fetches all company symbol available on company table"/>

  1. Update the first query with the following:

     ```sql
        SELECT
            time_bucket('$bucket_interval', time) AS time,
            symbol,
            AVG(price) as price
        FROM stocks_real_time srt
        WHERE symbol IN ($symbol)
            AND time >= $__timeFrom()::timestamptz AND time < $__timeTo()::timestamptz
        GROUP BY time_bucket('$bucket_interval', time), symbol;     
        ```

        This query makes it possible to have multiple symbols in the query. Select as many symbols you want to compare and refresh the dashboard.

  1. The returned data looks like this:

      <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tutorials/visualizations/barchart/tableviewfivestockdata.png" alt="Screenshot of the table view of valid time series data for 'AAPL, ABNB, AMAT, ABGN, HD' stock."/>

  1. This query gives the following:

      <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tutorials/visualizations/barchart/multiplebarchart.png" alt="Screenshot of the multiple bar graph produced by Grafana. The multiple bar graph represents the price of 'AAPL, ABNB, AMAT, ABGN, HD' in the past 1 month."/>

      We can clearly see 5 different stocks "AAPL, ABNB, AMAT, AMGN, and HD" but can barely differentiate them. To tell them apart, adjust the color of each stock.

  1. Click on each line by the left of each legend and pick any desired color for each bar

      <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tutorials/visualizations/barchart/colorinbarchart.png" alt="Screenshot of Grafana plot, showing different colors to select for a bar chart."/>
  
  1. The graph clearly shows 5 different price distributions in different colors.

      <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tutorials/visualizations/barchart/multicoloredbarchart.png" alt="Screenshot of Grafana plot, showing 5 bar chart of stock values in green, blue, red, purple and orange."/>

</procedure>

[install-grafana]: https://grafana.com/get/
[install-timescale]: /install/:currentVersion:/
[gsg-data]: /getting-started/:currentVersion:/add-data/
[grafana-tutorials]: /timescaledb/:currentVersion:/tutorials/grafana/
[variables-tutorial]: https://youtu.be/Fq9xsvHPsSQ
