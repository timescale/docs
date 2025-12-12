---
title: Install TimescaleDB on macOS
excerpt: Install self-hosted TimescaleDB on macOS with Homebrew or MacPorts
products: [self_hosted]
keywords: [installation, self-hosted, macOS]
---

import WhereTo from "versionContent/_partials/_where-to-next.mdx";
import TestingEnv from "versionContent/_partials/_selfhosted_production_alert.mdx" ;
import SelfHostedHomebrew from "versionContent/_partials/_install-self-hosted-homebrew-based.mdx";
import SelfHostedMacports from "versionContent/_partials/_install-self-hosted-macports-based.mdx";
import AddTimescaleDBToDB from "versionContent/_partials/_add-timescaledb-to-a-database.mdx";
import MacosSupport from "versionContent/_partials/_timescaledb_supported_macos.mdx";

# Install self-hosted $TIMESCALE_DB on macOS

TimescaleDB is a [$PG extension](https://www.postgresql.org/docs/current/external-extensions.html) for
time series and demanding workloads that ingest and query high volumes of data. You can host TimescaleDB on 
macOS device.

This section shows you how to:

* [Install and configure $TIMESCALE_DB on $PG][install-and-configure-timescaledb-on-postgresql-link] - set up
  a self-hosted $PG instance to efficiently run TimescaleDB.
* [Add the $TIMESCALE_DB extension to your database][add-the-timescaledb-extension-to-your-database-link] - enable $TIMESCALE_DB
  features and performance improvements on a database.

< TestingEnv />

### Prerequisites

To install TimescaleDB on your MacOS device, you need:

* [$PG][install-postgresql]: for the latest functionality, install $PG v16

<Highlight type="warning">

If you have already installed $PG using a method other than Homebrew or MacPorts, you may encounter errors
following these install instructions. Best practice is to full remove any existing $PG
installations before you begin.

To keep your current $PG installation, [Install from source][install-from-source].

</Highlight>

## Install and configure $TIMESCALE_DB on $PG

This section shows you how to install the latest version of $PG and
$TIMESCALE_DB on a [supported platform][supported-platforms-link] using the packages supplied by $COMPANY.

<Tabs label="Install TimescaleDB">

<Tab title="Homebrew">

<SelfHostedHomebrew />

</Tab>

<Tab title="MacPorts">

<SelfHostedMacports />

</Tab>
</Tabs>

## Add the $TIMESCALE_DB extension to your database

For improved performance, you enable TimescaleDB on each database on your self-hosted $PG instance.
This section shows you how to enable TimescaleDB for a new database in $PG using `psql` from the command line.


<AddTimescaleDBToDB />

And that is it! You have TimescaleDB running on a database on a self-hosted instance of $PG.

## Supported platforms

You can deploy $TIMESCALE_DB on the following systems:

<MacosSupport />

For the latest functionality, install MacOS 14 Sonoma. 

## Where to next

 <WhereTo />

[install-from-source]: /self-hosted/:currentVersion:/install/installation-source/
[install-postgresql]: https://www.postgresql.org/download/macosx/
[add-the-timescaledb-extension-to-your-database-link]: /self-hosted/:currentVersion:/install/installation-macos/#add-the-timescale_db-extension-to-your-database
[install-and-configure-timescaledb-on-postgresql-link]: /self-hosted/:currentVersion:/install/installation-macos/#install-self-hosted-timescale_db-on-macos
[supported-platforms-link]: /self-hosted/:currentVersion:/install/installation-macos/#supported-platforms
