# Send OpenTelemetry data to Promscale
Promscale natively supports the OpenTelemetry Line Protocol (OTLP) for traces
and Prometheus remote write protocol for metrics. You can send traces to
Promscale using OTLP with any of the OpenTelemetry client SDKs, instrumentation
libraries, or the OpenTelemetry Collector. Currently, Promscale only supports
**gRPC** endpoint for traces. You can send metrics to Promscale
**HTTP** endpoint using Prometheus remote write protocol with the OpenTelemetry
Collector. OpenTelemetry Collector converts OTLP metrics to Prometheus remote
write protocol metrics.

## Send data using the OpenTelemetry Collector
Although you can send data from OpenTelemetry instrumentation libraries and
SDKs directly to Promscale using OTLP, we recommend that you use OpenTelemetry
Collector in a production environment. OpenTelemetry Collector offers batch,
queued retries, and many other functions that can be configured in the `Processors`.

Set the following in OpenTelemetry Collector components in the configuration file:
  * **Receivers**: to push or pull data into OpenTelemetry Collector using OTLP
    on gRPC and http endpoints.
  * **Exporters**: to send data to one or more backends. OTLP to configure the
    Promscale gRPC server to export the data to Promscale. Use `queue_size` to
    hold the data before dropping, and `timeout` to set the timeout for the
    write request to the backend. Prometheus remote write exports the OTLP
    metrics to the Prometheus remote storage backend. Configure the Promscale
    http endpoint to ingest the metrics. 
  * **Processors**: to run on data between being received and being exported.
    Use the batch processor to batch, compress data, and control the number of
    outgoing connections. Configure the `send_max_batch_size` to set the maximum
    size of the batch, and `timeout` to set the time to send data. Promscale
    recommends 10 seconds.
  * **Service**: to configure what components are enabled in the Collector based
    on the settings in the `receivers`, `processors`, `exporters`, and
    `extensions` sections. Pipelines to receive the traces and metrics from OTLP,
    batch process them, and export the data to OTLP gRPC and Prometheus remote-write
    supported backends.

Use the following configuration to send traces from OpenTelemetry applications
to the Collector and export them to Promscale.
```yaml
receivers:
  otlp:
    protocols:
      grpc:
      http:

exporters:
  otlp:
    endpoint: "<PROMSCALE_HOST>:<gRPC_PORT>"
    tls:
      insecure: true
    sending_queue:
      queue_size: 1000000
    timeout: 10s
  prometheusremotewrite:
    endpoint: "http://<PROMSCALE_HOST>:<HTTP_PORT>/write"
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
      exporters: [otlp]
      processors: [batch]
    metrics:
      receivers: [otlp]
      processors: [batch]
      exporters: [prometheusremotewrite]
```

Where: 
* `<PROMSCALE_HOST>`: hostname of Promscale
* `<gRPC_PORT>`: gRPC port of Promscale. The default port is 9202.  
* `<HTTP_PORT>` : HTTP port of Promscale. The default port is 9201.

If you are running the OTLP Collector and the Promscale Connector on a
Kubernetes cluster the endpoint parameter is similar to `endpoint:
"promscale-connector.default.svc.cluster.local:<PORT>"`

## Send data using OpenTelemetry Instrumentation SDKs

The specifics of the configuration are different for each SDK and library. For
more information, see the [OpenTelemetry documentation][otel-docs].

[otel-docs]: https://opentelemetry.io/docs/instrumentation/

