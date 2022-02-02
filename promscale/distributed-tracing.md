# Tracing
Promscale supports tracing using the [OpenTelemetry][opentelemetry] protocol
(OTLP). Promscale supports the entire OpenTelemetry trace data model including
spans, events, and links.

You can also use Jaeger and Zipkin traces with the OpenTelemetry Collector. The
OpenTelemetry Collector ingests data from Jaeger and Zipkin instrumentation,
converts it to OpenTelemetry, and sends it to Promscale using OTLP.

You can visualize traces in Promscale using Grafana and the Jaeger UI.

When you have tracing set up in Promscale, you can query the traces using SQL
queries. This allows you to get deep insights from your tracing data, which can
help you understand problems and identify optimizations for your applications.

<highlight type="warning">
Promscale tracing is currently in beta, and could have bugs! This feature might
not be backwards compatible, and could be removed in a future release. Use this
feature at your own risk, and do not use any experimental features in
production.
</highlight>

To enable tracing in Promscale 0.7.0 and later, use the
`-enable-feature=tracing` flag. For more information about installing tracing
support with tobs, see [the tobs installation section][tobs-tracing]. For more
information about installing tracing support with Docker, see
[the Docker installation section][docker-tracing].

Please help us improve Promscale by
[sharing your feedback](https://github.com/timescale/promscale/discussions/916)
and [reporting issues](https://github.com/timescale/promscale/issues/new).

## Ingest traces
Promscale has native support for ingesting OpenTelemetry traces. You can send
OpenTelemetry traces directly to Promscale using the
[OpenTelemetry][opentelemetry] protocol (OTLP). We recommend using OTLP for
tracing in Promscale, because it centralizes management of all your telemetry
data. This helps you define processing rules and managing where to send the
data.

Jaeger and Zipkin trace formats are supported using the OpenTelemetry Collector
only.

### Configure the OpenTelemetry Collector
If you used tobs to deploy Promscale, the OpenTelemetry Collector is already
installed in your cluster and you do not need to do any further configuration
steps.

If you decide to use your own OpenTelemetry Collector installation, you must
enable the OTLP, Jaeger, or Zipkin receiver. You also need to enable the OTLP
exporter and point it to the Promscale OTLP endpoint. Promscale listens for OTLP
data on the port you specified with the `otlp-grpc-server-listen-address`
parameter, usually 9202.

This is an example OpenTelemetry Collector configuration file. It shows the
OTLP, Jaeger, and Zipkin receivers enabled, along with the the OTLP exporter.
This example also enables the batch processor for improved efficiency when
sending data to Promscale, which we recommend:
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

  zipkin:    

exporters:
  otlp:
    endpoint: "tobs-promscale-connector.default.svc.cluster.local:9202"
    insecure: true

processors:
  batch:
    send_batch_size: 4
    send_batch_max_size: 8

service:
  pipelines:
    traces:
      receivers: [jaeger, otlp, zipkin]
      exporters: [otlp]
      processors: [batch]
```

## Instrumentation
When you have the OpenTelemetry Collector set up, you can instrument the service
for your preferred tracing receiver.

### Instrument OpenTelemetry
To instrument OpenTelemetry, configure the OpenTelemetry SDK to export your
traces using the OTLP exporter to the OpenTelemetry Collector OTLP receiver.
Alternatively, you can instrument the OTLP exporter to Promscale’s native OTLP
ingest endpoint.

The OTLP receiver supports both gRPC and HTTP. Promscale supports gRPC only. We
recommend using gRPC.

The OpenTelemetry Collector OTLP receiver listens on port 4317 for
gRPC and 4318 for HTTP connections.

To use gRPC, configure the OTLP exporter to send data to
`<opentelemetry-collector-host>:4317`. If you deployed a full observability
stack with tobs, use
`tobs-opentelemetry-collector-collector.default.svc.cluster.local:4317`

The OTLP ingest endpoint listens to gRPC connections on the address you specify
with the `otlp-grpc-server-listen-address` parameter. By default, Promscale
listens on port 9202, so in most cases, you can point the OTLP exporter to
`<promscale-connector-host>:9202`. If you deployed a full observability stack
with tobs, use `tobs-promscale-connector.default.svc.cluster.local:9202`.

### Instrument Jaeger
To instrument Jaeger, configure the Jaeger agent to send your traces to the
OpenTelemetry Collector by starting the receiver with the
[reporter.grpc.host.port parameter][reporter-grpc-host-port]. Set `host:port` to
the port location where  the
[OpenTelemetry Collector Jaeger Receiver][jaeger-receiver] is listening for
connections. By default, the receiver listens for gRPC connections on port
14250, so in most cases you can point the Jaeger agent to
`<opentelemetry-collector-host>:14250`. If you deployed a full observability
stack with tobs, use
`tobs-opentelemetry-collector.default.svc.cluster.local:14250`.

### Instrument Zipkin
To instrument Zipkin, configure the Zipkin transport you are using to send
traces to the [OpenTelemetry Collector Zipkin Receiver][zipkin-receiver]
endpoint with `<opentelemetry-collector-host>:9411`. Tobs does not currently
configure the OpenTelemetry Collector to ingest Zipkin traces.

<!--- Consider starting a new sub-page for visualization. --LKB 20220202-->
## Visualize traces
If you used tobs to deploy Promscale and all its components, you can access
Grafana and Jaeger to visualize your traces, and you do not need to do any
further configuration steps.

<procedure>

### Visualizing traces in Grafana
1.  Set up the Grafana user interface:
    ```bash
    tobs grafana get-password
    tobs grafana port-forward
    ```
1.  In your browser, navigate to `http://127.0.0.1:8080/`.
1.  Log in to the Grafana user interface with username `admin`, and the password
    you set.

</procedure>

<procedure>

### Visualizing traces in Jaeger
1.  Set up the Jaeger user interface:
    ```bash
    tobs jaeger port-forward
    ```
1.  In your browser, navigate to `http://127.0.0.1:16686/`. No login credentials
    are required.

</procedure>


<!-- I'm not sure how this is relevant, considering we already give instructions for this in the previous section. Do we need it?  --LKB 20220202

## Setting up Jaeger UI

In order for the Jaeger UI to show traces stored in Promscale we leverage Jaeger’s support for [gRPC storage plugins](https://github.com/jaegertracing/jaeger/tree/master/plugin/storage/grpc). Our plugin acts as a simple proxy between Jaeger and Promscale. It does not contain any logic. All the processing work is done in the Promscale Connector.

This plugin only implements the APIs for Jaeger to read traces from Promscale. It does not implement the APIs for Jaeger to write traces to Promscale. To send Jaeger traces to Promscale use the OpenTelemetry Collector instead as explained [here](#jaeger-instrumentation).

Jaeger's gRPC plugin system works by executing the binary for the plugin when enabled in the configuration file. For that reason when deploying as a container, Jaeger and the binary need to be on the same container image. And since Jaeger doesn’t package all gRPC storage plugins in its default Docker images, we provide an image that includes the upstream Jaeger Query component (not the rest since they are not needed) and Promscale’s gRPC storage plugin for Jaeger. The image is available on [DockerHub](https://hub.docker.com/r/timescale/jaeger-query-proxy/tags). We recomment using the `latest` image

To enable Jaeger to use the plugin you need to pass the following parameters:

* `span-storage.type=grpc-plugin`
* `grpc-storage-plugin.binary=<path-to-jaeger-query-proxy-binary>`, pointing to the location of the plugin binary
* `grpc-storage-plugin.configuration-file=<config_file>`, a path pointing to the plugin's configuration file.

This is how you would run the container with Docker:

```bash
docker run --name promscale-jaeger -d -p 16686:16686 -v <path-to-plugin-config-file>:/configs/jaeger-promscale-query.yaml --network promscale-timescaledb timescale/jaeger-query-proxy:latest
```
The container already sets the required values for those parameters.

The Jaeger UI would be accessible on port 16686.

If you run Jaeger directly on a host, you first need to download the plugin binary for your system. The binaries are available under the assets of the latest Promscale release on [Github](https://github.com/timescale/promscale/releases). Then you have to run the binary as follows:

```bash
./jaeger-query-plugin --span-storage.type=grpc-plugin --grpc-storage-plugin.binary=<path-to-jaeger-query-proxy-binary> --grpc-storage-plugin.configuration-file=<config_file>
```

The parameters in the plugin configuration file are the following (only the first is mandatory):

```yaml
grpc-server: <promscale-host>:<otlp-grpc-port>
#connection-timeout: 5s
#grpc-server-host-override: ""
#cafile: ""
#tls: false
```

If you followed the instructions described in this document then otlp-grpc-port will be 9202. For example

```yaml
grpc-server: localhost:9202
```

If you run on Kubernetes, create a ConfigMap like the one below

```yaml
​​apiVersion: v1
kind: ConfigMap
metadata:
  name: promscale-jaeger
data:
  jaeger-promscale-query.yaml: |
    grpc-server: <promscale-service>:9202   
```

Then make this ConfigMap available to the promscale-jaeger container through a volumeMount. Read more on how to do that in the [Kubernetes documentation](https://kubernetes.io/docs/concepts/configuration/configmap/#configmaps-and-pods).

### Setting up Grafana

Grafana can query and visualize traces in Promscale through Jaeger. You’ll need Grafana version 7.4 or higher.

Go into Grafana and configure a Jaeger data source by passing the url of the Jaeger instance and credentials if you have enabled authentication in Jaeger. You have to specify the port you use to access the Jaeger UI which by default is 16686.

You can read more details on how to configure a Jaeger data source in the [Grafana documentation](https://grafana.com/docs/grafana/latest/datasources/jaeger/).

To access your traces go to Explore and select the Jaeger data source you just created. More details can be found in the [Grafana documentation](https://grafana.com/docs/grafana/latest/datasources/jaeger/).

-->

[opentelemetry]: https://opentelemetry.io/
[tobs-tracing]: promscale/:currentVersion:/installation/tobs#install-tracing-support
[docker-tracing]: promscale/:currentVersion:/installation/docker#install-tracing-support
[reporter-grpc-host-port]: https://www.jaegertracing.io/docs/1.26/deployment/#discovery-system-integration
[jaeger-receiver]: https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/jaegerreceiver
[zipkin-receiver]: https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/zipkinreceiver
