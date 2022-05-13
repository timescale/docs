# Send data to Promscale
Promscale has native support for ingesting Prometheus and OpenTelemetry data.
It also has APIs that you can use to send metrics in a variety of formats.

*   [Configure Prometheus][configure-prometheus] to send metrics to Promscale.
*   [Configure OpenTelemetry][configure-opentelemetry] to send data to Promscale.
*   [Configure Jaeger] to send data to Promscale via the OpenTelemetry Collector
*   [Configure Jaeger] to send data to Promscale via the OpenTelemetry Collector
*   [Use Promscale's write api][promscale-write-api] to send metrics in 
    json, protobuf or text format.

[configure-prometheus]: promscale/:currentVersion:/send-data/prometheus/
[configure-opentelemetry]: promscale/:currentVersion:/send-data/opentelemetry/
[promscale-write-api]: https://github.com/timescale/promscale/blob/master/docs/writing_to_promscale.md