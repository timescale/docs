---
title: About upgrades
excerpt: About major and minor upgrades, and best practices for upgrading
keywords: [upgrade]
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

<highlight type="cloud" header="Upgrade automatically" button="Try Timescale Cloud for free">
Timescale Cloud avoids the manual work involved in updating your TimescaleDB
version. Upgrades take place automatically during a maintenance window picked by
you.
[Learn more](https://docs.timescale.com/cloud/latest/service-operations/maintenance/)
about automatic version upgrades in Timescale Cloud.
</highlight>

## Plan your upgrade
<PlanUpgrade />

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

[upgrade-docker]: /timescaledb/:currentVersion:/how-to-guides/update-timescaledb/upgrade-docker/
