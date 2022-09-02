---
title: Send Jaeger traces to Promscale
excerpt: Send Jaeger traces to Promscale
product: promscale
keywords: [Jaeger]
tags: [configure, traces]
---

# Send Jaeger traces to Promscale
Promscale natively supports both Jaeger gRPC based remote storage(Promscale >= 0.14.0) and
OpenTelemetry Protocol (OTLP) for traces.
To ingest Jaeger traces to Promscale, you can use either of the following,
 - Use the Jaeger Collector, it ingests Jaeger spans directly to configured remote storage and 
this avoid using any non Jaeger components like OpenTelemetry collector.
 - Use the OpenTelemetry Collector, it converts Jaeger traces to OpenTelemetry traces.

# Send data using the Jaeger Collector
You can configure the Jaeger Collector to store the traces using Promscale's native 
implementation of [Jaeger gRPC storage specification][jaeger-grpc-storage].

Here's an example configuration to enable the Jaeger collector to forward traces
to Promscale.

```sh
docker run \
  -e SPAN_STORAGE_TYPE=grpc-plugin \
  -e GRPC_STORAGE_SERVER="<PROMSCALE_HOST>:<gRPC_PORT>" \
  jaegertracing/jaeger-collector:1.37.0
```

Where: 
* `<PROMSCALE_HOST>`: hostname of Promscale.
* `<gRPC_PORT>`: gRPC port of Promscale. The default port is 9202.

If you are running the Jaeger Collector and the Promscale Connector on a
Kubernetes cluster, the endpoint parameter is similar to `endpoint:
"promscale-connector.default.svc.cluster.local:<PORT>"`

Note: We recommend to use this option unless otherwise you need additional capabilities
offered by [OpenTelemetry collector][otelcol-config].

# Send data using the OpenTelemetry Collector
You can configure the OpenTelemetry Collector to forward Jaeger traces to Promscale
using the [Jaeger receiver][jaeger-receiver] and the OpenTelemetry exporter.

Here's an example configuration file for the OpenTelemetry Collector to forward
traces to Promscale after batch processing the data:

```yaml
receivers:
  jaeger:
    protocols:
      grpc:
      thrift_binary:
      thrift_compact:
      thrift_http:
exporters:
  otlp:
    endpoint: "<PROMSCALE_HOST>:<gRPC_PORT>"
    tls:
      insecure: true
    sending_queue:
      queue_size: 1000000
    timeout: 10s
processors:
  batch:
    send_batch_size: 4000
    send_batch_max_size: 4000
    timeout: 10s
service:
  pipelines:
    traces:
      receivers: [jaeger]
      exporters: [otlp]
      processors: [batch]
```

Where: 
* `<PROMSCALE_HOST>`: hostname of Promscale.
* `<gRPC_PORT>`: gRPC port of Promscale. The default port is 9202.

If you are running the OTLP Collector and the Promscale Connector on a
Kubernetes cluster, the endpoint parameter is similar to `endpoint:
"promscale-connector.default.svc.cluster.local:<PORT>"`

The default ports exposed by the OpenTelemetry Collector Jaeger receiver are:
* `14250` : gRPC
* `6832`  : thrift_binary
These are the ports where you should send your Jaeger traces. 
* `6831`  : thrift_compact
* `14268` : thrift_http

For more information about the OpenTelemetry Collector, see the
[OpenTelemetry documentation][otelcol-docs].

[jaeger-receiver]: https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/jaegerreceiver#jaeger-receiver
[otelcol-docs]: https://opentelemetry.io/docs/collector/
[jaeger-grpc-storage]: https://www.jaegertracing.io/docs/next-release/deployment/#remote-storage-model
[otelcol-config]: https://opentelemetry.io/docs/collector/configuration/
