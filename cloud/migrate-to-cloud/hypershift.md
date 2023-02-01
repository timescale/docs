---
title: Migrate with hypershift
excerpt: Migrate an existing PostgreSQL database to Timescale Cloud in a single step
product: cloud
keywords: [data migration, hypershift]
tags: [ingest, hypershift, postgresql]
---

# Migrate with hypershift

Migrate smaller PostgreSQL databases by dumping and restoring the entire
database at once. Hypershift also allows you to enable compression and
hypertable creation on the fly. This method works best on databases smaller than
100&nbsp;GB. For larger databases, consider
[migrating your schema and data separately][migrate-separately].

<highlight type="warning">
Depending on your database size and network speed, migration can take a very
long time. You can continue reading from your source database during this time,
though performance could be slower. To avoid this problem, fork your database
and migrate your data from the fork. If you write to tables in your source
database during the migration, the new writes might not be transferred to
Timescale Cloud. To avoid this problem, see the section on [migrating an active
database](http://docs.timescale.com/cloud/latest/migrate-to-cloud/#migrate-an-active-database).
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

## Download hypershift

<Tabs label="Download hypershift">

<Tab title="MacOS">

<procedure>

### Downloading hypershift on MacOS

1.  Download the hypershift tool for MacOS:

    <tag type="download">[FIXME](https://timescale,com/FIXME)</tag>

1.  Run the file and follow the instructions to compete install.

1.  You can check the file has been installed correctly with this command:

    ```bash
    hypershift --version
    ```

</procedure>

</Tab>

<Tab title="Linux">

<procedure>

### Downloading hypershift on Linux

1.  Download the hypershift tool for MacOS:

    <tag type="download">[FIXME](https://timescale,com/FIXME)</tag>

1.  At the command prompt, install the file:

    <terminal>

    <tab label="Debian-based">

    ```bash
    apt-get install FIXME
    ```

    </tab>

    <tab label="Red Hat-based">

    ```bash
    dnf install FIXME
    ```

    </tab>

    </terminal>

1.  You can check the file has been installed correctly with this command:

    ```bash
    hypershift --version
    ```

</procedure>

</Tab>

</Tabs>

## Run hypershift

In preparation for running hypershift, you need to determine which tables need
to be converted to hypertables, and which tables need to be compressed during
the migration. Hypertables must have a unique column labelled `time`.

hypershift uses a YAML configuration file to determine how to set up your new
Timescale database. You can create your own file, or use our example file as a
starting point. You need these details to complete your configuration file:

*   FIXME
*   FIXME

<Tabs label="Run hypershift">

<Tab title="MacOS">

<procedure>

### Running hypershift on MacOS

1.  Open the `hypershift.yml` configuration file, and adjust parameters
    accordingly. For example:

    ```yml
    FIXME
    ```

1.  At the command prompt, run hypershift. Include the source and destination
    database names, and the path to your `hypershift.yml` configuration file:

    ```bash
    hypershift --source-dsn SOURCE_DB --target-dsn TARGET_DB --hypertable
    ```

</procedure>

</Tab>

<Tab title="Linux">

<procedure>

### Running hypershift on Linux

1.  Determine which tables need to be converted to hypertables, and which tables
    need to be compressed during the migration. Hypertables must have a unique
    column labelled `time`.

1.  Open the `hypershift.yml` configuration file, and adjust parameters
    accordingly. For example:

    ```yml
    FIXME
    ```

1.  At the command prompt, run hypershift. Include the source and destination
    database names, and the path to your `hypershift.yml` configuration file:

1.  At the command prompt, install the file:

    <terminal>

    <tab label="Debian-based">

    ```bash
    hypershift --source-dsn SOURCE_DB --target-dsn TARGET_DB --hypertable
    ```

    </tab>

    <tab label="Red Hat-based">

    ```bash
    hypershift --source-dsn SOURCE_DB --target-dsn TARGET_DB --hypertable
    ```

    </tab>

    </terminal>

</procedure>

</Tab>

</Tabs>

[cloud-install]: /install/:currentVersion:/installation-cloud/
[docker-install]: https://docs.docker.com/get-docker/
[migrate-separately]: /cloud/:currentVersion:/migrate-to-cloud/schema-then-data/
