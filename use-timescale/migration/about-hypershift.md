---
title: About migrating to Timescale with hypershift
excerpt: Migrate an existing PostgreSQL database to Timescale in a single step
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

For migrations from other managed services, including Managed Service for
TimescaleDB, run hypershift from a virtual machine in the same region as either
the source or target database, whichever is most convenient.

## Migration speed

In preliminary testing, hypershift migrated 60&nbsp;GB of data in 9 to 12
minutes, and 1&nbsp;TB of data in under 4 hours. However, there are
many different factors that can contribute to the throughput speed of
a migration.

When you run hypershift, it uses compute resources on the machine that you run
the command on to copy data from the source to the target database. This means
that the network throughput and latency that you have between the various
machines can impact the speed and duration of the migration.

You can continue reading from your source database during the migration, though
performance could be slower. If you write to tables in your source database
during the migration, the new writes are not transferred to Timescale.

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

Hypershift is launched from the command prompt. You can provide a number of
different options to hypershift when you issue the command. This section
describes the various options.

You can also provide configuration to hypershift using a YAML configuration
file. For more information about constructing a hypershift configuration file,
see the
[hypershift configuration section][hypershift-config].

You can provide the source and target database URIs using either command line
flags, or the configuration file. If the information is provided in both,
hypershift uses the URIs provided in the command line flags, and ignores the
URIs in the configuration file.

To see all available configuration options for hypershift, use this command:

```bash
docker run -ti timescale/hypershift:0.6 --help
```

### The hypershift clone tool

You can use the hypershift `clone` command to preserve a copy of your database
in the source location. Hypershift creates a full copy of the contents of
your source database, and moves it into the target database. You can add
parameters to the `clone` command to filter which contents to copy.

For more information about the `clone` tool, use the `hypershift clone --help`
command.

|Short command|Long command|Example use|Description|
|-|-|-|-|
|-s|--source|-s <SOURCE_URI>|URI to the source database|
|-t|--target|-t <TARGET_URI>|URI to the target database|
||--source-password|--source-password|Password for the source database|
||--target-password|--target-password|Password for the target database|
||--parallel|--parallel <NUMBER\>|Number of workers that can simultaneously fetch data from the target database|
||--verify|--verify|Verify the migrated data by comparing the source and target database|
||--ignore-missing-time-index|--ignore-missing-time-index|Ignore that hypertables may be missing a time index|
||--hide-progress|--hide-progress|Hide migration progress bar|
||--verbose|--verbose|Display verbose logs with progress bar|
|-c|--config-file|-c <PATH\>|Path to an advanced hypershift configuration file. For more information, see [hypershift-config]|
|-h|--help||Print hypershift help|

### Example hypershift commands

Migrate using the default configuration settings, without using a separate
configuration file, providing the source and target database URIs at the command
prompt:

```bash
docker run -ti timescale/hypershift:0.6 clone -s='host=localhost dbname=postgres port=5432 user=postgres password=source_password' \
-t='host=localhost dbname=postgres port=5433 user=postgres password=target_password'
```

Migrate using a configuration file only:

```bash
docker run -v $(pwd)/config.yaml:/config.yaml -ti timescale/hypershift:0.6 clone -c=config.yaml
```

Migrate using a configuration file, and provide source and target database URIs
at the command prompt:

```bash
docker run -v $(pwd)/config.yaml:/config.yaml -ti timescale/hypershift:0.6 clone -c=config.yaml \
-s='host=localhost dbname=postgres port=5432 user=postgres password=source_password' \
-t='host=localhost dbname=postgres port=5433 user=postgres password=target_password'
```

[hypershift-config]: /use-timescale/:currentVersion:/migration/hypershift-config/
