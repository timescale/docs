---
title: Create a read-only replica using Aiven client
excerpt: Create a read-only replica of the service using Aiven Command Line tool for managed Service for TimescaleDB.
products: [mst]
---

# Read-only replica with Aiven client

Read-only replicas enable you to perform read-only queries against the
replica and reduce the load on the primary server. It is also a
good way to optimize query response times across different geographical
locations, because the replica can be placed in different regions or
even different cloud providers.

## Prerequisites

Before you begin, make sure you have:

*   Created a service in your Managed Service for TimescaleDB account.
*   Installed [Aiven Client][aiven-client-install].

<Procedure>

## Creating a read-only replica of your service

1.  In the Aiven client, connect to your
    [Managed Service for TimescaleDB service][aiven-client-install].

1.  Switch to the project that contains the TimescaleDB service you want to
    create a read-only replica for:

    ```bash
    avn project switch <PROJECT>
    ```

1.  List the services in the project, and make a note of the service that you
    want to create a read-only replica for. It is listed under the`SERVICE_NAME`
    column in the output:

    ```bash
    avn service list
    ```

1.  Get the details of the service that you want to fork:

    ```bash
    avn service get <SERVICE_NAME>
    ```

1.  Create a read-only replica:

    ```bash
    avn service create <NAME_OF_REPLICA> --project <PROJECT_ID>\
    -t pg --plan <PLAN_TYPE> --cloud timescale-aws-us-east-1\
    -c pg_read_replica=true\
    -c service_to_fork_from=<NAME_OF_SERVICE_TO_FORK>\
    -c pg_version=11 -c variant=timescale
    ```

</Procedure>

## Example

To create a fork named `replica-fork` for a service named `timescaledb` with
these parameters:

*   PROJECT_ID: `fork-project`
*   CLOUD_NAME: `timescale-aws-us-east-1`
*   PLAN_TYPE: `timescale-basic-100-compute-optimized`

```bash
avn service create replica-fork --project fork-project\
-t pg --plan timescale-basic-100-compute-optimized\
--cloud timescale-aws-us-east-1 -c pg_read_replica=true\
-c service_to_fork_from=timescaledb -c\
pg_version=11 -c variant=timescale
```

You can switch to `project-fork` and view the newly created `replica-fork` using:

```bash
avn service list
```

[aiven-client-install]: /mst/:currentVersion:/aiven-client/#install-and-configure-the-aiven-client
