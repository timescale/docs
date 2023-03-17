Before you begin, make sure you have:

*   Installed [Grafana][install-grafana] version&nbsp;8.5 or higher
*   Installed [Timescale][install-timescale]
*   Imported the stock trade data from the [Getting Started Tutorial][gsg-data]

If you are new to Grafana, see the [Grafana tutorials][grafana-tutorials]
to get familiar with creating your first dashboard and visualizations. Also
see [this tutorial on adding variables to Grafana][variables-tutorial].

The examples in this section use these variables and Grafana functions:

*   `$symbol`: a variable used to filter results by stock symbols.
*   `$__timeFrom()::timestamptz` & `$__timeTo()::timestamptz`:
    Grafana variables. You change the values of these variables by
    using the dashboard's date chooser when viewing your graph.
*   `$bucket_interval`: the interval size to pass to the `time_bucket`
    function when aggregating data.

[install-grafana]: https://grafana.com/get/
[install-timescale]: /install/:currentVersion:/
[gsg-data]: /getting-started/:currentVersion:/add-data/
[grafana-tutorials]: /timescaledb/:currentVersion:/tutorials/grafana/
[variables-tutorial]: https://youtu.be/Fq9xsvHPsSQ
