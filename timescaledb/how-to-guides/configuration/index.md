---
title: Configuration
excerpt: Learn about configuring your TimescaleDB instance
keywords: [configuration, settings]
---

# Configuration

By default, TimescaleDB uses the default PostgreSQL server configuration
settings. However, in some cases, these settings are not appropriate, especially
if you have larger servers that use more hardware resources such as CPU, memory,
and storage.

* [Learn about configuration][config] to understand how it works before you
    begin using it.
* Use the [TimescaleDB tune tool][tstune-conf].
* Manually edit the `postgresql.conf` [configuration file][postgresql-conf].
* If you run TimescaleDB in a Docker container, configure
    [within Docker][docker-conf].
* View [logs and service metadata][logs] for help troubleshooting problems.
* Find out more about the [data that we collect][telemetry].

[config]: /timescaledb/:currentVersion:/how-to-guides/configuration/about-configuration
[docker-conf]: /timescaledb/:currentVersion:/how-to-guides/configuration/docker-config
[logs]: /timescaledb/:currentVersion:/how-to-guides/configuration/logs
[postgresql-conf]: /timescaledb/:currentVersion:/how-to-guides/configuration/postgres-config
[telemetry]: /timescaledb/:currentVersion:/how-to-guides/configuration/telemetry
[tstune-conf]: /timescaledb/:currentVersion:/how-to-guides/configuration/timescaledb-tune
