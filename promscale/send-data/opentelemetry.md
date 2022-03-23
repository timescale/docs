# Send OpenTelemetry data to Promscale
Promscale natively supports the OpenTelemetry Line Protocol (OTLP) for 
traces. You can use any of the OpenTelemetry client SDKs,
instrumentation libraries or the OpenTelemetry Collector to send traces to
Promscale using OTLP. Currently, only **gRPC** is supported.

## Send data using OpenTelemetry Collector
You can configure the OpenTelemetry collector to forward traces to Promscale. Promscale listens
to OTLP data on the port you specified with the `otlp-grpc-server-listen-address`
parameter when you started the Promscale connector.

The below OpenTelemetry collector configuration file, configures 
  * **Receivers**: Jaeger (gRPC, thrift http), OpenTelemetry line protool (gRPC, http)
  * **Exporters**: OpenTelemetry line protocol configure the Promscale gRPC server to export the data to Promscale, queue_size to hold the data before dropping and `timeout` is timeout for write request to backend. 
  * **Processors**: Batch processor is to batch, better compress the data and to control the number of outgoing connections, configured with `send_max_batch_size` and `timeout` to send data as per Promscale recommendation.
  * **Service**: Pipeline is to configure to receive the data from Jaeger and OTLP, batch process them and to export the data in logs and to OTLP supported backend.

With below configuration you can send the traces from Jaeger and OpenTelemetry applications to the collector and can be exported the ame to Promscale. 

```yaml
receivers:
  jaeger:
    protocols:
      grpc:
      thrift_http:
  otlp:
    protocols:
      grpc:
      http:

exporters:
  logging:
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
      receivers: [jaeger, otlp]
      exporters: [logging, otlp]
      processors: [batch]
```

Replace `<PROMSCALE_HOST>` and `<gRPC_PORT>` with the corresponding Promscale hostname and gRPC port. 
For example, if you are running the OTLP Collector and the Promscale Connector on a 
Kubernetes cluster the endpoint parameter would be similar to
`endpoint: "promscale-connector.default.svc.cluster.local:9202"`

## Send the data using OpenTelemetry instrumentation
We recommend that you use the OpenTelemetry Collector to export data to an 
observability backend in production as it offers batching, queued retries and many other functionalities by configuring the processors. However, you can also send data from 
OpenTelemetry instrumentation libraries and SDKs directly to Promscale using 
OTLP.

With Opentelemetry SDKs you can configure the exporter backend using `OTEL_EXPORTER_OTLP_TRACES_ENDPOINT` environment variable on your applications end. 

The specifics of the configuration depend on each SDK and library. See the corresponding
GitHub repository or the [OpenTelemetry documentation][otel-docs] for more information.

[otel-docs]: https://opentelemetry.io/docs/instrumentation/
