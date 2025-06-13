import MigrationSetupFirstSteps from "versionContent/_partials/_migrate_set_up_database_first_steps.mdx";
import MigrationSetupDBConnectionTimescaleDB from "versionContent/_partials/_migrate_set_up_align_db_extensions_timescaledb.mdx";
import MigrationProcedureDumpSchemaPostgres from "versionContent/_partials/_migrate_dump_roles_schema_data_postgres.mdx";
import MigrationValidateRestartApp from "versionContent/_partials/_migrate_validate_and_restart_app.mdx";

## Prepare to migrate
<Procedure>

<MigrationSetupFirstSteps />

</Procedure>

## Align the version of TimescaleDB on the source and target
<Procedure>

<MigrationSetupDBConnectionTimescaleDB />

</Procedure>

## Migrate the roles from$TIMESCALE_DB to your $SERVICE_LONG

Roles manage database access permissions. To migrate your role-based security hierarchy to your $SERVICE_LONG:
<Procedure>

<MigrationProcedureDumpSchemaPostgres />

</Procedure>

## Upload your data to the target $SERVICE_LONG

This command uses the [timescaledb_pre_restore] and [timescaledb_post_restore] functions to put your database in the
correct state.

 ```bash
 psql $TARGET -v ON_ERROR_STOP=1 --echo-errors \
 -f roles.sql \
 -c "SELECT timescaledb_pre_restore();" \
 -f dump.sql \
 -c "SELECT timescaledb_post_restore();"
 ```

## Validate your $SERVICE_LONG and restart your app
<Procedure>

<MigrationValidateRestartApp />

</Procedure>

[timescaledb_pre_restore]: /api/:currentVersion:/administration/#timescaledb_post_restore
[timescaledb_post_restore]: /api/:currentVersion:/administration/#timescaledb_post_restore
