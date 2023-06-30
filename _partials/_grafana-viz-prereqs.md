Before you begin, make sure you have:

*   Created a [Timescale][cloud-login] service.
*   Installed a self-managed Grafana account, or signed up for
    [Grafana Cloud][install-grafana].
*   Ingested some data to your database. You can use the stock trade data from
    the [Getting Started Guide][gsg-data].

The examples in this section use these variables and Grafana functions:

*   `$symbol`: a variable used to filter results by stock symbols.
*   `$__timeFrom()::timestamptz` & `$__timeTo()::timestamptz`:
    Grafana variables. You change the values of these variables by
    using the dashboard's date chooser when viewing your graph.
*   `$bucket_interval`: the interval size to pass to the `time_bucket`
    function when aggregating data.

[install-grafana]: https://grafana.com/get/
[gsg-data]: /getting-started/:currentVersion:/
[cloud-login]: https://console.cloud.timescale.com/
