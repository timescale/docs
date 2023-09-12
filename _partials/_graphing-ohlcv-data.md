## Graph OHLCV data

When you have extracted the raw OHLCV data, you can use it to graph the result
in a candlestick chart, using Grafana. To do this, you need to have Grafana set
up to connect to your TimescaleDB database.

<Procedure>

### Graphing OHLCV data

1.  Ensure you have Grafana installed, and you are using the TimescaleDB
    database that contains the Twelve Data stocks dataset set up as a
    data source.
1.  In Grafana, from the `Dashboards` menu, click `New Dashboard`. In the
    `New Dashboard` page, click `Add a new panel`.
1.  In the `Visualizations` menu in the top right corner, select `Candlestick`
    from the list. Ensure you have set the Twelve Data stocks dataset as
    your data source.
1.  Click `Edit SQL` and paste in the query you used to get the OHLCV values.
1.  In the `Format as` section, select `Table`.
1.  Adjust elements of the table as required, and click `Apply` to save your
    graph to the dashboard.

    <img class="main-content__illustration"
         width={1375} height={944}
         src="https://assets.timescale.com/docs/images/Grafana_candlestick_1day.webp"
         alt="Creating a candlestick graph in Grafana using 1-day OHLCV tick data"
    />

</Procedure>
