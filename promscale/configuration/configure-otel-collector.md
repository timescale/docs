# Configure the OpenTelemetry collector
You can configure the OpenTelemetry collector to forward data to Promscale. Promscale natively supports OpenTelemetry traces using the OpenTelemetry Line Protocol (OTLP) gRPC API to ingest the traces.

Open the OpenTelemetry collector configuration file, and forward the OTLP traces to Promscale by adding or editing these lines:

```yaml
exporters:
  otlp:
    endpoint: "{{ .Release.Name }}-promscale-connector.{{ .Release.Namespace }}.svc.cluster.local:9202"
    insecure: true
```
