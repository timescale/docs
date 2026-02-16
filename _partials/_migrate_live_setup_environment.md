import SetupConnectionStrings from "versionContent/_partials/_migrate_live_setup_connection_strings.mdx";
import MigrationSetupDBConnectionTimescaleDB from "versionContent/_partials/_migrate_set_up_align_db_extensions_timescaledb.mdx";
import TuneSourceDatabase from "versionContent/_partials/_migrate_live_tune_source_database.mdx";


## Set your connection strings

<SetupConnectionStrings />

## Align the version of TimescaleDB on the source and target
<Procedure>

<MigrationSetupDBConnectionTimescaleDB />

</Procedure>

## Tune your source database
<Procedure>

<TuneSourceDatabase />

</Procedure>
