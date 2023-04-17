---
title: About upgrades
excerpt: About major and minor upgrades, and best practices for upgrading
products: [self_hosted]
keywords: [upgrades]
---

import PlanUpgrade from 'versionContent/_partials/_plan_upgrade.mdx';

# About upgrades

A major upgrade is when you upgrade from one major version of TimescaleDB, to
the next major version. For example, when you upgrade from TimescaleDB&nbsp;1
to TimescaleDB&nbsp;2.

A minor upgrade is when you upgrade within your current major version of
TimescaleDB. For example, when you upgrade from TimescaleDB&nbsp;2.5 to
TimescaleDB&nbsp;2.6.

If you originally installed TimescaleDB using Docker, you can upgrade from
within the Docker container. For more information, and instructions, see the
[Upgrading with Docker section][upgrade-docker].

## Plan your upgrade

<PlanUpgrade />

<Highlight type="note">
If you use the Timescale Toolkit, ensure the `timescale_toolkit` extension is on
version 1.4, then upgrade the `timescaledb` extension. If required, you
can then later upgrade the `timescale_toolkit` extension to the most
recent version.
</Highlight>

## Check your version

You can check which version of TimescaleDB you are running, at the psql command
prompt. Use this to check which version you are running before you begin your
upgrade, and again after your upgrade is complete:

```sql
\dx timescaledb

    Name     | Version |   Schema   |                             Description
-------------+---------+------------+---------------------------------------------------------------------
 timescaledb | x.y.z   | public     | Enables scalable inserts and complex queries for time-series data
(1 row)
```

[upgrade-docker]: /self-hosted/:currentVersion:/upgrades/upgrade-docker/
