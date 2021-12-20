# Promscale
Promscale is the open source observability backend for metrics and traces
powered by SQL.

It is built on top of PosgreSQL and TimescaleDB and has native support for
Prometheus metrics (including 100% PromQL compliance) and OpenTelemetry traces.
It's full SQL capabilities enable developers to correlate metrics, traces and
also business data to derive new valuable insights not possible when data is
siloed in different systems.

*   [Learn about Promscale][about-promscale] to understand how it works before
    you begin using it.
*   [Learn about Promscale benefits][promscale-benefits] to understand how it
    can be useful in your environment.
*   [Learn about Promscale installation][install-promscale] to understand how
    to install using source, docker and kubernetes.
*   [Learn about tobs][about-tobs] to understand how to install a complete
    observability stack on Kubernetes.
*   Use Promscale to [run queries][promscale-run-queries].
*   Use Promscale with [visualization tools][promscale-visualization].

For more about Promscale, see our [developer documentation][promscale-gh-docs].


[about-promscale]: promscale/:currentVersion:/about-promscale
[install-promscale]: promscale/:currentVersion:/installation
[promscale-benefits]: promscale/:currentVersion:/promscale-benefits/
[promscale-run-queries]: promscale/:currentVersion:/promscale-run-queries/
[promscale-visualization]: promscale/:currentVersion:/promscale-visualization/
[promscale-gh-docs]: https://github.com/timescale/promscale/
[about-tobs]: promscale/:currentVersion:/tobs/
