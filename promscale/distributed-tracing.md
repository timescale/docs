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

For more information about installing tracing
support with tobs, see [the tobs installation section][tobs-tracing]. For more
information about installing tracing support with Docker, see
[the Docker installation section][docker-tracing].

Help improve Promscale by
[sharing your feedback](https://github.com/timescale/promscale/discussions/916)
and [reporting issues](https://github.com/timescale/promscale/issues/new).

## Ingest traces
Promscale has native support for ingesting OpenTelemetry traces. You can send
OpenTelemetry traces directly to Promscale using the
[OpenTelemetry][opentelemetry] protocol (OTLP). For the best workflow, use OTLP for
tracing in Promscale, because it centralizes management of all your telemetry
data. This helps you define processing rules and manage where to send the
data.

Both Jaeger and Zipkin trace formats are supported using the OpenTelemetry Collector
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
sending data to Promscale:
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
Alternatively, you can instrument the OTLP exporter to Promscale's native OTLP
ingest endpoint.

The OTLP receiver supports both gRPC and HTTP. Promscale supports gRPC only. 

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
## Visualize traces with tobs
If you used tobs to deploy Promscale and all its components, you can access
Grafana, and Jaeger to visualize your traces. You do not need to do any
further configuration steps.

<procedure>

### Visualizing traces in Grafana
1.  Fetch the Grafana credentials:
    ```bash
    tobs grafana get-password
    ```
1. Set up port forwarding for the Grafana interface:
    ```bash
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

## Visualize traces without tobs
If you did not use tobs to deploy Promscale and its components, you must do some
additional setting up to access Grafana and Jaeger to visualize your traces.
Begin by setting up the Jaeger UI to show traces stored in Promscale. You can
then use the Jaeger UI directly, or set up Grafana to query and visualize
traces.

The `promscale-jaeger` plugin acts as a proxy between Jaeger and Promscale. It
does not contain any logic. All processing is done by the Promscale Connector.

<highlight type="note">
The `promscale-jaeger` plugin implements the APIs for Jaeger to read traces from
Promscale. It does not allow  Jaeger to write traces to Promscale. If you want
to send Jaeger traces to Promscale, use the OpenTelemetry Collector instead.
</highlight>

The Jaeger UI uses
[gRPC storage plugins][grpc-plugins]
to visualize traces. When you have enabled the plugin in the configuration file,
it executes the binary. If you deploy Jaeger using a container, then make sure
that the binary is in the same container image as Jaeger itself. The Promscale
Jaeger container provides the upstream Jaeger Query component, and the Jaeger
gRPC storage plugin. You can download the container from
[DockerHub][jaeger-dockerhub]. Use the `latest` image to ensure you have the
most recent packages.

<procedure>

### Setting up Jaeger UI with Docker
1.  Start the Jaeger Docker container:
    ```bash
    docker run --name promscale-jaeger -d \
    -p 16686:16686 \
    -v <PATH_TO_PLUGIN_CONFIG_FILE>:/configs/jaeger-promscale-query.yaml \
    --network promscale \
    timescale/jaeger-query-proxy:latest
    ```
1.  The Jaeger UI can be accessed on port 16686.

</procedure>

<procedure>

### Setting up Jaeger UI self-hosted
1.  Download the appropriate plugin binary for your system from
    [Github][gh-promscale].
1.  Run the binary:
    ```bash
    ./jaeger-query-plugin \
    --span-storage.type=grpc-plugin \
    --grpc-storage-plugin.binary=<JAEGER_BINARY> \
    --grpc-storage-plugin.configuration-file=<CONFIGURATION_FILE>
    ```
1.  Open the plugin configuration file, and set these parameters. The
    `grprc-server` parameter must be set. By default, the port is 9202. All
    other parameters are optional:
    ```yaml
    grpc-server: <PROMSCALE_HOST>:<OTLP_GRPC_PORT>
    connection-timeout: 5s
    grpc-server-host-override: ""
    cafile: ""
    tls: false
    ```
1.  The Jaeger UI can be accessed on port 9202.

</procedure>

<procedure>

### Additional Jaeger set up for Kubernetes
1.  If you are using Kubernetes, some additional set up is required. Create a
    ConfigMap, like this:
    ```yaml
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: promscale-jaeger
    data:
      jaeger-promscale-query.yaml: |
        grpc-server: <PROMSCALE_SERVICE>:9202   
    ```
1.  Use a volumeMount to make the ConfigMap available to the `promscale-jaeger`
    container through a volumeMount. For more information, see the
    [Kubernetes documentation][k8s-jaeger].

</procedure>

## Set up Grafana to visualize Jaeger traces
When you have the Jaeger UI installed, you can use Grafana to query and
visualize Promscale traces. Before you begin, you need to have Grafana version 7.4 or higher installed and accessible.

<procedure>

### Setting up Grafana to visualize Jaeger traces
1.  In the Grafana web interface, add a new Jaeger data source with the URL of
    the Jaeger instance. If you have enabled authentication in Jaeger, add the
    credentials.
1.  Make sure you specify the correct port to access Jaeger. By default, the
    port is 16686.
1.  To access your traces, navigate to `Explore` and select the Jaeger data
    source.

</procedure>

For more information about using a Jaeger data source with Grafana, see the
[Grafana documentation][grafana-jaeger].


[opentelemetry]: https://opentelemetry.io/
[tobs-tracing]: promscale/:currentVersion:/installation/tobs#install-tracing-support
[docker-tracing]: promscale/:currentVersion:/installation/docker#install-tracing-support
[reporter-grpc-host-port]: https://www.jaegertracing.io/docs/1.26/deployment/#discovery-system-integration
[jaeger-receiver]: https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/jaegerreceiver
[zipkin-receiver]: https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/zipkinreceiver
[jaeger-dockerhub]: https://hub.docker.com/r/timescale/jaeger-query-proxy/tags
[k8s-jaeger]: https://kubernetes.io/docs/concepts/configuration/configmap/#configmaps-and-pods
[grafana-jaeger]: https://grafana.com/docs/grafana/latest/datasources/jaeger/
[grpc-plugins]: https://github.com/jaegertracing/jaeger/tree/master/plugin/storage/grpc
[gh-promscale]: https://github.com/timescale/promscale/releases
