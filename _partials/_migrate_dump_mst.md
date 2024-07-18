import MigrationSetupFirstSteps from "versionContent/_partials/_migrate_set_up_database_first_steps.mdx";
import MigrationSetupDBConnectionTimescaleDB from "versionContent/_partials/_migrate_set_up_align_db_extensions_timescaledb.mdx";
import MigrationProcedureDumpSchemaMST from "versionContent/_partials/_migrate_dump_roles_schema_data_mst.mdx";
import MigrationValidateRestartApp from "versionContent/_partials/_migrate_validate_and_restart_app.mdx";

## Prepare to migrate
<Procedure>

<MigrationSetupFirstSteps />

</Procedure>

## Align the source and target database versions and extensions
<Procedure>

<MigrationSetupDBConnectionTimescaleDB />

</Procedure>

## Migrate the roles from TimescaleDB to your Timescale Cloud service

Roles manage database access permissions. To migrate your role-based security hierarchy to your Timescale Cloud service:
<Procedure>

<MigrationProcedureDumpSchemaMST />

</Procedure>

## Upload your data to the target Timescale Cloud service

This command uses the [timescaledb_pre_restore] and [timescaledb_post_restore] functions to put your database in the
correct state.

<Procedure>

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

</Procedure>

## Validate your Timescale Cloud service and restart your app
<Procedure>

<MigrationValidateRestartApp />

</Procedure>
