---
title: Create a read-only replica using Aiven Client 
excerpt: Create a read-only replica of the service using Aiven Command Line tool for fully managed services on AWS, Azure, or GCP.
product: mst
---

# Read-only replica with Aiven Client

Read-only replicas provide a great way to reduce the load on the primary server
by enabling read-only queries to be performed against the replica. It is also a
good way to optimize query response times across different geographical
locations, because the replica can be placed in different regions or
even different cloud providers.


## Before you begin

Before you begin, make sure you have: 

*   Installed [Aiven Client][aiven-client-install].
*   Signed in to your [Managed Service for TimescaleDB dashboard][mst-login].
*   Created a [service][create-service] in Managed Service for TimescaleDB.

<procedure>

## Creating a read-only replica of your service

1.  In the Aiven Client, connect to your
    [Managed Service for TimescaleDB service][aiven-client-mst].

1.  Switch to the project that contains the TimescaleDB service you want to
    create a read-only replica for:

    ```bash
    avn switch <PROJECT>
    ```

1.  List the services in the project, and make a note of the service that you
    want to create a read-only replica for. It is listed under the`SERVICE_NAME` column in
    the output:

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
    -t pg --plan <PLAN> --cloud timescale-aws-us-east-1\
    -c pg_read_replica=true\
    -c service_to_fork_from=<NAME_OF_SERVICE_TO_FORK>\
    -c pg_version=11 -c variant=timescale
    ```

</procedure>

## Example

To create a fork named `replica-fork` for a service named `timescaledb` with these parameters:
* PROJECT: `fork-project`
* CLOUD_NAME: `timescale-aws-us-east-1`
* PLAN: `timescale-basic-100-compute-optimized` 

```bash
avn service create replica-fork --project fork-project -t pg --plan timescale-basic-100-compute-optimized --cloud timescale-aws-us-east-1 -c pg_read_replica=true -c service_to_fork_from=timescaledb -c pg_version=11 -c variant=timescale
```

You can switch to `project-fork` and view the newly created `replica-fork` using:

```bash
avn service list
```

[about-mst]: /mst/:currentVersion:/about-mst/
[aiven-client-install]: /mst/:currentVersion:/aiven-client/aiven-client-install/
[create-service]: /install/:currentVersion:/installation-mst/#create-your-first-service
[mst-login]: https://portal.managed.timescale.com
[aiven-client-mst]: /mst/:currentVersion:/aiven-client-install
