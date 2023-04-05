---
title: About migrating to Timescale Cloud with Hypershift
excerpt: Migrate an existing PostgreSQL database to Timescale Cloud in a single step
products: [cloud]
keywords: [data migration, Hypershift]
tags: [ingest, Hypershift, postgresql]
---

# About Hypershift

You can use Hypershift&nbsp;0.3&nbsp;(beta) to migrate existing PostgreSQL
databases in one step, and enable compression and hypertable creation on the
fly.

Hypershift can migrate your data in Timescale Cloud from these sources:

*   Standard PostgreSQL databases
*   Amazon RDS databases
*   Other Timescale databases, including Managed Service for Timescale

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
avoid this problem, fork your database and migrate your data from the fork.

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
Hypershift on an EC2 instance in the same availability zone as your RDS
instance.

For migrations from other managed services, including Managed Service for
TimescaleDB, run Hypershift from a virtual machine in the same region as either
the source or target database, whichever is most convenient.
