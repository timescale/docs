---
title: Install TimescaleDB on Linux
excerpt: Install self-hosted TimescaleDB on Linux
products: [self_hosted]
keywords: [installation, self-hosted, Debian, Ubuntu, RHEL, Fedora]
---

import WhereTo from "versionContent/_partials/_where-to-next.mdx";
import Skip from "versionContent/_partials/_selfhosted_cta.mdx";
import SelfHostedDebianBased from "versionContent/_partials/_install-self-hosted-debian-based.mdx";
import SelfHostedRedhatBased from "versionContent/_partials/_install-self-hosted-redhat-based.mdx";
import SelfHostedArchLinuxBased from "versionContent/_partials/_install-self-hosted-archlinux-based.mdx";
import AddTimescaleDBToDB from "versionContent/_partials/_add-timescaledb-to-a-database.mdx";


# Install TimescaleDB on Linux

TimescaleDB is a [PostgreSQL extension](https://www.postgresql.org/docs/current/external-extensions.html) for 
time series and demanding workloads that ingest and query high volumes of data.

< Skip/>

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

## Install and configure TimescaleDB on PostgreSQL 

This section shows you how to install the latest version of PostgreSQL and 
TimescaleDB on a [supported platform][supported-platforms-self-hosted] using the packages supplied by Timescale. 

<Tabs label="Install TimescaleDB">

<Tab title="Debian, Ubuntu">

<SelfHostedDebianBased />

</Tab>

<Tab title="Red Hat, Fedora">

<SelfHostedRedhatBased />

</Tab>

<Tab title="ArchLinux">

<SelfHostedArchLinuxBased />

</Tab>

</Tabs>

Job jobbed, you have installed PostgreSQL and TimescaleDB.

## Add the TimescaleDB extension to your database

For improved performance, you enable TimescaleDB on each database on your self-hosted PostgreSQL instance.
This section shows you how to enable TimescaleDB for a new database in PostgreSQL using `psql` from the command line.


<AddTimescaleDBToDB />

And that is it! You have TimescaleDB running on a database on a self-hosted instance of PostgreSQL.  

## Where to next

<WhereTo />

[install-from-source]: /self-hosted/:currentVersion:/install/installation-source/
[supported-platforms-self-hosted]: /about/:currentVersion:/supported-platforms/#self-hosted-timescaledb
