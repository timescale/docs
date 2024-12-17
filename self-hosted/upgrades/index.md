---
title: Upgrade TimescaleDB
excerpt: Upgrade your self-hosted TimescaleDB installation in-place
products: [self_hosted]
keywords: [upgrades]
---

import ConsiderCloud from "versionContent/_partials/_consider-cloud.mdx";

# Upgrade TimescaleDB

A major upgrade is when you update from TimescaleDB `X.<minor version>` to `Y.<minor version>`.
A minor upgrade is when you update from TimescaleDB `<major version>.x`, to TimescaleDB `<major version>.y`.
You upgrade your self-hosted TimescaleDB installation in-place.

<ConsiderCloud />

This section shows you how to:

* Upgrade self-hosted TimescaleDB to a new [minor version][upgrade-minor].
* Upgrade self-hosted TimescaleDB to a new [major version][upgrade-major].
* Upgrade self-hosted TimescaleDB running in a [Docker container][upgrade-docker] to a new minor version.
* Upgrade [PostgreSQL][upgrade-pg] to a new version.
* Downgrade self-hosted TimescaleDB to the [previous minor version][downgrade].

[downgrade]: /self-hosted/:currentVersion:/upgrades/downgrade/
[upgrade-docker]: /self-hosted/:currentVersion:/upgrades/upgrade-docker/
[upgrade-major]: /self-hosted/:currentVersion:/upgrades/major-upgrade/
[upgrade-minor]: /self-hosted/:currentVersion:/upgrades/minor-upgrade/
[upgrade-pg]: /self-hosted/:currentVersion:/upgrades/upgrade-pg/
[upgrade-tshoot]: /self-hosted/:currentVersion:/troubleshooting/
