# Configure OpenTelemetry collector to forward data to Promscale

Promscale natively supports the OpenTelemetry traces using OpenTelemetry Line Protocol (OTLP) gRPC API to ingest the traces.

Configure the OTLP exporter in OpenTelemetry collector configuration to forward the OTLP traces to Promscale:

```
exporters:
  otlp:
    endpoint: "{{ .Release.Name }}-promscale-connector.{{ .Release.Namespace }}.svc.cluster.local:9202"
    insecure: true
```


