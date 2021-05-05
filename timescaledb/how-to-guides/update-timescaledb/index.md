# Updating TimescaleDB versions [](update)

This section describes how to upgrade between different versions of
TimescaleDB. TimescaleDB supports **in-place updates only**:
you don't need to dump and restore your data, and versions are published with
automated migration scripts that convert any internal state if necessary.

<highlight type="warning">
There is currently no automated way to downgrade to an earlier release of TimescaleDB without setting up 
a new instance of PostgreSQL with a previous release of TimescaleDB and then using `pg_restore`
from a backup.
</highlight>

### TimescaleDB Release Compatibility [](compatibility)

TimescaleDB currently has three major release versions listed below. Please ensure that your version of
PostgreSQL is supported with the extension version you want to install or update.

 TimescaleDB Release |   Supported PostgreSQL Release
 --------------------|-------------------------------
 1.7                 | 9.6, 10, 11, 12
 2.0                 | 11, 12
 2.1+                | 11, 12, 13

<highlight type="tip">
If you need to upgrade PostgreSQL first, please see [our documentation](/how-to-guides/update-timescaledb/upgrade-postgresql/).
</highlight>

### Upgrade TimescaleDB

To upgrade an existing TimescaleDB instance, follow the documentation below based on
your current upgrade path.

**TimescaleDB 2.0**: [Updating TimescaleDB from 1.x to 2.0-RC1+][update-tsdb-2]

**TimescaleDB 2.0 on Docker**: [Updating TimescaleDB on Docker from 1.7.4 to 2.0-RC1+][update-docker]

**TimescaleDB 1.x**: [Updating TimescaleDB 1.x to 1.7.4][update-tsdb-1]


[upgrade-pg]: /how-to-guides/update-timescaledb/upgrade-postgresql/
[update-tsdb-1]: https://legacy-docs.timescale.com/latest/update-timescaledb/update-tsdb-1
[update-tsdb-2]: /how-to-guides/update-timescaledb/update-timescaledb-2/
[update-docker]: /how-to-guides/update-timescaledb/updating-docker/
