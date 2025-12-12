---
title: Install self-hosted TimescaleDB
excerpt: Deploy TimescaleDB on your own hardware. Deploy on Docker, Kubernetes, Linux, MacOS, Windows, or build from source
products: [self_hosted]
keywords: [installation]
---

import TimescaleDB from "versionContent/_partials/_timescaledb.mdx";
import TestingEnv from "versionContent/_partials/_selfhosted_production_alert.mdx" ;

# Install $TIMESCALE_DB

$TIMESCALE_DB is an open-source $PG extension that powers $CLOUD_LONG. Designed for running real-time analytics on time-series data, it supercharges ingest, query, storage, and analytics performance.

You can install $SELF_LONG from [source][install-from-source], with a [pre-built Docker container][docker-install], or on one of the [supported platforms][platform-support]. This section provides instructions for installing the latest version of $SELF_LONG. 

<TestingEnv />

<Installation />

For more details about the latest release, see the [release notes][relnotes] section.

[install-from-source]: /self-hosted/:currentVersion:/install/installation-source/
[docker-install]: /self-hosted/:currentVersion:/install/installation-docker/
[relnotes]: https://github.com/timescale/timescaledb/releases
[platform-support]: /about/:currentVersion:/supported-platforms/
