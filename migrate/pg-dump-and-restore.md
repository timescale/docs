---
title: Migrate with downtime
excerpt: Migrate a hypertable or entire database with native PostgreSQL commands
products: [cloud, self_hosted]
keywords: [backups, restore]
tags: [recovery, logical backup, pg_dump, pg_restore]
---

import ConsiderCloud from "versionContent/_partials/_consider-cloud.mdx";
import MigrationPrerequisites from "versionContent/_partials/_migrate_prerequisites.mdx";
import MigrationProcedureUntilUpload from "versionContent/_partials/_migrate_to_upload_to_target.mdx";
import DoNotRecommendForLargeMigration from "versionContent/_partials/_migrate_pg_dump_do_not_recommend_for_large_migration.mdx";
import SourceTargetNote from "versionContent/_partials/_migrate_source_target_note.mdx";
import SetupSourceTarget from "versionContent/_partials/_migrate_set_up_source_and_target.mdx";
import TimescaleDBVersion from "versionContent/_partials/_migrate_from_timescaledb_version.mdx";
import ExplainPgDumpFlags from "versionContent/_partials/_migrate_explain_pg_dump_flags.mdx";
import MinimalDowntime from "versionContent/_partials/_migrate_pg_dump_minimal_downtime.mdx";
import DumpDatabaseRoles from "versionContent/_partials/_migrate_dual_write_dump_database_roles.mdx";

# Migrate with downtime

To easily migrate from self-hosted PostgreSQL or TimescaleDB to a Timescale Cloud service, you 
use the native PostgreSQL [`pg_dump`][pg_dump] and [`pg_restore`][pg_restore] commands. If you 
are migrating from self-hosted TimescaleDB, this works for compressed hypertables without having 
to decompress data before you begin.

<DoNotRecommendForLargeMigration />

<MinimalDowntime />

This page shows you how to move your data from a self-hosted database to a Timescale Cloud service using 
shell commands.

## Prerequisites

<MigrationPrerequisites />

- Install the PostgreSQL client tools on the machine you perform the migration from. This includes 
  `psql`, `pg_dump`, and `pg_dumpall`.
- The GNU implementation of `sed`.

  Run `sed --version` on your migration machine. GNU sed identifies itself 
  as GNU software, BSD sed returns `sed: illegal option -- -`.


## Migrate to Timescale Cloud

To move your data from a self-hosted database to a Timescale Cloud service:

<Tabs label="Migrate with downtime">

<Tab title="From TimescaleDB">

This section shows you how to move your data from self-hosted TimescaleDB to a Timescale Cloud service 
using `pg_dump` and `psql` from Terminal. 

<Procedure>

<MigrationProcedureUntilUpload />

8. **Upload your data to the target Timescale Cloud service**

   This command uses the [timescaledb_pre_restore] and [timescaledb_post_restore] functions to put your database in the
   correct state.

    ```bash
    psql $TARGET -v ON_ERROR_STOP=1 --echo-errors \
    -f roles.sql \
    -c "SELECT timescaledb_pre_restore();" \
    -f dump.sql \
    -c "SELECT timescaledb_post_restore();"
    ```

1. **Verify the data in the target Timescale Cloud service, then restart your app**

    Once you have verified that your data is correct, and returns the results that you expect, 
    reconfigure your app to use the target database and then restart it.

</Procedure> 

And that is it, you have migrated your data from a self-hosted instance running TimescaleDB to a Timescale Cloud service. 

</Tab>
<Tab title="From PostgreSQL">

This section shows you how to move your data from self-hosted PostgreSQL to a Timescale Cloud service
using `pg_dump` and `psql` from Terminal.

Migration from PostgreSQL moves the data only. You must manually enable Timescale Cloud features like 
hypertables, data compression or retention after the migration is complete. You enable Timescale Cloud 
features while your database is offline.

<MigrationProcedureUntilUpload />

8. **Upload your data to the target Timescale Cloud service**

    This command uses the [timescaledb_pre_restore] and [timescaledb_post_restore] functions to put your database in the
    correct state.

    ```bash
    psql $TARGET -v ON_ERROR_STOP=1 --echo-errors \
    -f roles.sql \
    -f dump.sql
    ```

1. **Update the table statistics**

    ```bash
    psql $TARGET -c "ANALYZE;"
    ```

1. **Verify the data in the target Timescale Cloud service**

   Check that your data is correct, and returns the results that you expect,

1. **Enable any Timescale Cloud features you want to use**

    Migration from PostgreSQL moves the data only. Now manually enable Timescale Cloud features like
    [hypertables][about-hypertables], [data compression][data-compression] or [data retention][data-retention] 
    while your database is offline.

1. **Reconfigure your app to use the target database, then restart it**


</Tab>

<Tab title="From AWS RDS">

<Highlight type="important">

Some providers like Managed Service for TimescaleDB (MST) and AWS RDS don't
support role password dumps. If dumping the passwords results in the error:

```
pg_dumpall: error: query failed: ERROR:  permission denied for table pg_authid
```

Execute the command adding the `--no-role-passwords` flag. After restoring the
roles into the target database, manually set passwords with `ALTER ROLE name
WITH PASSWORD '<YOUR_PASSOWRD>';`

</Highlight>

</Tab>

<Tab title="From MST">

<Highlight type="important">

Some providers like Managed Service for TimescaleDB (MST) and AWS RDS don't
support role password dumps. If dumping the passwords results in the error:

```
pg_dumpall: error: query failed: ERROR:  permission denied for table pg_authid
```

Execute the command adding the `--no-role-passwords` flag. After restoring the
roles into the target database, manually set passwords with `ALTER ROLE name
WITH PASSWORD '<YOUR_PASSOWRD>';`

</Highlight>

</Tab>
<Tab title="From Multi-node">

</Tab>

</Tabs>



[list of compatible extensions]: /use-timescale/:currentVersion:/extensions/
[pg_dump]: https://www.postgresql.org/docs/current/app-pgdump.html
[pg_restore]: https://www.postgresql.org/docs/current/app-pgrestore.html
[migrate-from-timescaledb]: /migrate/:currentVersion:/pg-dump-and-restore/#migrate-from-timescaledb-using-pg_dumprestore
[migrate-from-postgresql]: /migrate/:currentVersion:/pg-dump-and-restore/#migrate-from-postgresql-using-pg_dumprestore
[dumping-with-concurrency]: /migrate/:currentVersion:/troubleshooting/#dumping-with-concurrency
[restoring-with-concurrency]: /migrate/:currentVersion:/troubleshooting/#restoring-with-concurrency 
[long-running-pgdump]: /migrate/:currentVersion:/troubleshooting/#dumping-and-locks
[Upgrade TimescaleDB]: https://docs.timescale.com/self-hosted/latest/upgrades/
[timescaledb_pre_restore]: /api/:currentVersion:/administration/#timescaledb_post_restore
[timescaledb_post_restore]: /api/:currentVersion:/administration/#timescaledb_post_restore
[about-hypertables]: /use-timescale/:currentVersion:/hypertables/about-hypertables/
[data-compression]: /use-timescale/:currentVersion:/compression/about-compression/
[data-retention]: /use-timescale/:currentVersion:/data-retention/about-data-retention/