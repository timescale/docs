# Send OpenTelemetry data to Promscale
Promscale natively supports the OpenTelemetry Line Protocol (OTLP) for traces
and Prometheus remote write protocol for OpenTelemetry metrics. You can use any
of the OpenTelemetry client SDKs, instrumentation libraries, or the
OpenTelemetry Collector to send traces and metrics to Promscale using OTLP.
Currently, Promscale supports only **gRPC** for traces. The OpenTelemetry
metrics are converted into Prometheus remote write format in OpenTelemetry
Collector and exported to Promscale **HTTP** endpoint.

## Send data using OpenTelemetry Collector
We recommend that you use the OpenTelemetry Collector to export data to an
observability backend in a production environment because it offers batching,
queued retries, and many other functions that can be configured in the
processors. However, you can also send data from OpenTelemetry instrumentation
libraries and SDKs directly to Promscale using OTLP.

You can configure the OpenTelemetry Collector to forward traces and metrics to
Promscale. Promscale listens to OTLP data on the port you specified in the
`otlp-grpc-server-listen-address` parameter, which defaults to port `:9202`.
Promscale listens to Prometheus data on the port you specified in the `ee`,
which defaults to port `:9201` when you start the Promscale connector.

Configure the following in OpenTelemetry Collector configuration file:
  * **Receivers**: to push or pull data into the Collector. OpenTelemetry line
    protool (gRPC, http)
  * **Exporters**: to push or pull data to one or more backends. OpenTelemetry
    line protocol to configure the Promscale gRPC server to export the data to
    Promscale. Use `queue_size` to hold the data before dropping, and `timeout`
    is timeout for the write request to the backend, Prometheus remote write
    exports the OTLP metrics to the Prometheus remote storage backend. Configure
    the Promscale http endpoint to ingest the metrics. 
  * **Processors**: to run on data between being received and being
    exported. Batch processor is to batch, compress the data, and to control the
    number of outgoing connections, configured with `send_max_batch_size` and
    `timeout` to send data, Promscale recommends 10 seconds.
  * **Service**: to configure what components are enabled in the Collector based
    on the configuration found in the receivers, processors, exporters, and
    extensions sections. Pipeline to receive the traces and metrics from OTLP,
    batch process them, and to export the data in logs and OTLP,
    Prometheus-supported backends.

With this configuration you can send the traces from OpenTelemetry applications
to the Collector and export them to Promscale.

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

Where: 
`<PROMSCALE_HOST>`: hostname of Promscale
`<gRPC_PORT>`: gRPC port of Promscale
`<HTTP_PORT>` : HTTP port of Promscale
 
For example, if you are running the OTLP Collector and the Promscale Connector
on a Kubernetes cluster the endpoint parameter is similar to `endpoint:
"promscale-connector.default.svc.cluster.local:<PORT>"`

## Send data using OpenTelemetry Instrumentation SDKs
With Opentelemetry SDKs you can send OpenTelemetry traces using OTLP gRPC
endpoint by configuring the exporter backend using the
`OTEL_EXPORTER_OTLP_TRACES_ENDPOINT` environment variable on your application.
The SDK that you are using on the spplication should support gRPC. If the SDK
does not support gRPC then use the OpenTelmetry Collector to convert OTLP http
to gRPC using the OTLP `http receiver` and OTLP `gRPC exporter collector`
configuration.   

The specifics of the configuration depend on each SDK and library. For more
information, see[OpenTelemetry documentation][otel-docs].

[otel-docs]: https://opentelemetry.io/docs/instrumentation/
