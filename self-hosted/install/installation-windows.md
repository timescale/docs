---
title: Install TimescaleDB on Windows
excerpt: Install self-hosted TimescaleDB on Windows
products: [self_hosted]
keywords: [installation, self-hosted, Windows]
---

import Windows from "versionContent/_partials/_psql-installation-windows.mdx";
import WhereTo from "versionContent/_partials/_where-to-next.mdx";
import Skip from "versionContent/_partials/_selfhosted_cta.mdx";
import SelfHostedWindowsBased from "versionContent/_partials/_install-self-hosted-windows-based.mdx";
import AddTimescaleDBToDB from "versionContent/_partials/_add-timescaledb-to-a-database.mdx";

# Install TimescaleDB on Windows

TimescaleDB is a [PostgreSQL extension](https://www.postgresql.org/docs/current/external-extensions.html) for
time series and demanding workloads that ingest and query high volumes of data.

< Skip />

This section shows you how to:

* [Install and configure TimescaleDB on PostgreSQL](#install-and-configure-timescaledb-on-postgresql) - set up
  a self-hosted PostgreSQL instance to efficiently run TimescaleDB. 
* [Add the TimescaleDB extension to your database](#add-the-timescaledb-extension-to-your-database) - enable TimescaleDB features and
  performance improvements on a database.

<Highlight type="warning">

If you have previously installed PostgreSQL without a package manager, you may encounter errors
following these install instructions. Best practice is to full remove any existing PostgreSQL
installations before you begin.

To keep your current PostgreSQL installation, [Install from source][install-from-source].
</Highlight>

### Prerequisites

To install TimescaleDB on your Windows device, you need:

* OpenSSL v3.x
* [Visual C++ Redistributable for Visual Studio 2015][ms-download]


## Install and configure TimescaleDB on PostgreSQL

Best practice for self-hosting TimescaleDB is to install the latest version of PostgreSQL and
TimescaleDB on a [supported platform](#supported-platforms) using the packages supplied by Timescale.

<SelfHostedWindowsBased />


## Add the TimescaleDB extension to your database

For improved performance, you enable TimescaleDB on each database on your self-hosted PostgreSQL instance.
This section shows you how to enable TimescaleDB for a new database in PostgreSQL using `psql` from the command line.


<AddTimescaleDBToDB />

And that is, you have TimescaleDB running on a database on a self-hosted instance of PostgreSQL.


## Where to next

<WhereTo />

## Supported platforms

* The latest TimescaleDB releases for PostgreSQL 13, 14, 15, and 16 are:

    *   <Tag type="download">
        [PostgreSQL 16: Timescale release](https://github.com/timescale/timescaledb/releases/latest/download/timescaledb-postgresql-16-windows-amd64.zip)
        </Tag>
    *   <Tag type="download">
        [PostgreSQL 15: Timescale release](https://github.com/timescale/timescaledb/releases/latest/download/timescaledb-postgresql-15-windows-amd64.zip)
        </Tag>
    *   <Tag type="download">
        [PostgreSQL 14: Timescale release](https://github.com/timescale/timescaledb/releases/latest/download/timescaledb-postgresql-14-windows-amd64.zip)
        </Tag>
    *   <Tag type="download">
        [PostgreSQL 13: Timescale release](https://github.com/timescale/timescaledb/releases/latest/download/timescaledb-postgresql-13-windows-amd64.zip)
        </Tag>

* TimescaleDB is supported on the following platforms:

  *   Microsoft Windows&nbsp;10
  *   Microsoft Windows&nbsp;11
  *   Microsoft Windows Server&nbsp;2019


    For release information, see the [GitHub releases page][gh-releases] and the [release notes][release-notes].
    
[config]: /self-hosted/:currentVersion:/configuration/
[gh-releases]: https://github.com/timescale/timescaledb/releases
[ms-download]: https://www.microsoft.com/en-us/download/details.aspx?id=48145
[pg-download]: https://www.postgresql.org/download/windows/
[release-notes]: /about/:currentVersion:/release-notes/
[windows-releases]: #windows-releases
[install-from-source]: /self-hosted/:currentVersion:/install/installation-source/
