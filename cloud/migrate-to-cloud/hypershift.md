---
title: Migrate with hypershift
excerpt: Migrate an existing PostgreSQL database to Timescale Cloud in a single step
product: cloud
keywords: [data migration, hypershift]
tags: [ingest, hypershift, postgresql]
---

# Migrate with hypershift

Migrate existing PostgreSQL databases by dumping and restoring the entire
database at once. Hypershift also allows you to enable compression and
hypertable creation on the fly. Because compression is enabled during the
migration, you do not need to have the maximum amount of storage available in
the target database.

Depending on your database size and network speed, migration can take a very
long time. You can continue reading from your source database during this time,
though performance could be slower. If you write to tables in your source
database during the migration, the new writes might not be transferred to
Timescale Cloud. To avoid this problem, fork your database and migrate your data
from the fork. To avoid this problem, see the section on
[migrating an active database]
(<http://docs.timescale.com/cloud/latest/migrate-to-cloud/#migrate-an-active-database>).

<highlight type="important">
If you have a very large database, and hypershift is going to have to run for a
very long time to migrate it, for example, a day or more, ensure that you have a
very stable network connection. Hypershift is not able to recover if the network
connection is interrupted.
</highlight>

## Prerequisites

Before you begin, make sure you have:

*   Signed up for your [free Timescale Cloud account][cloud-install].
*   Installed [Docker][docker-install].

<highlight type="cloud" header="Run all tutorials free" button="Try for free">
Your Timescale Cloud trial is completely free for you to use for the first
thirty days. This gives you enough time to complete all the tutorials and run
a few test projects of your own.
</highlight>

## Download the hypershift container

<Tabs label="Download hypershift">

<Tab title="MacOS">

<procedure>

### Downloading the hypershift container on MacOS

1.  Open the Docker app on your local machine to start the service.

1.  At the command prompt, pull the latest hypershift container from Dockerhub:

    ```bash
    docker pull timescale/hypershift
    ```

</procedure>

</Tab>

<Tab title="Linux">

<procedure>

### Downloading the hypershift container on Linux

1.  Start the Docker service:

    ```bash
    sudo service docker start
    ```

1.  At the command prompt, pull the latest hypershift container from Dockerhub:

    ```bash
    docker pull timescale/hypershift
    ```

</procedure>

</Tab>

</Tabs>

## Run hypershift

In preparation for running hypershift, you need to determine which tables need
to be converted to hypertables, and which tables need to be compressed during
the migration. Hypertables must have a unique column labelled `time`.

Hypershift uses a YAML configuration file to determine how to set up your new
Timescale database. You can create your own file, or use the example file as a
starting point. You need these details to complete your configuration file:

*   The schema you want to use
*   The name of the database you are migrating
*   The name of the `time` column in your database
*   The chunk time interval to use
*   The compression policy you want to use

Use this format:

```yml
- schema: public
  name: <DATABASE_NAME>
  time_column_name: <TIME_COLUMN_NAME>
  chunk_time_interval: "12h"
  compress:
    after: "48h"
    segmentby:
      - <COLUMN_NAME>
    orderby:
      - time desc
```

<procedure>

### Running hypershift

1.  Open the `hypershift.yml` configuration file, and adjust parameters
    accordingly. For example:

    ```yml
    - schema: public
      name: stocks_real_time
      time_column_name: time
      chunk_time_interval: "12h"
      compress:
        after: "48h"
        segmentby:
          - symbol
        orderby:
          - time desc
    ```

1.  At the command prompt, run the hypershift container. Include the source and
    destination database connection strings, and the path to your `hypershift.yml`
    configuration file:

    ```bash
    docker run -v$(pwd)/hypershift.yml -ti timescale/hypershift:latest clone \
    -s "host=<SOURCE_DB_HOSTNAME> user=postgres port=5431 password=<DB_PASSWORD>" \
    -t "host=<TARGET_DB_HOSTNAME> user=postgres port=5432 password=<DB_PASSWORD>" \
    --hypertable /hypershift.yml
    ```

1.  When the migration has finished, a summary of the migration is shown, and
    the Docker container exits.

</procedure>

[cloud-install]: /install/:currentVersion:/installation-cloud/
[docker-install]: https://docs.docker.com/get-docker/
