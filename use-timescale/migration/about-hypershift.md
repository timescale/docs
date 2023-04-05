---
title: About migrating to Timescale Cloud with hypershift
excerpt: Migrate an existing PostgreSQL database to Timescale Cloud in a single step
products: [cloud]
keywords: [data migration, Hypershift]
tags: [ingest, Hypershift, postgresql]
---

import HypershiftIntro from "versionContent/_partials/_hypershift-intro.mdx";

# About Hypershift

<HypershiftIntro />

## Migrating from a managed database

If you're migrating from an Amazon RDS database, the best option is to run
hypershift on an EC2 instance in the same availability zone as your RDS
instance.

<Highlight type="note">
Availability zones are assigned different names in different AWS
accounts. To make sure that you are using the same zone refer to
[AWS user guide](https://docs.aws.amazon.com/ram/latest/userguide/working-with-az-ids.html)
</Highlight>

For migrations from other managed services, including Managed Service for
TimescaleDB, run hypershift from a virtual machine in the same region as either
the source or target database, whichever is most convenient.

## Migration speed

In preliminary testing, hypershift migrated 60&nbsp;GB of data in 9 to 12
minutes, and 1&nbsp;TB of data in under 4 hours.

When you run hypershift, it uses compute resources on the machine that you run
the command on to copy data from the source to the target database. This means
that the network throughput and latency that you have between the various
machines can impact the speed and duration of the migration.

You can continue reading from your source database during the migration, though
performance could be slower. If you write to tables in your source database
during the migration, the new writes are not transferred to Timescale Cloud. To
avoid this problem, fork your database and migrate your data from the fork.

<Highlight type="important">
If you have a large database, and hypershift is going to have to run for a very
long time to migrate it, for example, a day or more, ensure that you have a
stable network connection. Hypershift is not able to recover if the network
connection is interrupted. Additionally, when Hypershift is running, it holds a
single transaction open for the entire duration of the migration. This prevents
any automated vacuum tasks from running, which can cause a range of different
problems on a busy source database.
</Highlight>

## The hypershift command line tool

To see all available configuration options for Hypershift, use this command:

```bash
docker run -ti timescale/hypershift:0.4 --help
```

Hypershift supports the following CLI flags

```shell
./hypershift --help
hypershift

hypershift clones a PostgreSQL data source into a TimescaleDB database.
It uses parallel workers to speed up the process, and requires almost
no local storage, except some temporary files.

It requires a pg_dump binary to be in the path that is compatible with the
source database.


Usage:

Options:
  -C, --config-file <CONFIG_FILE>
          Path for Hypershift configuration file. Please refer <TODO: weblink>
          for more details regarding configuring Hypershift.

          [env: HYPERSHIFT_CONFIG_FILE=]
          [default: ]

  -S, --source-uri <SOURCE>
          URI for source database

          [env: HYPERSHIFT_SOURCE_URI=]
          [default: ]

  -T, --target-uri <TARGET>
          URI for target database

          [env: HYPERSHIFT_TARGET_URI=]
          [default: ]

      --ignore-missing-time-index
          Ignore the fact that hypertables may be missing a time index

          [env: HYPERSHIFT_IGNORE_MISSING_TIME_INDEX=]

  -h, --help
          Print help (see a summary with '-h')

  -V, --version
          Print version


Example:

Migrate by using source database and target database CLI flags only, along with default configuration settings:
./hypershift -S='host=localhost dbname=postgres port=5432 user=postgres password=source_password' -T='host=localhost dbname=postgres port=5433 user=postgres password=target_password'

Migrate by configuring Hypershift using a configuration file:
./hypershift -C=config.yaml

Migrate with source database and target database as CLI flags and configuring Hypershift using a configuration file:
./hypershift -C=config.yaml -S='host=localhost dbname=postgres port=5432 user=postgres password=source_password' -T='host=localhost dbname=postgres port=5433 user=postgres password=target_password'
```

You can provide source and target database URI either in the CLI flags or in the configuration file. In case of both, CLI flags would take the precedence.
