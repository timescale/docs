Before you begin, make sure you have:

*   Created a [$SERVICE_LONG][cloud-login].
*   Installed a self-managed Grafana account, or signed up for
    [Grafana Cloud][grafana-cloud].
*   Ingested some data to your database. You can use the stock trade data from
    the [Try the key features in $COMPANY products][try-timescale-features].

The examples in this section use these variables and Grafana functions:

*   `$symbol`: a variable used to filter results by stock symbols.
*   `$__timeFrom()::timestamptz` & `$__timeTo()::timestamptz`:
    Grafana variables. You change the values of these variables by
    using the dashboard's date chooser when viewing your graph.
*   `$bucket_interval`: the interval size to pass to the `time_bucket`
    function when aggregating data.

[cloud-login]: https://console.cloud.timescale.com/
[grafana-cloud]: https://grafana.com/get/
[try-timescale-features]: /getting-started/:currentVersion:/try-key-features-timescale-products/
