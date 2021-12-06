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


[config]: /how-to-guides/configuration/about-configuration
[postgresql-conf]: /how-to-guides/configuration/postgres-config
[tstune-conf]: /how-to-guides/configuration/timescaledb-tune
[docker-conf]: /how-to-guides/configuration/docker-config
[telemetry]: /how-to-guides/configuration/telemetry
