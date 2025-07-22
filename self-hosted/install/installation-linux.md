---
title: Install TimescaleDB on Linux
excerpt: Install self-hosted TimescaleDB on Debian, Red Hat, or ArchLinux
products: [self_hosted]
keywords: [installation, self-hosted, Debian, Ubuntu, RHEL, Fedora]
---

import WhereTo from "versionContent/_partials/_where-to-next.mdx";
import TestingEnv from "versionContent/_partials/_selfhosted_production_alert.mdx" ;
import SelfHostedDebianBased from "versionContent/_partials/_install-self-hosted-debian-based.mdx";
import SelfHostedRedhatBased from "versionContent/_partials/_install-self-hosted-redhat-based.mdx";
import SelfHostedArchLinuxBased from "versionContent/_partials/_install-self-hosted-archlinux-based.mdx";
import AddTimescaleDBToDB from "versionContent/_partials/_add-timescaledb-to-a-database.mdx";


# Install $TIMESCALE_DB on Linux

TimescaleDB is a [$PG extension](https://www.postgresql.org/docs/current/external-extensions.html) for 
time series and demanding workloads that ingest and query high volumes of data.

This section shows you how to:

* [Install and configure $TIMESCALE_DB on $PG](#install-and-configure-timescaledb-on-postgresql) - set up
  a self-hosted $PG instance to efficiently run TimescaleDB.
* [Add the $TIMESCALE_DB extension to your database](#add-the-timescaledb-extension-to-your-database) - enable $TIMESCALE_DB
  features and performance improvements on a database. 


< TestingEnv/>

## Install and configure $TIMESCALE_DB on $PG 

This section shows you how to install the latest version of $PG and
$TIMESCALE_DB on a [supported platform](#supported-platforms) using the packages supplied by $COMPANY. 

<Highlight type="warning">

If you have previously installed $PG without a package manager, you may encounter errors
following these install instructions. Best practice is to fully remove any existing $PG
installations before you begin.

To keep your current $PG installation, [Install from source][install-from-source].

</Highlight>

<Tabs label="Install TimescaleDB" persistKey="os">

<Tab title="Debian, Ubuntu" label="ubuntu">

<SelfHostedDebianBased />

</Tab>

<Tab title="Red Hat, Fedora" label="redhat">

<SelfHostedRedhatBased />

</Tab>

<Tab title="ArchLinux" label="archlinux">

<SelfHostedArchLinuxBased />

</Tab>

</Tabs>

Job jobbed, you have installed $PG and TimescaleDB.

## Add the $TIMESCALE_DB extension to your database

For improved performance, you enable TimescaleDB on each database on your self-hosted $PG instance.
This section shows you how to enable TimescaleDB for a new database in $PG using `psql` from the command line.


<AddTimescaleDBToDB />

And that is it! You have TimescaleDB running on a database on a self-hosted instance of $PG.  

## Where to next

<WhereTo />


## Supported platforms

TimescaleDB is supported on the following platforms:

|Debian|Ubuntu|Red Hat Enterprise|Fedora|Rocky Linux|
|-|-|-|-|-|
|Debian 10 Buster|Ubuntu 20.04 LTS Focal Fossa|Red Hat Enterprise Linux 7|Fedora 33|Rocky Linux 8|
|Debian 11 Bullseye|Ubuntu 22.04 LTS Jammy Jellyfish|Red Hat Enterprise Linux 8|Fedora 34|Rocky Linux 9|
|Debian 12 Bookworm|Ubuntu 23.04 Lunar Lobster|Red Hat Enterprise Linux 9|Fedora 35| |
||Ubuntu 24.04 LTS Noble Numbat||| |

[install-from-source]: /self-hosted/:currentVersion:/install/installation-source/
