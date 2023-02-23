---
title: Upgrade TimescaleDB
excerpt: Upgrade your self-hosted TimescaleDB installation in-place
keywords: [upgrades]
---

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
*   [Troubleshoot][upgrade-tshoot] upgrading.

<Highlight type="cloud" header="Upgrade automatically" button="Try Timescale Cloud for free">
Timescale Cloud avoids the manual work involved in updating your TimescaleDB
version. Upgrades take place automatically during a maintenance window picked by
you.
[Learn more](https://docs.timescale.com/cloud/latest/service-operations/maintenance/)
about automatic version upgrades in Timescale Cloud.
</Highlight>

[about-upgrades]: /timescaledb/:currentVersion:/how-to-guides/upgrades/about-upgrades/
[downgrade]: /timescaledb/:currentVersion:/how-to-guides/upgrades/downgrade/
[upgrade-docker]: /timescaledb/:currentVersion:/how-to-guides/upgrades/upgrade-docker/
[upgrade-major]: /timescaledb/:currentVersion:/how-to-guides/upgrades/major-upgrade/
[upgrade-minor]: /timescaledb/:currentVersion:/how-to-guides/upgrades/minor-upgrade/
[upgrade-pg]: /timescaledb/:currentVersion:/how-to-guides/upgrades/upgrade-pg/
[upgrade-tshoot]: /timescaledb/:currentVersion:/how-to-guides/upgrades/troubleshooting/
