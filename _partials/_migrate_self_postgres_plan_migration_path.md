
import SupportMatrix from "versionContent/_partials/_migrate_self_postgres_timescaledb_compatibility.mdx";

Check the following support matrix against the versions of TimescaleDB and PostgreSQL that you are
running currently and the versions you want to update to, then choose your upgrade path.

For example, to upgrade from TimescaleDB 2.13 on PostgreSQL 13 to TimescaleDB 2.17.2 you need to:
1. Upgrade TimescaleDB to 2.16
1. Upgrade PostgreSQL to 14 or higher
1. Upgrade TimescaleDB to 2.17.2.

If you are currently running versions of TimescaleDB and PostgreSQL that are incompatible,[upgrade PostgreSQL][upgrade-pg]
to a supported version before you upgrade TimescaleDB.

<SupportMatrix />

[upgrade-pg]: /self-hosted/:currentVersion:/upgrades/upgrade-pg/#upgrade-your-postgresql-instance
