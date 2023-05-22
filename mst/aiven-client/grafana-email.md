---
title: Send Grafana emails
excerpt: Configure the Simple Mail Transfer Protocol (SMTP) server in MST for Grafana.
products: [mst]
keywords: [Grafana, integration]
---

# Send Grafana emails

Use the Aiven client to configure the Simple Mail Transfer Protocol (SMTP)
server settings and send emails from Managed Service for
TimescaleDB for Grafana, including invite emails, reset password emails, and alert
messages.

## Prerequisites

Before you begin, make sure you have:

*   Created a service in your Managed Service for TimescaleDB account.
*   Installed [Aiven Client][aiven-client-mst].
*   Created a service for [Grafana in MST][grafana-install]
*   (Optional): Made a note of these values in the SMTP server:
    `IP or hostname`, `SMTP server port`, `Username`, `Password`,
    `Sender email address`, and `Sender name`.

<Procedure>

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

1.  <Optional /> Review all available custom options, and configure:

    ```bash
       avn service types -v
    ```

You can now send emails for your Grafana service on MST.

</Procedure>

[grafana-install]: /tutorials/:currentVersion:/grafana/installation/#create-a-new-service-for-grafana
[aiven-client-mst]: /mst/:currentVersion:/aiven-client/aiven-client-install
