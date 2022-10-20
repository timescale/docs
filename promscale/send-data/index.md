---
title: Send data to Promsacle
excerpt: Send data to Promscale from Prometheus, OpenTelemetry, and other tools
product: promscale
---

# Send data to Promscale

Promscale has native support for ingesting Prometheus and OpenTelemetry data.
It also has APIs that you can use to send metrics in a variety of formats.

*   [Configure Prometheus][configure-prometheus] to send metrics to Promscale.
*   [Configure OpenTelemetry][configure-opentelemetry] to send data to Promscale.
*   [Configure Jaeger][configure-jaeger] to send data to Promscale.
*   [Configure Zipkin][configure-zipkin] to send data to Promscale via the
    OpenTelemetry Collector.
*   [Use Promscale's remote-write API][promscale-write-api] to send metrics in
    JSON, Protobuf, or text format.

[configure-jaeger]: /promscale/:currentVersion:/send-data/jaeger/
[configure-opentelemetry]: /promscale/:currentVersion:/send-data/opentelemetry/
[configure-prometheus]: /promscale/:currentVersion:/send-data/prometheus/
[configure-zipkin]: /promscale/:currentVersion:/send-data/zipkin/
[promscale-write-api]: /promscale/:currentVersion:/send-data/remote-write/
