---
title: Install TimescaleDB from source
excerpt: Install self-hosted TimescaleDB from source
products: [self_hosted]
keywords: [installation, self-hosted]
---

import WhereTo from "versionContent/_partials/_where-to-next.mdx";
import Skip from "versionContent/_partials/_selfhosted_cta.mdx";
import SelfHostedSource from "versionContent/_partials/_install-self-hosted-source-based.mdx";
import AddTimescaleDBToDB from "versionContent/_partials/_add-timescaledb-to-a-database.mdx";

# Install self-hosted TimescaleDB from source

TimescaleDB is a [PostgreSQL extension](https://www.postgresql.org/docs/current/external-extensions.html) for
time series and demanding workloads that ingest and query high volumes of data. You can install a TimescaleDB
instance on any local system, from source.

< Skip/>

This section shows you how to:

* [Install and configure TimescaleDB on PostgreSQL](#install-and-configure-timescaledb-on-postgresql) - set up
  a self-hosted PostgreSQL instance to efficiently run TimescaleDB1.
* [Add the TimescaleDB extension to your database](#add-the-timescaledb-extension-to-your-database) - enable TimescaleDB features and
  performance improvements on a database.

### Prerequisites

To install TimescaleDB from source, you need:

*   A [supported version of PostgreSQL][compatibility-matrix] installed on your developer environment 

    For PostgreSQL installation instructions, see the [PostgreSQL documentation][postgres-download].

* Build tools:

  *   [CMake version 3.11 or later][cmake-download]
  *   C language compiler for your operating system, such as `gcc` or `clang`.

    <Highlight type="note">
    If you are using a Microsoft Windows system, you can install Visual Studio 2015
    or later instead of CMake and a C language compiler. Ensure you install the
    Visual Studio components for CMake and Git when you run the installer.
    </Highlight>


## Install and configure TimescaleDB on PostgreSQL

Best practice for self-hosting TimescaleDB is to install the latest version of PostgreSQL and
TimescaleDB on a supported platform using source supplied by Timescale.

<SelfHostedSource />


## Add the TimescaleDB extension to your database

For improved performance, you enable TimescaleDB on each database on your self-hosted PostgreSQL instance.
This section shows you how to enable TimescaleDB for a new database in PostgreSQL using `psql` from the command line.

<AddTimescaleDBToDB />

And that is it! You have TimescaleDB running on a database on a self-hosted instance of PostgreSQL.

## Where to next

<WhereTo />

[install-psql]: /use-timescale/:currentVersion:/integrations/query-admin/about-psql/
[config]: /self-hosted/:currentVersion:/configuration/
[postgres-download]: https://www.postgresql.org/download/
[cmake-download]: https://cmake.org/download/
[compatibility-matrix]: /self-hosted/:currentVersion:/upgrades/upgrade-pg/
