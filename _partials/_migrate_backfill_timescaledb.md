import MigrationSetupFirstSteps from "versionContent/_partials/_migrate_backfill_set_up_database_first_steps.mdx";
import MigrationSetupDBConnectionTimescaleDB from "versionContent/_partials/_migrate_set_up_align_db_extensions_timescaledb.mdx";
import ChooseCompletionPoint from "versionContent/_partials/_migrate-backfill-choose-completion-point.mdx";
import MigrationProcedureDumpSchemaMST from "versionContent/_partials/_migrate_backfill_dump_roles_schema_data_mst.mdx";
import MigrationValidateRestartApp from "versionContent/_partials/_migrate_validate_and_restart_app.mdx";

## Prepare to migrate
<Procedure>

<MigrationSetupFirstSteps />

</Procedure>

## Align the version of TimescaleDB on the source and target

<Procedure>

<MigrationSetupDBConnectionTimescaleDB />

</Procedure>

## Download roles and relational data from source

Roles manage database access permissions. To download the role-based security hierarchy and relational
data to your migration machine:

<Procedure>

<MigrationProcedureDumpSchemaMST />

</Procedure>

## Upload the roles and relational data and start dual-write 

<Procedure>


1. Upload your data and roles to your <Variable name="SERVICE"/>:

  This command uses the [timescaledb_pre_restore] and [timescaledb_post_restore] functions to put your database in the
  correct state. Background jobs are turned off to prevent continuous aggregate refresh jobs from updating continuous 
  aggregate with incomplete/missing data. You upload continuous aggregates manually in the required range once migration 
  is complete.

   ```bash
  psql -X -d "$TARGET" \
    -v ON_ERROR_STOP=1 \
    --echo-errors \
    -f roles.sql \
    -c 'select public.timescaledb_pre_restore();' \
    -f dump.sql \
    -f - <<'EOF'
  begin;
  select public.timescaledb_post_restore();
  
  -- disable all background jobs
  select public.alter_job(id::integer, scheduled=>false)
  from _timescaledb_config.bgw_job
  where id >= 1000
  ;
  commit;
  EOF
   ```

1. Start your app writing simultaneously to the source and target.


</Procedure>


## Choose a completion point

<ChooseCompletionPoint />


## SIGH


## Validate your Timescale Cloud service and restart your app
<Procedure>

<MigrationValidateRestartApp />

</Procedure>

[timescaledb_pre_restore]: /api/:currentVersion:/administration/#timescaledb_post_restore
[timescaledb_post_restore]: /api/:currentVersion:/administration/#timescaledb_post_restore
