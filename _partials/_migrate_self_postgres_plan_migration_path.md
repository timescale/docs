
import SupportMatrix from "versionContent/_partials/_migrate_self_postgres_timescaledb_compatibility.mdx";

Best practice is to always use the latest version of TimescaleDB. Subscribe to our releases on GitHub or use Timescale
Cloud and always get latest update without any hassle. 

Check the following support matrix against the versions of TimescaleDB and PostgreSQL that you are running currently 
and the versions you want to update to, then choose your upgrade path.

For example, to upgrade from TimescaleDB 2.13 on PostgreSQL 13 to TimescaleDB 2.17.2 you need to:
1. Upgrade TimescaleDB to 2.16
1. Upgrade PostgreSQL to 14 or higher
1. Upgrade TimescaleDB to 2.17.2.

You may need to [upgrade to the latest PostgreSQL version][upgrade-pg] before you upgrade TimescaleDB. Also,
if you use [Timescale Toolkit][toolkit-install], ensure the `timescaledb_toolkit` extension is >=  
v1.6.0 before you upgrade TimescaleDB extension.

<SupportMatrix />

[upgrade-pg]: /self-hosted/:currentVersion:/upgrades/upgrade-pg/#upgrade-your-postgresql-instance
[timescale-toolkit]:https://github.com/timescale/timescaledb-toolkit
[toolkit-install]: /self-hosted/:currentVersion:/tooling/install-toolkit/
