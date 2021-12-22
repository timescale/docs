# How to set up a Prometheus endpoint for Managed Service for TimescaleDB
You can get more insights into the performance of your managed service for
TimescaleDB database by monitoring it using [Prometheus][get-prometheus], a
popular open source metrics-based systems monitoring solution. This tutorial
takes you through setting up a Prometheus endpoint for a database running in a
[Managed Service for TimescaleDB][timescale-mst]. To create a monitoring system
to ingest and analyze Prometheus metrics from your managed service for
TimescaleDB instance, you can use [Promscale][promscale].

This exposes metrics from the [node_exporter][node-exporter-metrics] as well
as [pg_stats][pg-stats-metrics] metrics.

## Prerequisites
To proceed with this tutorial, you need a Managed Service for TimescaleDB
database. To create one, see these instructions for how to
[get started with Managed Service for TimescaleDB][timescale-mst-get-started]

## Enable Prometheus service integration
In the navigation bar, select `Service Integrations`. Navigate to the service
integrations, pictured below.  

<img class="main-content__illustration" src="https://s3.amazonaws.com/docs.iobeam.com/images/Prometheus_service_integration_0.png" alt="Service Integrations Menu Option"/>

This presents you with the option to add a Prometheus integration point.
Select the plus icon to add a new endpoint and give it a name of your choice.
This example uses `endpoint_dev`.

<img class="main-content__illustration" src="https://s3.amazonaws.com/docs.iobeam.com/images/Prometheus_service_integration_1.png" alt="Create a Prometheus endpoint on Timescale Cloud"/>

Furthermore, notice that you are given basic authentication information and a
port number in order to access the service. This is used when setting up your
Prometheus installation, in the `prometheus.yml` configuration file. This
enables you to make this Managed Service for TimescaleDB endpoint a target for
Prometheus to scrape.

Here's a sample configuration file you can use when you setup your Prometheus
installation, substituting the target port, IP address, username, and password
for those of your Managed Service for TimescaleDB instance:
```yaml
# prometheus.yml for monitoring a Timescale Cloud instance
global:
 scrape_interval:     10s
 evaluation_interval: 10s
scrape_configs:
 - job_name: prometheus
   scheme: https
   static_configs:
     - targets: ['{TARGET_IP}:{TARGET_PORT}']
   tls_config:
     insecure_skip_verify: true
   basic_auth:
     username: {ENDPOINT_USERNAME}
     password: {ENDPOINT_PASSWORD}
remote_write:
 - url: "http://{ADAPTER_IP}:9201/write"
remote_read:
 - url: "http://{ADAPTER_IP}:9201/read"
```

## Associate Prometheus endpoint with managed service
You need to associate the Prometheus endpoint with your Timescale Cloud service.
Using the navigation menu, select the service you want to monitor and click the
`Overview` tab. Navigate to the `Service Integrations` section and click the
`Manage Integrations` button.

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/screenshots-for-prometheus-endpoint-tutorial/Prometheus_service_integrations_4.png" alt="Manage Service integrations on your managed service"/>

Find the Prometheus integration option and select `Use Prometheus`.

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/screenshots-for-prometheus-endpoint-tutorial/Prometheus_service_integration_2.png" alt="Select Prometheus integration to integrate with"/>

Select the endpoint name you created earlier as the endpoint you'd like to
use with this service and then click the `Enable` button. It's possible to use
the same endpoint for multiple services or a separate one for services you'd
like to keep apart.

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/screenshots-for-prometheus-endpoint-tutorial/Prometheus_service_integration_3.png" alt="Select name of Prometheus endpoint to integrate with"/>

To check if this was successful, navigate back to the Service Integrations
section of your managed service, and check if that `Active` flag appears, along
with the name of the endpoint you associated the service with.

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/screenshots-for-prometheus-endpoint-tutorial/Prometheus_service_integration_5.png" alt="Active prometheus endpoint with name"/>

Congratulations, you have successfully set up a Prometheus endpoint on your
Managed Service for TimescaleDB.

## Next steps
Next, use [Promscale][promscale] with Timescale, Grafana, and Prometheus to ingest
and analyze Prometheus metrics from your Timescale Cloud instance.


[timescale-mst]: https://www.timescale.com/products
[timescale-mst-install]: /mst/:currentVersion:/
[get-prometheus]: https://prometheus.io
[timescale-mst-get-started]: /mst/:currentVersion:/
[pg-stats-metrics]: https://www.postgresql.org/docs/current/monitoring-stats.html
[promscale]: /promscale/:currentVersion:/
[node-exporter-metrics]: https://github.com/prometheus/node_exporter
