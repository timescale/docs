import PrereqCloud from "versionContent/_partials/_prereqs-cloud-only.mdx";
import LivesyncLimitations from "versionContent/_partials/_livesync-limitations.mdx";
import LivesyncConfigureSourceDatabase from "versionContent/_partials/_livesync-configure-source-database.mdx";
import TuneSourceDatabaseAWSRDS from "versionContent/_partials/_migrate_live_tune_source_database_awsrds.mdx";

## Prerequisites

<PrereqCloud />

- Install the [PostgreSQL client tools][install-psql] on your sync machine.

- Ensure that the source $PG instance and the target $SERVICE_LONG have the same extensions installed.

    LiveSync does not create extensions on the target. If the table uses column types from an extension,
    first create the extension on the target $SERVICE_LONG before syncing the table.

## Limitations

<LivesyncLimitations />

## Set your connection string

This variable holds the connection information for the source database. In Terminal on your migration machine, 
set the following:

```bash
export SOURCE="postgres://<user>:<password>@<source host>:<source port>/<db_name>"
```

<Highlight type="important">
Avoid using connection strings that route through connection poolers like PgBouncer or similar tools. This tool 
requires a direct connection to the database to function properly.
</Highlight>


## Tune your source database

<Tabs label="Live migration">

<Tab title="From PostgreSQL">
<Procedure>

<LivesyncConfigureSourceDatabase />

</Procedure>

</Tab>
<Tab title="From AWS RDS/Aurora">

<Procedure>

<TuneSourceDatabaseAWSRDS />

</Procedure>

</Tab>
</Tabs>

## Synchronize data to your $SERVICE_LONG

To sync data from your PostgreSQL database to your $SERVICE_LONG using $CONSOLE:

<Procedure>

1. **Connect to your $SERVICE_LONG**

   In [$CONSOLE][portal-ops-mode], select the service to sync live data to. 
1. **Start livesync**
   1. Click `Actions` > `livesync for PostgreSQL`.

1. **Connect the source database and target $SERVICE_SHORT**

   ![Livesync wizard](https://assets.timescale.com/docs/images/livesync-wizard.png)

   In `livesync for PostgreSQL`:
   1. Set the `Livesync Name`.
   2. Set the` PostgreSQL Connection String` to point to the source database you want to sync to Timescale.
   3. Press `Continue`.
      $CONSOLE connects to the source database and retrieves the schema information.

1. **Optimize the data to syncronize in hypertables**

   ![livesync start](https://assets.timescale.com/docs/images/livesync-start.png)
   1. Select the table to sync, and press `+`.
      $CONSOLE checks the table schema and, if possible suggests the column to use as the time dimension in a hypertable. 
   1. Repeat this step for each table you want to sync.
   1. Press `Start Livesync`.
   
      $CONSOLE starts livesync between the source database and the target $SERVICE_SHORT and displays the progress.

1. **Monitor syncronization**
   1. To view the progress of the livesync, click the name of the livesync process:
      ![livesync view status](https://assets.timescale.com/docs/images/livesync-view-status.png)
   1. To pause and restart livesync, click the buttons on the right of the livesync process and select an action:
      ![livesync start stop](https://assets.timescale.com/docs/images/livesync-start-stop.png)

</Procedure>

And that is it, you are using Livesync to synchronize all the data, or specific tables, from a PostgreSQL database 
instance to your $SERVICE_LONG in real-time.

[install-psql]: /integrations/:currentVersion:/psql/
[portal-ops-mode]: https://console.cloud.timescale.com/dashboard/services
