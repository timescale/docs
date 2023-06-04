---
title: Upgrade TimescaleDB
excerpt: Upgrade your self-hosted TimescaleDB installation in-place
products: [self_hosted]
keywords: [upgrades]
---

import ConsiderCloud from "versionContent/_partials/_consider-cloud.mdx";

# Upgrade TimescaleDB

You can upgrade your on-premise TimescaleDB installation in-place.

A major upgrade is when you upgrade from one major version of TimescaleDB, to
the next major version. For example, when you upgrade from TimescaleDB&nbsp;1,
to TimescaleDB&nbsp;2.

A minor upgrade is when you upgrade within your current major version of
TimescaleDB. For example, when you upgrade from TimescaleDB&nbsp;2.5, to
TimescaleDB&nbsp;2.6.

If you originally installed TimescaleDB using Docker, you can upgrade from
within the Docker container. For more information, and instructions, see the
[Upgrading with Docker section][upgrade-docker].

You can also downgrade your TimescaleDB installation to a previous version, if
you need to.

*   [Learn about upgrades][about-upgrades] to understand how it works
    before you begin your upgrade.
*   Upgrade to the next [minor version][upgrade-minor] of TimescaleDB.
*   Upgrade to the next [major version][upgrade-major] of TimescaleDB.
*   [Downgrade][downgrade] to a previous version of TimescaleDB.
*   Upgrade TimescaleDB using [Docker][upgrade-docker].
*   Upgrade the version of [PostgreSQL][upgrade-pg] your TimescaleDB
    installation uses.

<ConsiderCloud />

[about-upgrades]: /self-hosted/:currentVersion:/upgrades/about-upgrades/
[downgrade]: /self-hosted/:currentVersion:/upgrades/downgrade/
[upgrade-docker]: /self-hosted/:currentVersion:/upgrades/upgrade-docker/
[upgrade-major]: /self-hosted/:currentVersion:/upgrades/major-upgrade/
[upgrade-minor]: /self-hosted/:currentVersion:/upgrades/minor-upgrade/
[upgrade-pg]: /self-hosted/:currentVersion:/upgrades/upgrade-pg/
[upgrade-tshoot]: /self-hosted/:currentVersion:/troubleshooting/
