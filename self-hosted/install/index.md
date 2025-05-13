---
title: Install self-hosted TimescaleDB
excerpt: Deploy TimescaleDB on your own hardware. Deploy on Docker, Kubernetes, Linux, MacOS, Windows, or build from source
products: [self_hosted]
keywords: [installation]
---

import TimescaleDB from "versionContent/_partials/_timescaledb.mdx";
import TestingEnv from "versionContent/_partials/_selfhosted_production_alert.mdx" ;

# Install TimescaleDB

$TIMESCALE_DB is an extension for $PG that enables time-series workloads,
increasing ingest, query, storage and analytics performance.

<TestingEnv />

You can install self-hosted TimescaleDB for free from
[source][self-hosted-source], or a [pre-built container][self-hosted-container].
This guide provides instructions for installing the latest version of
TimescaleDB. For more details about the latest release, see the
[release notes][release-notes] section.

<Installation />

[self-hosted-source]: /self-hosted/:currentVersion:/install/installation-source/
[self-hosted-container]: /self-hosted/:currentVersion:/install/installation-docker/
[release-notes]: https://github.com/timescale/timescaledb/releases
