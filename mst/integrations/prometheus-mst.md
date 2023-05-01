---
title: Prometheus endpoint for Managed Service for TimescaleDB
excerpt: Use Prometheus to monitor your Managed Service for TimescaleDB
products: [mst]
keywords: [Prometheus, monitor, integration]
---

# Set up a Prometheus endpoint for a Managed Service for TimescaleDB database

You can get more insights into the performance of your Managed Service for TimescaleDB
database by monitoring it using [Prometheus][get-prometheus], a popular
open source metrics-based systems monitoring solution.

## Prerequisites

Before you begin, make sure you have:

*   Created a service in your Managed Service for TimescaleDB account.
*   Made a note of the `Port`and `Host` for your service.

<Procedure>

### Enabling Prometheus service integration

1.  Sign in to your [Managed Service for TimescaleDB portal][mst-login], and
    navigate to `Integration Endpoints`.
1.  In the `Integration endpoints` page, navigate to `Prometheus`, and click
    `Create new`.
1.  In the `Create new Prometheus endpoint` dialog, complete these fields:

      *   In the `Endpoint name` field, type a name for your endpoint.
      *   In the `Username` field, type your username.
      *   In the `Password` field, type your password.
      *   Click `Create` to create the endpoint.

    These details are used when setting up your Prometheus installation, in the
    `prometheus.yml` configuration file. This allows you to make this Managed
    Service for TimescaleDB endpoint a target for Prometheus to scrape.

1.  Use this sample configuration file to set up your Prometheus installation,
    by substituting `<PORT>`, `<HOST>`, `<USER>`, and `<PASSWORD>` with those of
    your Managed Service for TimescaleDB instance:

   ```yaml
    global:
     scrape_interval:     10s
     evaluation_interval: 10s
    scrape_configs:
     - job_name: prometheus
       scheme: https
       static_configs:
         - targets: ['<HOST>:<PORT>']
       tls_config:
         insecure_skip_verify: true
       basic_auth:
         username: <USER>
         password: <PASSWORD>
    remote_write:
     - url: "http://<HOST>:9201/write"
    remote_read:
     - url: "http://<HOST>:9201/read"
   ```

1.  In the Managed Service for TimescaleDB portal, navigate to `Services` and
    select the service you want to monitor.
1.  In the `Integrations` tab, go to `External integrations` section and select
    `Prometheus`.
1.  In the `Prometheus integrations` dialog, select the Prometheus endpoint
    that you created.
1.  Click `Enable`.

    The Prometheus endpoint is listed under `Enabled integrations` for the
    Managed Service for TimescaleDB instance.

</Procedure>

[get-prometheus]: https://prometheus.io
[mst-login]: https://portal.managed.timescale.com
