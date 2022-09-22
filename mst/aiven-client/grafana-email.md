---
title: Send Grafana emails
excerpt: Configure the Simple Mail Transfer Protocol (SMTP) server in MST for Grafana.
product: mst
---

# Send Grafana emails

Use the Aiven client to configure the Simple Mail Transfer Protocol (SMTP)
server settings and send emails from Managed Service for
TimescaleDB for Grafana, including invite emails, reset password emails, and alert
messages.

## Before you begin

*   Installed [Aiven Client][aiven-client-mst].
*   Signed in to your [Managed Service for TimescaleDB dashboard][mst-login].
*   Create a service for [Grafana in MST][grafana-install]
*   Make a note of these values in the SMTP server: `IP or hostname`, SMTP
    server port, `Username`, `Password`, `Sender email address`, `Sender name`
    (optional).

<procedure>

## Configuring the SMTP server for Grafana service

1.  In the Aiven client, connect to your
    [Managed Service for TimescaleDB service][aiven-client-mst].

1.  Switch to the project that contains the Grafana service you want to
    integrate:

    ```bash
     avn project switch <PROJECT>
    ```

1.  List the services in the project, and make a note of the Grafana service
    that you want to configure, listed under `SERVICE_NAME` column in the
    output.

    ```bash
     avn service list
    ```

1.  Get the details of the service that you want to integrate:

    ```bash
    avn service get <SERVICE_NAME>
    ```

1.  Configure the Grafana service using the SMTP values:

    ```bash
       avn service update --project <PROJECT> <SERVICE_NAME>\
       -c smtp_server.host=smtp.example.com \
       -c smtp_server.port=465 \
       -c smtp_server.username=emailsenderuser \
       -c smtp_server.password=emailsenderpass \
       -c smtp_server.from_address="grafana@yourcompany.com"
    ```

1.  (*OPTIONAL*)Review all available custom options, and configure:

    ```bash
       avn service types -v
    ```

You can now send emails for your Grafana service on MST.

</procedure>

[grafana-install]: /timescaledb/:currentVersion:/tutorials/grafana/installation/#create-a-new-service-for-grafana
[mst-login]: https://portal.managed.timescale.com
[aiven-client-mst]: /mst/:currentVersion:/aiven-client/aiven-client-install
