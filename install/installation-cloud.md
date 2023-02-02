---
title: Install Timescale Cloud
nav-title: Timescale Cloud
excerpt: Start a TimescaleDB instance on Timescale Cloud, our hosted, cloud-native TimescaleDB service
product: cloud
section: install
order: 1
keywords: [installation]
---

import Install from "versionContent/_partials/_cloud-installation.mdx";
import CreateService from "versionContent/_partials/_cloud-create-service.mdx";
import Connect from "versionContent/_partials/_cloud-connect.mdx";

# Install Timescale Cloud

Timescale Cloud is a hosted, cloud-native TimescaleDB service that allows you to
quickly spin up new TimescaleDB instances. You can
[try Timescale Cloud for free][sign-up], no credit card required.

Powered by [TimescaleDB][timescale-features], Timescale Cloud is an innovative
and cost-effective way to store and analyze your time-series data. Get started
super fast with demo data, or your own dataset, and enjoy the security of
automated upgrades and backups.

<Install />

## Create your first service

<CreateService demoData={false} />

## Connect to your service from the command prompt

<Connect />

## Check that you have the TimescaleDB extension

TimescaleDB is provided as an extension to your PostgreSQL database, and it is
enabled by default when you create a new service on Timescale Cloud. You can
check that the TimescaleDB extension is installed by using the `\dx` command at
the `psql` prompt. It looks like this:

```sql
tsdb=> \dx
List of installed extensions
-[ RECORD 1 ]------------------------------------------------------------------
Name        | pg_stat_statements
Version     | 1.7
Schema      | public
Description | track execution statistics of all SQL statements executed
-[ RECORD 2 ]------------------------------------------------------------------
Name        | plpgsql
Version     | 1.0
Schema      | pg_catalog
Description | PL/pgSQL procedural language
-[ RECORD 3 ]------------------------------------------------------------------
Name        | timescaledb
Version     | 2.4.1
Schema      | public
Description | Enables scalable inserts and complex queries for time-series data
-[ RECORD 4 ]------------------------------------------------------------------
Name        | timescaledb_toolkit
Version     | 1.3.1
Schema      | public
Description | timescaledb_toolkit

tsdb=>
```

## Where to next

Now that you have your first service up and running, you can check out the
[Timescale Cloud][tsc-docs] section in our documentation, and
find out what you can do with it.

If you want to work through some tutorials to help you get up and running with
TimescaleDB and time-series data, check out our [tutorials][tutorials] section.

If you're interested in learning more about pricing for Managed Service for
TimescaleDB, visit the
[managed service for TimescaleDB pricing calculator][timescale-pricing].

You can always [contact us][contact] if you need help working something out, or
if you want to have a chat.

[contact]: https://www.timescale.com/contact
[sign-up]: https://www.timescale.com/timescale-signup
[timescale-features]: https://www.timescale.com/products/#Features
[timescale-pricing]: https://www.timescale.com/products#cloud-pricing
[tsc-docs]: /cloud/:currentVersion:/
[tutorials]: /timescaledb/:currentVersion:/tutorials/
