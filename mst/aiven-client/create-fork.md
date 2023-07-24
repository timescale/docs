---
title: Create a fork using Aiven client
excerpt: Create a fork of the service using Aiven Command Line tool for Managed Service for TimescaleDB.
products: [mst]
---

# Fork services with Aiven client

When you a fork a service, you create an exact copy of the service, including
the underlying database. You can use a fork of your service to:

*   Create a development copy of your production environment.
*   Set up a snapshot to analyze an issue or test an upgrade.
*   Create an instance in a different cloud, geographical location, or under
    a different plan.

For more information about projects, plans, and other details about
services,see [Services][about-mst].

## Prerequisites

Before you begin, make sure you have:

*   Created a service in your Managed Service for TimescaleDB account.
*   Installed [Aiven Client][aiven-client-mst].

<Procedure>

## Creating a fork of your service

1.  In the Aiven client, connect to your
    [Managed Service for TimescaleDB service][aiven-client-mst].

1.  Switch to the project that contains the service you want to fork:

    ```bash
     avn project switch <PROJECT>
    ```

1.  List the services in the project, and make a note of the service that you
    want to fork, listed under `SERVICE_NAME` column in the output.

    ```bash
     avn service list
    ```

1.  Get the details of the service that you want to fork:

    ```bash
    avn service get <SERVICE_NAME>
    ```

1.  Create the fork:

    ```bash
    avn service create <NAME_OF_FORK> --project <PROJECT_ID>\
    -t <SERVICE_TYPE> --plan <PLAN> --cloud <CLOUD_NAME>\
    -c service_to_fork_from=<NAME_OF_SERVICE_TO_FORK>
    ```

</Procedure>

## Example

To create a fork named `grafana-fork` for a service named `grafana` with these parameters:

*   PROJECT_ID: `project-fork`
*   CLOUD_NAME: `timescale-aws-us-east-1`
*   PLAN_TYPE: `dashboard-1`

```bash
   avn service create grafana-fork --project project-fork -t grafana --plan dashboard-1 --cloud timescale-aws-us-east-1  -c service_to_fork_from=grafana
```

You can switch to `project-fork` and view the newly created `grafana-fork` using:

```bash
   avn service list
```

[about-mst]: /mst/:currentVersion:/about-mst/
[aiven-client-mst]: /mst/:currentVersion:/aiven-client/aiven-client-install
