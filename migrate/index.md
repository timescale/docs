---
title: Migrate your data to Timescale
excerpt: Migrate existing database to Timescale
products: [cloud]
keywords: [data migration, postgresql, RDS]
tags: [ingest, migrate, RDS]
---

import OpenSupportRequest from "versionContent/_partials/_migrate_open_support_request.mdx"

# Migrate your data to Timescale

<Highlight type="note">
Migration assistance is included with Timescale's support service. If you would
like help understanding your options, please reach out to our support.

<OpenSupportRequest />

</Highlight>

There are a number of different ways to migrate your data to Timescale. Which
option you choose depends on a few different factors, the most important of
which are:

- How much downtime you can afford (minutes, or hours?)
- How much data you are migrating (megabytes, or terabytes?)
- Where you are migrating your data from (PostgreSQL, TimescaleDB, Influx, or MySQL?)

Below are the different migration options we offer. You can choose the one that best suits your requirements:

| Migration strategy                        | Supported sources                | Use when                                                             | Downtime requirements          |
|-------------------------------------------|----------------------------------|----------------------------------------------------------------------|--------------------------------|
| [pg_dump and pg_restore][pg-dump-restore] | Postgres, TimescaleDB            | Downtime is okay                                                     | Requires some downtime         |
| [Dual-write and backfill][dual-write]     | Postgres, TimescaleDB and others | Append-only data, heavy insert workload (~20,000 inserts per second) | Optimized for minimal downtime |
| [Live migration][live-migration]          | Postgres, TimescaleDB            | Simplified end-to-end migration with almost zero downtime            | Optimized for minimal downtime |

If you are using PostgreSQL or TimescaleDB and can afford to take your
application offline for a few hours, the simplest option is to migrate data
from another database into Timescale using PostgreSQL's `pg_dump` and
`pg_restore` commands. 

You can also use these tools to migrate your data from Managed Service for
TimescaleDB, from a self-hosted TimescaleDB instance, or from another
PostgreSQL database, including Amazon RDS.

If you are looking for a low-downtime alternative (with downtime on the order
of minutes), you can choose one of our low downtime migration offerings:

1. Live migration
2. Dual-write and backfill

Live migration is Timescale's packaging of Postgres' logical replication
functionality, which leverages the excellent [pgcopydb] project from the
Postgres community. Live migration is an end-to-end solution which copies the
database schema and data, and then replicates changes in real-time from one
database to the other.

Dual-write and backfill is a method to write from your application to two
databases at once, and gives tooling and guidance to move your existing data
from the one database to the other. It is specifically catered for, and relies
on, your data being predominantly append-only time-series data. As such, it
comes with some caveats and prerequisites which live migration does not
(dual-write and backfill does not support executing `UPDATE` or `DELETE`
statements on your data). Additionally, it requires you to make changes to the
ingest pipeline of your application.

We recommend using live migration if modifying your application logic to
perform dual writes is a significant effort on your end, or if you are using
`UPDATE` and `DELETE` statements on your time-series data. If your application
is writing more than 20'000 rows per second, you should use dual-write and
backfill instead.

We recommend using dual-write and backfill if modifying your ingest pipeline is
not an issue, and if you want to evaluate your existing solution side-by-side
with the new Timescale-based solution. Dual-write and backfill is the only
low-downtime solution if you're migrating from a database other than PostgreSQL.

If you're migrating from something other than PostgreSQL, and don't want to use
above listed migration options, then the easiest way to move your data to
Timescale is by exporting the data from your existing database as a `.csv` file,
and importing it with [timescaledb-parallel-copy][parallel-copy].

For other ingestion methods, see the [data ingest section][data-ingest].

For a detailed, step-by-step guide on migrating from various databases to Timescale, please refer to the migration [playbooks].

If you encounter any difficulties while migrating, consult the
[troubleshooting] documentation, open a support request, or take
your issue to the `#migration` channel in the [community slack](https://slack.timescale.com/),
where the developers of this migration method are there to help.

<OpenSupportRequest />

[data-ingest]: /use-timescale/:currentVersion:/ingest-data/
[dual-write]: /migrate/:currentVersion:/dual-write-and-backfill/
[pg-dump-restore]: /migrate/:currentVersion:/pg-dump-and-restore/
[parallel-copy]: /use-timescale/:currentVersion:/ingest-data/import-csv/
[troubleshooting]: /migrate/:currentVersion:/troubleshooting/
[live-migration]: /migrate/:currentVersion:/live-migration/
[pgcopydb]: https://github.com/dimitri/pgcopydb
[playbooks]: /migrate/:currentVersion:/playbooks/