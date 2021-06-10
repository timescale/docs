# Configuration
By default, TimescaleDB uses the default PostgreSQL server configuration
settings. However, in some cases, these settings are not appropriate, especially
if you have larger servers that use more hardware resources such as CPU, memory,
and storage.

You can configure TimescaleDB in several ways:
*   Manually edit the `postgresql.conf` [configuration file][postgresql-conf] .
*   Use the [TimescaleDB tune tool][tstune-conf].
*   If you run TimescaleDB in a Docker container, use a [Docker container][docker-conf].

[postgresql-conf]: /how-to-guides/configuration/postgres-config
[tstune-conf]: /how-to-guides/configuration/timescaledb-tune
[docker-conf]: /how-to-guides/configuration/docker-config
