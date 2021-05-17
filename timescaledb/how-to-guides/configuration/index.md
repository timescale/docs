# Configuring TimescaleDB

TimescaleDB works with the default PostgreSQL server configuration settings.
However, we find that these settings are typically too conservative and
can be limiting when using larger servers with more resources (CPU, memory,
disk, etc). Adjusting these settings, either
[automatically with our tool `timescaledb-tune`][tstune] or manually editing
your machine's `postgresql.conf`, can improve performance.

<highlight type="tip">
You can determine the location of `postgresql.conf` by running
`SHOW config_file;` from your PostgreSQL client (e.g., `psql`).
</highlight>

In addition, other TimescaleDB specific settings can be modified through the
`postgresql.conf` file as discussed in our section about [TimescaleDB settings][ts-settings]

[tstune]: https://github.com/timescale/timescaledb-tune
[pgtune]: http://pgtune.leopard.in.ua/
[async-commit]: https://www.postgresql.org/docs/current/static/wal-async-commit.html
[synchronous-commit]: https://www.postgresql.org/docs/current/static/runtime-config-wal.html#GUC-SYNCHRONOUS-COMMIT
[lock-management]: https://www.postgresql.org/docs/current/static/runtime-config-locks.html
[docker]: /how-to-guides/install-timescaledb//docker/installation-docker
[wale]: /how-to-guides/backup-and-restore/docker-and-wale/
[chunk_detailed_size]: /api/:currentVersion:/hypertable/chunk_detailed_size
[ts-settings]: /how-to-guides/configuration/timescaledb-config
