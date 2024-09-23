---
title: Configuration
excerpt: Learn about configuring your TimescaleDB instance
products: [self_hosted]
keywords: [configuration, settings]
---

# Configuration

By default, TimescaleDB uses the default PostgreSQL server configuration
settings. However, in some cases, these settings are not appropriate, especially
if you have larger servers that use more hardware resources such as CPU, memory,
and storage.

*   [Learn about configuration][config] to understand how it works before you
    begin using it.
*   Use the [TimescaleDB tune tool][tstune-conf].
*   Manually edit the `postgresql.conf` [configuration file][postgresql-conf].
*   If you run TimescaleDB in a Docker container, configure
    [within Docker][docker-conf].
*   Find out more about the [data that we collect][telemetry].

[config]: /self-hosted/:currentVersion:/configuration/about-configuration
[docker-conf]: /self-hosted/:currentVersion:/configuration/docker-config
[postgresql-conf]: /self-hosted/:currentVersion:/configuration/postgres-config
[telemetry]: /self-hosted/:currentVersion:/configuration/telemetry
[tstune-conf]: /self-hosted/:currentVersion:/configuration/timescaledb-tune
