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

To install TimescaleDB from source, you need the following on your developer environment:

* **PostgreSQL**: 

   Install a [supported version of PostgreSQL][compatibility-matrix] using the [PostgreSQL installation instructions][postgres-download]. 

    We recommend not using TimescaleDB with PostgreSQL 17.1, 16.5, 15.9, 14.14, 13.17, 12.21.  
    These minor versions [introduced a breaking binary interface change][postgres-breaking-change] that,
    once identified, was reverted in subsequent minor PostgreSQL versions 17.2, 16.6, 15.10, 14.15, 13.18, and 12.22.
    When you build from source, best practice is to build with PostgreSQL 17.2, 16.6, etc and higher.
    Users of [Timescale Cloud](https://console.cloud.timescale.com/) and Platform packages built and
    distributed by Timescale are unaffected.


* **Build tools**:

  *   [CMake version 3.11 or later][cmake-download]
  *   C language compiler for your operating system, such as `gcc` or `clang`.

      If you are using a Microsoft Windows system, you can install Visual Studio 2015
      or later instead of CMake and a C language compiler. Ensure you install the
      Visual Studio components for CMake and Git when you run the installer.
    


## Install and configure TimescaleDB on PostgreSQL

This section shows you how to install the latest version of PostgreSQL and
TimescaleDB on a supported platform using source supplied by Timescale.

<SelfHostedSource />


## Add the TimescaleDB extension to your database

For improved performance, you enable TimescaleDB on each database on your self-hosted PostgreSQL instance.
This section shows you how to enable TimescaleDB for a new database in PostgreSQL using `psql` from the command line.

<AddTimescaleDBToDB />

And that is it! You have TimescaleDB running on a database on a self-hosted instance of PostgreSQL.

## Where to next

<WhereTo />

[install-psql]: /use-timescale/:currentVersion:/integrations/psql/
[config]: /self-hosted/:currentVersion:/configuration/
[postgres-download]: https://www.postgresql.org/download/
[cmake-download]: https://cmake.org/download/
[compatibility-matrix]: /self-hosted/:currentVersion:/upgrades/upgrade-pg/#plan-your-upgrade-path
[postgres-breaking-change]: https://www.postgresql.org/about/news/postgresql-172-166-1510-1415-1318-and-1222-released-2965/
