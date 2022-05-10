# Getting Started

## Quick Start

### Installation

1. [Docker](docker-install)
2. [Kubernetes](kubernetes-install)
3. [Source](source-install)
4. [Tobs](tobs-install)

### Ingesting the data

1. [Prometheus](prometheus-data) 
2. [OpenTelemetry](opentelemetry-data)
3. [Jaeger](jaeger-data)
4. [Zipkin](zipkin-data)

### Visualize the data

1. [Grafana](grafana)
2. [Jaeger](jaeger)

## Blog posts

1. April 2022: [A Deep Dive Into the Four Types of Prometheus Metrics](prometheus-blog)
2. March 2022: [OpenTelemetry and Python: A Complete Instrumentation Guide](python-instrumentation-blog)
3. February 2022: [Learn OpenTelemetry tracing with this lightweight microservices demo](opentelemetry-demo-blog)
4. February 2022: [How to turn Timescale Cloud into an observability backend with Promscale](timescale-cloud-blog)
5. October 2021: [A different and (often) better way to downsample your Prometheus metrics](downsampling-blog)
6. October 2021: [What are traces, and how SQL (yes, SQL) and OpenTelemetry can help us get more value out of traces to build better software](traces-blogpost)
7. August 2021: [Simplified Prometheus monitoring for your entire organization with Promscale](muti-tenancy-blog)
8. March 2021: [Promscale 0.4: Drawing inspiration from Cortex to rewrite support for Prometheus high-availability](ha-blog)
9. February 2021: [Introducing Tobs: Deploy a full observability suite for Kubernetes in two minutes](tobs-blog)
10. February 2021: [Introducing Prom-migrator: A universal, open-source Prometheus data migration tool](prom-migrator-blog)


[docker-install]: promscale/:currentVersion:/installation/docker/
[source-install]: promscale/:currentVersion:/installation/source/
[kubernetes-install]: promscale/:currentVersion:/installation/kubernetes/
[tobs-install]: promscale/:currentVersion:/installation/tobs/
[prometheus-data]: promscale/:currentVersion:/send-data/prometheus/
[opentelemetry-data]: promscale/:currentVersion:/send-data/opentelemetry/ 
[jaeger-data]: promscale/:currentVersion:/send-data/jaeger/
[zipkin-data]: promscale/:currentVersion:/send-data/zipkin/  
[grafana]: promscale/:currentVersion:/visualize-data/grafana/
[jaeger]: promscale/:currentVersion:/visualize-data/jaeger/ 
[prom-migrator-blog]: https://blog.timescale.com/blog/introducing-prom-migrator-a-universal-open-source-prometheus-data-migration-tool/
[tobs-blog]: https://www.timescale.com/blog/introducing-tobs-deploy-a-full-observability-suite-for-kubernetes-in-two-minutes/
[ha-blog]: https://blog.timescale.com/blog/promscale-0-4-drawing-inspiration-from-cortex-to-rewrite-support-for-prometheus-high-availability/
[multi-tenancy-blog]: https://www.timescale.com/blog/simplified-prometheus-monitoring-for-your-entire-organization-with-promscale/
[traces-blogpost]: https://www.timescale.com/blog/what-are-traces-and-how-sql-yes-sql-and-opentelemetry-can-help-us-get-more-value-out-of-traces-to-build-better-software/
[downsampling-blog]: https://www.timescale.com/blog/a-different-and-often-better-way-to-downsample-your-prometheus-metrics/
[timescale-cloud-blog]: https://www.timescale.com/blog/how-to-turn-timescale-cloud-into-an-observability-backend-with-promscale/
[opentelemetry-demo-blog]: https://www.timescale.com/blog/learn-opentelemetry-tracing-with-this-lightweight-microservices-demo/
[python-instrumentation-blog]: https://www.timescale.com/blog/opentelemetry-and-python-a-complete-instrumentation-guide/
[prometheus-blog]: https://www.timescale.com/blog/four-types-prometheus-metrics-to-collect/