---
title: Install TimescaleDB on Windows
excerpt: Install self-hosted TimescaleDB on Windows
products: [self_hosted]
keywords: [installation, self-hosted, Windows]
---

import Windows from "versionContent/_partials/_psql-installation-windows.mdx";
import WhereTo from "versionContent/_partials/_where-to-next.mdx";
import TestingEnv from "versionContent/_partials/_selfhosted_production_alert.mdx" ;
import SelfHostedWindowsBased from "versionContent/_partials/_install-self-hosted-windows-based.mdx";
import AddTimescaleDBToDB from "versionContent/_partials/_add-timescaledb-to-a-database.mdx";
import WindowsSupport from "versionContent/_partials/_timescaledb_supported_windows.mdx";

# Install $TIMESCALE_DB on Windows

$TIMESCALE_DB is a [$PG extension](https://www.postgresql.org/docs/current/external-extensions.html) for
time series and demanding workloads that ingest and query high volumes of data.

This section shows you how to:

* [Install and configure TimescaleDB on $PG][install-timescaledb]: set up
  a self-hosted $PG instance to efficiently run TimescaleDB. 
* [Add the TimescaleDB extension to your database][add-timescledb-extension]: enable TimescaleDB features and
  performance improvements on a database.

< TestingEnv />

### Prerequisites

To install $TIMESCALE_DB on your Windows device, you need:

* OpenSSL v3.x 

  For $TIMESCALE_DB v2.14.1 only, you need to install OpenSSL v1.1.1.
* [Visual C++ Redistributable for Visual Studio 2015][ms-download]

## Install and configure $TIMESCALE_DB on $PG

This section shows you how to install the latest version of $PG and
$TIMESCALE_DB on a [supported platform][supported-platforms] using the packages supplied by $COMPANY.

<Highlight type="warning">

If you have previously installed $PG, you may encounter errors following these install instructions. 
Best practice is to full remove any existing $PG installations before you begin.

To keep your current $PG installation, [Install from source][install-from-source].

</Highlight>


<SelfHostedWindowsBased />


## Add the $TIMESCALE_DB extension to your database

For improved performance, you enable $TIMESCALE_DB on each database on your self-hosted $PG instance.
This section shows you how to enable $TIMESCALE_DB for a new database in $PG using `psql` from the command line.


<AddTimescaleDBToDB />

And that is it! You have $TIMESCALE_DB running on a database on a self-hosted instance of $PG.

## Supported platforms

The latest $TIMESCALE_DB releases for $PG are:

*   <Tag type="download">

    [Postgres 18: TimescaleDB release](https://github.com/timescale/timescaledb/releases/download/2.23.1/timescaledb-postgresql-18-windows-amd64.zip)

    </Tag>

*   <Tag type="download">
        
     [Postgres 17: TimescaleDB release](https://github.com/timescale/timescaledb/releases/download/2.23.1/timescaledb-postgresql-17-windows-amd64.zip)
  
    </Tag>
*   <Tag type="download">
        
    [Postgres 16: TimescaleDB release](https://github.com/timescale/timescaledb/releases/download/2.23.1/timescaledb-postgresql-16-windows-amd64.zip)
  
    </Tag>
*   <Tag type="download">
        
    [Postgres 15: TimescaleDB release](https://github.com/timescale/timescaledb/releases/download/2.23.1/timescaledb-postgresql-15-windows-amd64.zip)
  
    </Tag>

You can deploy $TIMESCALE_DB on the following systems:

<WindowsSupport />

For release information, see the [GitHub releases page][gh-releases] and the [release notes][release-notes].

## Where to next

<WhereTo />

[config]: /self-hosted/:currentVersion:/configuration/
[gh-releases]: https://github.com/timescale/timescaledb/releases
[ms-download]: https://www.microsoft.com/en-us/download/details.aspx?id=48145
[pg-download]: https://www.postgresql.org/download/windows/
[release-notes]: https://github.com/timescale/timescaledb/releases
[windows-releases]: #windows-releases
[install-from-source]: /self-hosted/:currentVersion:/install/installation-source/
[install-timescaledb]: /self-hosted/:currentVersion:/install/installation-windows/#install-and-configure-timescaledb-on-postgres
[add-timescledb-extension]: /self-hosted/:currentVersion:/install/installation-windows/#add-the-timescale-db-extension-to-your-database
[supported-platforms]: /self-hosted/:currentVersion:/install/installation-windows/#supported-platforms
