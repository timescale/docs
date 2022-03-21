# Send OpenTelemetry data to Promscale
Promscale natively supports the OpenTelemetry Line Protocol (OTLP) for 
traces. You can use any of the OpenTelemetry client SDKs,
instrumentation libraries or the OpenTelemetry Collector to send traces to
Promscale using OTLP. Currently, only gRPC is supported.

# Configure the OpenTelemetry Collector
You can configure the OpenTelemetry collector to forward traces to Promscale. Promscale listens
to OTLP data on the port you specified with the `otlp-grpc-server-listen-address`
parameter when you started the Promscale connector.

Open the OpenTelemetry collector configuration file, and forward the OTLP traces to Promscale by adding or editing these lines:
```yaml
exporters:
  otlp:
    endpoint: "<connector-host>:<OTLP-port>"
    insecure: true
```

Replace `<connector-host>` and `<OTLP-port>` with the corresponding hostname and port. 
For example, if you are running the OTLP Collector and the Promscale Connector on a 
Kubernetes cluster the endpoint parameter would be similar to
`endpoint: "promscale-connector.default.svc.cluster.local:9202"`

# Configure the OpenTelemetry instrumentation
We recommend that you use the OpenTelemetry Collector to export data to an 
observability backend in production. However, you can also send data from 
OpenTelemetry instrumentation libraries and SDKs directly to Promscale using 
OTLP.

The specifics of the configuration depend on each SDK and library. See the corresponding
GitHub repository or the [OpenTelemetry documentation][otel-docs] for more information.

[otel-docs]: https://opentelemetry.io/docs/instrumentation/
