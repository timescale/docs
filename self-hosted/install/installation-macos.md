---
title: Install TimescaleDB on macOS
excerpt: Install self-hosted TimescaleDB on macOS
products: [self_hosted]
keywords: [installation, self-hosted, macOS]
---

import WhereTo from "versionContent/_partials/_where-to-next.mdx";
import Skip from "versionContent/_partials/_selfhosted_cta.mdx";
import SelfHostedHomebrew from "versionContent/_partials/_install-self-hosted-homebrew-based.mdx";
import SelfHostedMacports from "versionContent/_partials/_install-self-hosted-macports-based.mdx";
import AddTimescaleDBToDB from "versionContent/_partials/_add-timescaledb-to-a-database.mdx";

# Install self-hosted TimescaleDB on macOS

TimescaleDB is a [PostgreSQL extension](https://www.postgresql.org/docs/current/external-extensions.html) for
time series and demanding workloads that ingest and query high volumes of data. You can host TimescaleDB on 
macOS device.

< Skip /> 

This section shows you how to:

* [Install and configure TimescaleDB on PostgreSQL](#install-and-configure-timescaledb-on-postgresql) - set up
  a self-hosted PostgreSQL instance to efficiently run TimescaleDB.
* [Add the TimescaleDB extension to your database](#add-the-timescaledb-extension-to-your-database) - enable TimescaleDB features and
  performance improvements on a database.

### Prerequisites

To install TimescaleDB on your MacOS device, you need:

* [PostgreSQL][install-postgresql]: for the latest functionality, install PostgreSQL v16

<Highlight type="warning">
If you have already installed PostgreSQL using a method other than Homebrew or MacPorts, you may encounter errors
following these install instructions. Best practice is to full remove any existing PostgreSQL
installations before you begin.

To keep your current PostgreSQL installation, [Install from source][install-from-source].
</Highlight>

## Install and configure TimescaleDB on PostgreSQL

Best practice for self-hosting TimescaleDB is to install the latest version of PostgreSQL and
TimescaleDB on a [supported platform](#supported-platforms) using the packages supplied by Timescale.

<Tabs label="Install TimescaleDB">

<Tab title="Homebrew">

<SelfHostedHomebrew />

</Tab>

<Tab title="MacPorts">

<SelfHostedMacports />

</Tab>
</Tabs>

## Add the TimescaleDB extension to your database

For improved performance, you enable TimescaleDB on each database on your self-hosted PostgreSQL instance.
This section shows you how to enable TimescaleDB for a new database in PostgreSQL using `psql` from the command line.


<AddTimescaleDBToDB />

And that is, you have TimescaleDB running on a database on a self-hosted instance of PostgreSQL.


## Where to next

 <WhereTo />

## Supported platforms

For the latest functionality, install MacOS 14 Sanoma. The oldest supported version is macOS 10.15 Catalina

[homebrew]: https://docs.brew.sh/Installation
[install-psql]: /use-timescale/:currentVersion:/integrations/query-admin/about-psql/
[macports]: https://guide.macports.org/#installing.macports
[install-from-source]: /self-hosted/:currentVersion:/install/installation-source/
[install-postgresql]: https://www.postgresql.org/download/macosx/