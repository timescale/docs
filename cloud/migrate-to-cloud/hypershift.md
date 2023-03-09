---
title: Migrate with Hypershift
excerpt: Migrate an existing PostgreSQL database to Timescale Cloud in a single step
product: cloud
keywords: [data migration, Hypershift]
tags: [ingest, Hypershift, postgresql]
---

# Migrate with Hypershift

You can use Hypershift&nbsp;0.2&nbsp;(beta) to migrate existing PostgreSQL
databases in one step, and enable compression and hypertable creation on the
fly.

Hypershift can migrate your data in Timescale Cloud from these sources:

*   Standard PostgreSQL databases
*   Amazon RDS databases
*   Other TimescaleDB databases, including Managed Service for Timescale

Because compression is enabled during the migration, you do not need to have the
maximum amount of storage available in the target database before you start
migration.

## Migration speed

In preliminary testing, Hypershift migrated 60&nbsp;GB of data in 9 to 12
minutes, and 1&nbsp;TB of data in under 4 hours.

When you run Hypershift, it uses compute resources on the machine that you run
the command on to copy data from the source to the target database. This means
that the network throughput and latency that you have between the various
machines can impact the speed and duration of the migration.

You can continue reading from your source database during the migration, though
performance could be slower. If you write to tables in your source database
during the migration, the new writes are not transferred to Timescale Cloud. To
avoid this problem, fork your database and migrate your data from the fork. For
more information, see the
[migrating an active database section][migrate-active].

<Highlight type="important">
If you have a large database, and Hypershift is going to have to run for a very
long time to migrate it, for example, a day or more, ensure that you have a
stable network connection. Hypershift is not able to recover if the network
connection is interrupted. Additionally, when Hypershift is running, it holds a
single transaction open for the entire duration of the migration. This prevents
any autovacuum tasks from running, which can cause a range of different
problems on a busy source database.
</Highlight>

If you're migrating from an Amazon RDS database, the best option is to run
Hypershift on an EC2 instance in the same accessibility zone as your RDS
instance.

For migrations from other managed services, including Managed Service for
TimescaleDB, run Hypershift from a virtual machine in the same region as either
the source or target database, whichever is most convenient.

## Prerequisites

Before you begin, make sure you have:

*   Signed up for your [free Timescale Cloud account][cloud-install].
*   Installed [Docker][docker-install].

<Highlight type="cloud" header="Run all tutorials free" button="Try for free">
Your Timescale Cloud trial is completely free for you to use for the first
thirty days. This gives you enough time to complete all the tutorials and run
a few test projects of your own.
</Highlight>

It is recommended that you create an index on the `time` column of your source
database before you begin the migration. Hypershift does work without an index,
but the migration runs much slower. The simplest way to achieve this is to
create a btree index on the `time` column. However, creating an index can take
some time, as the entire table needs to be read from disk. You can create the
btree index with this command:

```sql
CREATE INDEX ON "<TABLE_NAME>" USING btree (time);
```

<highlight type="important">
Hypershift does not support composite indexes where `time` is not the first
indexed column.
</highlight>

## Download the Hypershift container

<Tabs label="Download Hypershift">

<Tab title="MacOS">

<Procedure>

### Downloading the Hypershift container on MacOS

1.  Open the Docker app on your local machine to start the service.

1.  At the command prompt, pull the latest Hypershift container from Dockerhub:

    ```bash
    docker pull timescale/hypershift:0.2
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
    docker pull timescale/hypershift:0.2
    ```

</Procedure>

</Tab>

</Tabs>

## Run Hypershift

In preparation for running Hypershift, you need to determine which tables need
to be converted to hypertables, and which tables need to be compressed during
the migration. Hypertables must have a unique column labelled `time`.

Hypershift uses a YAML configuration file to determine how to set up your new
Timescale database. You can create your own file, or use the example file as a
starting point. To complete your file, you need these details for the tables
that you want to convert to hypertables:

*   The schema which contains the table
*   The name of the table
*   The name of the `time` column of that table
*   The chunk time interval to use
*   The compression policy you want to use

If you are not sure what chunk time interval to use, see the
[time partitioning section][chunk-time].

Use this format:

```yml
- schema: public
  name: <TABLE_NAME>
  time_column_name: <TIME_COLUMN_NAME>
  chunk_time_interval: "12h"
  compress:
    after: "48h"
    segmentby:
      - <COLUMN_NAME>
    orderby:
      - time desc
```

<Procedure>

### Running Hypershift

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

1.  At the command prompt, run the Hypershift container. Include the source and
    destination database connection strings, and the path to your `hypershift.yml`
    configuration file:

    ```bash
    docker run -v $(pwd)/hypershift.yml:/hypershift.yml \
    -ti timescale/hypershift:0.2 clone \
    -s "host=<DB_NAME>.<SOURCE_DB_HOSTNAME> user=postgres port=5431 password=<DB_PASSWORD>" \
    -t "host=<DB_NAME>.<TARGET_DB_HOSTNAME> user=postgres port=5432 password=<DB_PASSWORD>" \
    --hypertable /hypershift.yml
    ```

1.  When the migration has finished, a summary of the migration is shown, and
    the Docker container exits.

</Procedure>

[cloud-install]: /install/:currentVersion:/installation-cloud/
[docker-install]: https://docs.docker.com/get-docker/
[chunk-time]: /timescaledb/:currentVersion:/how-to-guides/hypertables/about-hypertables#best-practices-for-time-partitioning
[migrate-active]: /cloud/:currentVersion:/migrate-to-cloud/#migrate-an-active-database
