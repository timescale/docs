---
title: Migrate your data to Tiger Cloud
excerpt: Migrate existing database to Tiger Cloud
products: [cloud]
keywords: [data migration, postgresql, hypershift, RDS]
tags: [ingest, migrate, RDS]
---

# Migrate your data to $CLOUD_LONG

You can migrate data from another database into $CLOUD_LONG
using Hypershift. You can also use hypershift to migrate your data
from $MST_LONG, from a $SELF_LONG instance, or
from another PostgreSQL database, including Amazon RDS.

*   Understand how hypershift works before you begin using it.
*   Migrate your data with hypershift.
*   Configure hypershift.

If you want to import data from another format, such as a `.csv` file, into a
new $SELF_LONG databse, see the [data ingest section][data-ingest].

If you want to migrate existing data into a $SELF_LONG database,
see the [self-hosted data migration section][self-hosted-migration].

If you want to migrate existing data into Managed Service for TimescaleDB, see
the [Managed Service for TimescaleDB migration section][mst-migration].

[data-ingest]: /use-timescale/:currentVersion:/ingest-data/
[self-hosted-migration]: /self-hosted/:currentVersion:/migration/
[mst-migration]: /mst/:currentVersion:/migrate-to-mst/
