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

### TimescaleDB release compatibility [](compatibility)

TimescaleDB currently has three major release versions listed below. Please ensure that your version of
PostgreSQL is supported with the extension version you want to install or update.

 TimescaleDB Release |   Supported PostgreSQL Release
 --------------------|-------------------------------
 1.7                 | 9.6, 10, 11, 12
 2.0                 | 11, 12
 2.1-2.3             | 11, 12, 13
 2.4+                | 12, 13

<highlight type="tip">
If you need to upgrade PostgreSQL first, please see [our documentation](/timescaledb/latest/how-to-guides/update-timescaledb/upgrade-postgresql/).

**Please note** that we always recommend that PostgreSQL and TimescaleDB be updated
as separate actions to ensure each process completes properly. For example, if you 
are currently running PostgreSQL 10 and TimescaleDB 1.7.5, the recommended upgrade 
path to PostgreSQL 13 and TimescaleDB 2.2 would be:

1. Upgrade PostgreSQL 10 to PostgreSQL 12
1. Update TimescaleDB 1.7.5 to TimescaleDB 2.2 on PostgreSQL 12
1. Upgrade PostgreSQL 12 to PostgreSQL 13 with TimescaleDB 2.2 installed

</highlight>

### Upgrade TimescaleDB

To upgrade an existing TimescaleDB instance, follow the documentation below based on
your current upgrade path.

**Update within major versions (1.x or 2.x)**: [Updating TimescaleDB][update-timescaledb]

**TimescaleDB from 1.x to 2.x**: [Updating TimescaleDB from 1.x to 2.x][update-tsdb-2]

**TimescaleDB from 1.x to 2.x on Docker**: [Updating TimescaleDB on Docker from 1.x to 2.x][update-docker]


[upgrade-pg]: /how-to-guides/update-timescaledb/upgrade-postgresql/
[update-timescaledb]: /how-to-guides/update-timescaledb/update-timescaledb/
[update-tsdb-2]: /how-to-guides/update-timescaledb/update-timescaledb-2/
[update-docker]: /how-to-guides/update-timescaledb/updating-docker/
