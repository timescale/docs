---
title: Migrate with downtime
excerpt: Migrate a hypertable or entire database with native PostgreSQL commands
products: [cloud, self_hosted]
keywords: [backups, restore]
tags: [recovery, logical backup, pg_dump, pg_restore]
---

import ConsiderCloud from "versionContent/_partials/_consider-cloud.mdx";
import MigrationPrerequisites from "versionContent/_partials/_migrate_prerequisites.mdx";
import MigrationSetupFirstSteps from "versionContent/_partials/_migrate_set_up_database_first_steps.mdx";
import MigrationSetupDBConnectionPostgres from "versionContent/_partials/_migrate_set_up_align_db_extensions_postgres_based.mdx";
import MigrationSetupDBConnectionTimescaleDB from "versionContent/_partials/_migrate_set_up_align_db_extensions_timescaledb.mdx";
import MigrationProcedureUntilUpload from "versionContent/_partials/_migrate_to_upload_to_target.mdx";
import MigrationProcedureDumpSchemaPostgres from "versionContent/_partials/_migrate_dump_roles_schema_data_postgres.mdx";

import MigrationProcedureDumpSchemaMST from "versionContent/_partials/_migrate_dump_roles_schema_data_mst.mdx";
import MigrationValidateRestartApp from "versionContent/_partials/_migrate_validate_and_restart_app.mdx";
import MigrateAWSRDSConnectIntermediary from "versionContent/_partials/_migrate_awsrds_connect_intermediary.mdx";
import MigrateAWSRDSMigrateData from "versionContent/_partials/_migrate_awsrds_migrate_data_downtime.mdx";
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
- Install the GNU implementation of `sed`.

  Run `sed --version` on your migration machine. GNU sed identifies itself 
  as GNU software, BSD sed returns `sed: illegal option -- -`.


## Migrate to Timescale Cloud

To move your data from a self-hosted database to a Timescale Cloud service:

<Tabs label="Migrate with downtime">

<Tab title="From TimescaleDB">

This section shows you how to move your data from self-hosted TimescaleDB to a Timescale Cloud service 
using `pg_dump` and `psql` from Terminal. 

<MigrationSetupFirstSteps />

2. **Align the source and target database versions and extensions** 

    <MigrationSetupDBConnectionTimescaleDB />

3. **Migrate the roles from TimescaleDB to your Timescale Cloud service**

    Roles manage database access permissions. To migrate your role-based security hierarchy to your Timescale Cloud service:

    <MigrationProcedureDumpSchemaPostgres />

4. **Upload your data to the target Timescale Cloud service**

   This command uses the [timescaledb_pre_restore] and [timescaledb_post_restore] functions to put your database in the
   correct state.

    ```bash
    psql $TARGET -v ON_ERROR_STOP=1 --echo-errors \
    -f roles.sql \
    -c "SELECT timescaledb_pre_restore();" \
    -f dump.sql \
    -c "SELECT timescaledb_post_restore();"
    ```

5. **Validate your Timescale Cloud service and restart your app**

    <MigrationValidateRestartApp />


And that is it, you have migrated your data from a self-hosted instance running TimescaleDB to a Timescale Cloud service. 

</Tab>
<Tab title="From PostgreSQL">

This section shows you how to move your data from self-hosted PostgreSQL to a Timescale Cloud service
using `pg_dump` and `psql` from Terminal.

Migration from PostgreSQL moves the data only. You must manually enable Timescale Cloud features like
[hypertables][about-hypertables], [data compression][data-compression] or [data retention][data-retention] after the migration is complete. You enable Timescale Cloud 
features while your database is offline.

<MigrationSetupFirstSteps />

3. **Align the source and target database versions and extensions**

    <MigrationSetupDBConnectionPostgres />

4. **Migrate the roles from PostgreSQL to your Timescale Cloud service**

   Roles manage database access permissions. To migrate your role-based security hierarchy to your Timescale Cloud service:
    <MigrationProcedureDumpSchemaPostgres />

5. **Upload your data to the target Timescale Cloud service**

    ```bash
    psql $TARGET -v ON_ERROR_STOP=1 --echo-errors \
    -f roles.sql \
    -f dump.sql
    ```

6. **Validate your Timescale Cloud service and restart your app**

    <MigrationValidateRestartApp />


And that is it, you have migrated your data from a self-hosted instance running PostgreSQL to a Timescale Cloud service.

</Tab>

<Tab title="From AWS RDS">

To migrate your data from an Amazon RDS instance to a Timescale Cloud service, you extract the data to an intermediary 
EC2 Ubuntu instance in the same AWS region as your RDS instance. You then upload your data to a Timescale Cloud service. 
To make this process as painless as possible, ensure that the intermediary machine has enough CPU and disk space to 
rapidy extract and store your data before uploading to Timescale Cloud.  

Migration from RDS moves the data only. You must manually enable Timescale Cloud features like
[hypertables][about-hypertables], [data compression][data-compression] or [data retention][data-retention] after the migration is complete. You enable Timescale Cloud
features while your database is offline.

This section shows you how to move your data from an Amazon RDS instance to a Timescale Cloud service
using `pg_dump` and `psql` from Terminal.

The steps are:

* [Setup secure connectivity between RDS and an intermediary EC2 instance](#setup-secure-connectivity-between-rds-and-an-intermediary-ec2-instance-)
* [Migrate your data to your Timescale Cloud service](#migrate-your-data-to-your-timescale-cloud-service)

### Setup secure connectivity between RDS and an intermediary EC2 instance 

To create the secured connection between migration machines:

<MigrateAWSRDSConnectIntermediary />

### Migrate your data to your Timescale Cloud service

To securely migrate data from your RDS instance:

<MigrateAWSRDSMigrateData />

6. **Validate your Timescale Cloud service and restart your app**

    <MigrationValidateRestartApp />

And that is it, you have migrated your data from an RDS instance to a Timescale Cloud service.

</Tab>


<Tab title="From MST">

This section shows you how to move your data from a Managed Service for Timescale (MST) instance to a 
Timescale Cloud service using `pg_dump` and `psql` from Terminal.


<MigrationSetupFirstSteps />

2. **Align the source and target database versions and extensions**

    <MigrationSetupDBConnectionTimescaleDB />

3. **Migrate the roles from TimescaleDB to your Timescale Cloud service**

   Roles manage database access permissions. To migrate your role-based security hierarchy to your Timescale Cloud service:

    <MigrationProcedureDumpSchemaMST />

4. **Upload your data to the target Timescale Cloud service**

   This command uses the [timescaledb_pre_restore] and [timescaledb_post_restore] functions to put your database in the
   correct state.

   1. Upload your data.
     ```bash
     psql $TARGET -v ON_ERROR_STOP=1 --echo-errors \
       -f roles.sql \
       -c "SELECT timescaledb_pre_restore();" \
       -f dump.sql \
       -c "SELECT timescaledb_post_restore();"
     ```
   1. Manually assign passwords to the roles.

      MST did not allow you to export passwords with roles. For each role, use the following command to manually
      assign a password to a role:

      ```bash
       psql $TARGET -c "ALTER ROLE <role name> WITH PASSWORD '<highly secure password>';"
       ```

5. **Validate your Timescale Cloud service and restart your app**

    <MigrationValidateRestartApp />

And that is it, you have migrated your data from a self-hosted instance running TimescaleDB to a Timescale Cloud service.


</Tab>

<Tab title="From Multi-node">

Sigh

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