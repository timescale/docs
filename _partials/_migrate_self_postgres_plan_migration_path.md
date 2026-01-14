
import SupportMatrix from "versionContent/_partials/_migrate_self_postgres_timescaledb_compatibility.mdx";

Best practice is to always use the latest version of $TIMESCALE_DB. Subscribe to our releases on GitHub or use $CLOUD_LONG 
and always run the latest update without any hassle. 

Check the following support matrix against the versions of $TIMESCALE_DB and $PG that you are running currently
and the versions you want to update to, then choose your upgrade path.

For example, to upgrade from $TIMESCALE_DB 2.13 on $PG 13 to the latest $TIMESCALE_DB version you need to:
1. Upgrade $TIMESCALE_DB to 2.16.1 (last version fully supporting $PG 13)
1. Upgrade $PG to 15, 16, 17, or 18
1. Upgrade $TIMESCALE_DB to the latest available version (2.24.x or higher)

Older $TIMESCALE_DB versions may not be available in package repositories. If you need a specific intermediate
version that is no longer packaged, you can [build from source][build-from-source] or upgrade directly
to the latest version that supports your current $PG version before upgrading $PG.

You may need to upgrade to the latest $PG version before you upgrade $TIMESCALE_DB. Also,
if you use [$TOOLKIT_LONG][install-toolkit], ensure the `timescaledb_toolkit` extension is >=  
v1.6.0 before you upgrade $TIMESCALE_DB extension.

<SupportMatrix />

[install-toolkit]: /self-hosted/:currentVersion:/tooling/install-toolkit/
[upgrade-pg]: /self-hosted/:currentVersion:/upgrades/upgrade-pg/#plan-your-upgrade-path
[build-from-source]: /self-hosted/:currentVersion:/install/installation-source/
