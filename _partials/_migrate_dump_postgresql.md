import MigrationSetupFirstSteps from "versionContent/_partials/_migrate_set_up_database_first_steps.mdx";
import MigrationSetupDBConnectionPostgresql from "versionContent/_partials/_migrate_set_up_align_db_extensions_postgres_based.mdx";
import MigrationProcedureDumpSchemaPostgres from "versionContent/_partials/_migrate_dump_roles_schema_data_postgres.mdx";
import MigrationValidateRestartApp from "versionContent/_partials/_migrate_validate_and_restart_app.mdx";

## Prepare to migrate
<Procedure>

<MigrationSetupFirstSteps />

</Procedure>

## Align the source and target database versions and extensions
<Procedure>

<MigrationSetupDBConnectionPostgresql />

</Procedure>

## Migrate the roles from TimescaleDB to your Timescale Cloud service

Roles manage database access permissions. To migrate your role-based security hierarchy to your Timescale Cloud service:
<Procedure>

<MigrationProcedureDumpSchemaPostgres />

</Procedure>

## Upload your data to the target Timescale Cloud service

```bash
psql $TARGET -v ON_ERROR_STOP=1 --echo-errors \
-f roles.sql \
-f dump.sql
```

## Validate your Timescale Cloud service and restart your app
<Procedure>

<MigrationValidateRestartApp />

</Procedure>
