# Send Jaeger traces to Promscale
Promscale natively supports the OpenTelemetry Protocol (OTLP) for traces.
To ingest Jaeger traces to Promscale, use the OpenTelemetry Collector.
The OpenTelemetry Collector converts Jaeger traces to OpenTelemetry traces.

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
Kubernetes cluster the endpoint parameter is similar to `endpoint:
"promscale-connector.default.svc.cluster.local:<PORT>"`

The default ports exposed by Jaeger receiver are
* `14250` : gRPC
* `6832`  : thrift_binary
* `6831`  : thrift_compact
* `14268` : thrift_http

For more information about the OpenTelemetry Collector, see the
[OpenTelemetry documentation][otelcol-docs].

[otelcol-docs]: https://opentelemetry.io/docs/collector/
[jaeger-receiver]:
    https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/jaegerreceiver#jaeger-receiver