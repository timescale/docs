import SetupConnectionStrings from "versionContent/_partials/_migrate_live_setup_connection_strings.mdx";
import TuneSourceDatabaseMST from "versionContent/_partials/_migrate_live_tune_source_database_mst.mdx";
import MigrateSetupTargetEnvironment from "versionContent/_partials/_migrate_live_setup_environment_target_config.mdx";

## Set your connection strings

<SetupConnectionStrings />

## Tune your source database

<Procedure>

<TuneSourceDatabaseMST />

</Procedure>

## Tune the target Timescale Cloud service

<Procedure>

<MigrateSetupTargetEnvironment />

</Procedure>


[modify-parameters]: /use-timescale/:currentVersion:/configuration/customize-configuration/#modify-basic-parameters
[mst-portal]: https://portal.managed.timescale.com/login