
import SupportMatrix from "versionContent/_partials/_migrate_self_postgres_timescaledb_compatibility.mdx";

Best practice is to always use the latest version of TimescaleDB. Subscribe to our releases on GitHub or use $CLOUD_LONG 
and always run the latest update without any hassle. 

Check the following support matrix against the versions of $TIMESCALE_DB and $PG that you are running currently 
and the versions you want to update to, then choose your upgrade path.

For example, to upgrade from $TIMESCALE_DB 2.13 on $PG 13 to $TIMESCALE_DB 2.18.2 you need to:
1. Upgrade $TIMESCALE_DB to 2.15
1. Upgrade $PG to 14, 15 or 16.
1. Upgrade $TIMESCALE_DB to 2.18.2.

You may need to [upgrade to the latest $PG version][upgrade-pg] before you upgrade TimescaleDB. Also,
if you use [$TOOLKIT_LONG][toolkit-install], ensure the `timescaledb_toolkit` extension is >=  
v1.6.0 before you upgrade $TIMESCALE_DB extension.

<SupportMatrix />

[upgrade-pg]: /self-hosted/:currentVersion:/upgrades/upgrade-pg/#upgrade-your-postgresql-instance
[timescale-toolkit]:https://github.com/timescale/timescaledb-toolkit
[toolkit-install]: /self-hosted/:currentVersion:/tooling/install-toolkit/
