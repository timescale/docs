import PrereqCloud from "versionContent/_partials/_prereqs-cloud-only.mdx";
import LivesyncLimitations from "versionContent/_partials/_livesync-limitations.mdx";
import LivesyncConfigureSourceDatabase from "versionContent/_partials/_livesync-configure-source-database.mdx";
import TuneSourceDatabaseAWSRDS from "versionContent/_partials/_livesync-configure-source-database-awsrds.mdx";

## Prerequisites

<PrereqCloud />

- Install the [$PG client tools][install-psql] on your sync machine.

- Ensure that the source $PG instance and the target $SERVICE_LONG have the same extensions installed.

  The $PG connector does not create extensions on the target. If the table uses column types from an extension,
    first create the extension on the target $SERVICE_LONG before syncing the table.

## Limitations

* The source $PG instance must be accessible from the Internet.

  Services hosted behind a firewall or VPC are not supported. This functionality is on the roadmap. 

* Indexes, including the primary key and unique constraints, are not migrated to the target $SERVICE_LONG.

  We recommend that, depending on your query patterns, you create only the necessary indexes on the target $SERVICE_LONG.

<LivesyncLimitations />

## Set your connection string

This variable holds the connection information for the source database. In the terminal on your migration machine, 
set the following:

```bash
export SOURCE="postgres://<user>:<password>@<source host>:<source port>/<db_name>"
```

<Highlight type="important">

Avoid using connection strings that route through connection poolers like PgBouncer or similar tools. This tool 
requires a direct connection to the database to function properly.

</Highlight>


## Tune your source database

<Tabs label="Live migration" persistKey="source-database">

<Tab title="From AWS RDS/Aurora" label="aws-rds">

<Procedure>

<TuneSourceDatabaseAWSRDS />

</Procedure>

</Tab>

<Tab title="From Postgres" label="postgres">
<Procedure>

<LivesyncConfigureSourceDatabase />

</Procedure>

</Tab>
</Tabs>

## Synchronize data to your $SERVICE_LONG

To sync data from your $PG database to your $SERVICE_LONG using $CONSOLE:

<Procedure>

1. **Connect to your $SERVICE_LONG**

   In [$CONSOLE][portal-ops-mode], select the $SERVICE_SHORT to sync live data to. 
1. **Start the connection**
   1. Click `Connectors` > `PostgreSQL`.

1. **Connect the source database and target $SERVICE_SHORT**

   ![Postgres connector wizard](https://assets.timescale.com/docs/images/tiger-cloud-console/pg-livesync-wizard-tiger-cloud.png)

   In `Livesync for Postgres`:
   1. Set the `Livesync Name`.
   1. Connect to your database with the credentials or $PG connection string. This is the connection string for [`<livesync username>`][livesync-tune-source-db]. 
   1. Click `Continue`.
      $CONSOLE connects to the source database and retrieves the schema information.

1. **Optimize the data to synchronize in hypertables**

   ![livesync start](https://assets.timescale.com/docs/images/tiger-cloud-console/pg-livesync-start-tiger-cloud.png)
   1. Select the table to sync and click `+`.
   
      $CONSOLE checks the table schema and, if possible, suggests the column to use as the time dimension in a hypertable. 
   1. Repeat this step for each table you want to sync.
   1. Click `Start Livesync`.
   
      $CONSOLE starts $LIVESYNC between the source database and the target $SERVICE_SHORT and displays the progress.

1. **Monitor syncronization**
   1. To view the progress of the $LIVESYNC, click the name of the $LIVESYNC process:
      ![livesync view status](https://assets.timescale.com/docs/images/tiger-cloud-console/pg-livesync-view-status-tiger-cloud.png)
   1. To pause and restart $LIVESYNC, click the buttons on the right of the $LIVESYNC process and select an action:
      ![livesync start stop](https://assets.timescale.com/docs/images/tiger-cloud-console/pg-livesync-start-stop-tiger-cloud.png)

</Procedure>

And that is it, you are using $LIVESYNC to synchronize all the data, or specific tables, from a $PG database 
instance to your $SERVICE_LONG in real time.

[install-psql]: /integrations/:currentVersion:/psql/
[portal-ops-mode]: https://console.cloud.timescale.com/dashboard/services
[livesync-tune-source-db]: /migrate/:currentVersion:/livesync-for-postgresql/#tune-your-source-database

