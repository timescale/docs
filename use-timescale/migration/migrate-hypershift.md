---
title: Migrate to Timescale with Hypershift
excerpt: Migrate an existing PostgreSQL database to Timescale using Hypershift
products: [cloud]
keywords: [data migration, Hypershift]
tags: [ingest, Hypershift, postgresql]
---

import HypershiftIntro from "versionContent/_partials/_hypershift-intro.mdx";
import CloudTrial from "versionContent/_partials/_cloudtrial.mdx";

# Migrate with Hypershift

<HypershiftIntro />

## Prerequisites

Before you begin, make sure you have:

*   Signed up for your [free Timescale account][cloud-install].
*   Installed [Docker][docker-install].

<CloudTrial />

Before you begin the migration, it is recommended that you create an index on
the `time` column of tables in your source database that are going to be
converted to hypertables. Hypershift works without an index, but the migration
runs much slower. The simplest way to achieve this is to create a `btree` index
on the `time` column. However, creating an index can take some time, as the
entire table needs to be read from disk. You can create the `btree` index with
this command:

```sql
CREATE INDEX ON "<TABLE_NAME>" USING btree (time);
```

<Highlight type="important">
Hypershift is not able to efficiently copy and compress data when the only
index is a composite index where `time` is not the first indexed column. If you
already have such a composite index, ensure that your source database has a
plain index before you run the Hypershift migration.
</Highlight>

## Download the Hypershift container

<Tabs label="Download Hypershift">

<Tab title="MacOS">

<Procedure>

### Downloading the Hypershift container on MacOS

1.  Open the Docker app on your local machine to start the service.

1.  At the command prompt, pull the latest Hypershift container from Dockerhub:

    ```bash
    docker pull timescale/hypershift:0.5
    ```

</Procedure>

</Tab>

<Tab title="Linux">

<Procedure>

### Downloading the Hypershift container on Linux

1.  Start the Docker service:

    ```bash
    sudo service docker start
    ```

1.  At the command prompt, pull the latest Hypershift container from Dockerhub:

    ```bash
    docker pull timescale/hypershift:0.5
    ```

</Procedure>

</Tab>

</Tabs>

## Run Hypershift

In preparation for running Hypershift, you need to determine which tables need
to be converted to hypertables, and which tables need to be compressed during
the migration. Hypertables must have a unique column labelled `time`.

Hypershift uses a YAML configuration file to determine how to set up your new
Timescale database. For more information about creating a Hypershift
configuration file, see the
[Hypershift configuration section][hypershift-config].

<Procedure>

### Running Hypershift

1.  Open the `hypershift.yml` configuration file, and adjust parameters
    accordingly. For more information about creating a Hypershift configuration
    file, see the [Hypershift configuration section][hypershift-config].

1.  At the command prompt, run the Hypershift container. Include the source and
    destination database passwords, and the path to your `hypershift.yml`
    configuration file:

    ```bash
    docker run -v $(pwd)/hypershift.yml:/hypershift.yml \
    -ti timescale/hypershift:0.5 \
    -s "host=<SOURCE_DB_HOSTNAME> dbname=<DB_NAME> user=postgres port=5431 password=<DB_PASSWORD>" \
    -t "host=<TARGET_DB_HOSTNAME> dbname=<DB_NAME> user=postgres port=5432 password=<DB_PASSWORD>" \
    --config-file /hypershift.yml
    ```

1.  When the migration has finished, a summary of the migration is shown, and
    the Docker container exits.

</Procedure>

[cloud-install]: /getting-started/latest/
[docker-install]: https://docs.docker.com/get-docker/
[hypershift-config]: /use-timescale/:currentVersion:/migration/hypershift-config/
