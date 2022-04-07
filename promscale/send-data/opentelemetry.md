# Send OpenTelemetry data to Promscale
Promscale natively supports the OpenTelemetry Line Protocol (OTLP) for 
traces and Prometheus Remote Write protocol for OpenTelemetry metrics. You can use any of the OpenTelemetry client SDKs,
instrumentation libraries or the OpenTelemetry Collector to send traces and metrics to
Promscale using OTLP. Currently, only **gRPC** is supported for traces, The OpenTelemetry metrics are converted into Prometheus remote write format in OpenTelemetry collector and exported to Promscale **HTTP** endpoint.

## Send data using OpenTelemetry Collector
We recommend that you use the OpenTelemetry Collector to export data to an 
observability backend in production as it offers batching, queued retries, and many other functions by configuring the processors. However, you can also send data from 
OpenTelemetry instrumentation libraries and SDKs directly to Promscale using 
OTLP.

You can configure the OpenTelemetry collector to forward traces and metrics to Promscale. Promscale listens
to OTLP data on the port you specified with the `otlp-grpc-server-listen-address`
parameter, which defaults to port `:9202`. Promscale listens to Prometheus data on the port you specified with the `ee`, which defaults to port `:9201` when you start the Promscale connector.

The below OpenTelemetry collector configuration file, configures 
  * **Receivers**: OpenTelemetry line protool (gRPC, http)
  * **Exporters**: OpenTelemetry line protocol to configure the Promscale gRPC server to export the data to Promscale. Use `queue_size` to hold the data before dropping, and `timeout` is timeout for the write request to the backend, Prometheus remote write exports the OpenTelemetry line protocol metrics to the Prometheus remote storage backend. Configure the Promscale http endpoint to ingest the metrics. 
  * **Processors**: Batch processor is to batch, better compress the data and to control the number of outgoing connections, configured with `send_max_batch_size` and `timeout` to send data as per Promscale recommendation.
  * **Service**: Pipeline to configure to receive the traces and metrics from OTLP, batch process them, and to export the data in logs and OTLP, Prometheus-supported backends.

With this configuration you can send the traces from OpenTelemetry applications to the collector and export them to Promscale.

```yaml
receivers:
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
  prometheusremotewrite:
    endpoint: "<PROMSCALE_HOST>:<HTTP_PORT>/write"
    tls:
      insecure: true


processors:
  batch:
    send_batch_size: 4000
    send_batch_max_size: 4000
    timeout: 10s

service:
  pipelines:
    traces:
      receivers: [otlp]
      exporters: [logging, otlp]
      processors: [batch]
    metrics:
      receivers: [otlp]
      processors: [batch]
      exporters: [prometheusremotewrite]
```

Replace `<PROMSCALE_HOST>`, `<gRPC_PORT>` and `<HTTP_PORT>` with the corresponding Promscale hostname, gRPC port, and HTTP port. 
For example, if you are running the OTLP Collector and the Promscale Connector on a 
Kubernetes cluster the endpoint parameter would be similar to
`endpoint: "promscale-connector.default.svc.cluster.local:<PORT>"`

## Send data using OpenTelemetry Instrumentation SDKs
With Opentelemetry SDKs you can send OpenTelemetry traces using OTLP gRPC endpoint by configuring the exporter backend using the `OTEL_EXPORTER_OTLP_TRACES_ENDPOINT` environment variable on your application's end, which means the SDK that you are using should support gRPC, If the SDK does not support then use the OpenTelmetry collector to convert OTLP http to gRPC using the OTLP http receiver and OTLP gRPC exporter collector configuration.   

The specifics of the configuration depend on each SDK and library. See the corresponding
GitHub repository or the [OpenTelemetry documentation][otel-docs] for more information.

[otel-docs]: https://opentelemetry.io/docs/instrumentation/
