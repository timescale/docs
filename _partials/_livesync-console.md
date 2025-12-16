import PrereqCloud from "versionContent/_partials/_prereqs-cloud-only.mdx";
import LivesyncLimitations from "versionContent/_partials/_livesync-limitations.mdx";
import LivesyncConfigureSourceDatabase from "versionContent/_partials/_livesync-configure-source-database.mdx";
import TuneSourceDatabaseAWSRDS from "versionContent/_partials/_livesync-configure-source-database-awsrds.mdx";

## Prerequisites

<PrereqCloud />

- Install the [$PG client tools][install-psql] on your sync machine.

- Ensure that the source $PG instance and the target $SERVICE_LONG have the same extensions installed.

  The $PG_CONNECTOR does not create extensions on the target. If the table uses column types from an extension,
    first create the extension on the target $SERVICE_LONG before syncing the table.

## Limitations

* The source $PG instance must be accessible from the Internet.

  Services hosted behind a firewall or VPC are not supported. This functionality is on the roadmap. 

* Indexes, including the primary key and unique constraints and sequences are not migrated to the target $SERVICE_LONG.

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

<Tabs label="Live migration" persistKey="tune-database">

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

1. **Connect the source database and the target $SERVICE_SHORT**

   ![Postgres connector wizard](https://assets.timescale.com/docs/images/tiger-on-azure/pg-connector-wizard-tiger-console.png)

   1. Click `Connectors` > `PostgreSQL`.
   1. Set the name for the new connector by clicking the pencil icon.
   1. Check the boxes for `Set wal_level to logical` and `Update your credentials`, then click `Continue`.
   1. Enter your database credentials or a $PG connection string, then click `Connect to database`. 
      This is the connection string for [`<pg connector username>`][livesync-tune-source-db]. $CONSOLE connects to the source database and retrieves the schema information.

1. **Optimize the data to synchronize in $HYPERTABLEs**

   ![Postgres connector start](https://assets.timescale.com/docs/images/tiger-on-azure/pg-connector-start-tiger-console.png)

   1. In the `Select table` dropdown, select the tables to sync.
   1. Click `Select tables +` .    

      $CONSOLE checks the table schema and, if possible, suggests the column to use as the time dimension in a $HYPERTABLE.
   1. Click `Create Connector`.
   
      $CONSOLE starts $PG_CONNECTOR between the source database and the target $SERVICE_SHORT and displays the progress.

1. **Monitor synchronization**

   ![Tiger connectors overview](https://assets.timescale.com/docs/images/tiger-on-azure/tiger-console-connector-overview.png)

    1. To view the amount of data replicated, click `Connectors`. The diagram in `Connector data flow` gives you an overview of the connectors you have created, their status, and how much data has been replicated.  

    1. To review the syncing progress for each table, click `Connectors` > `Source connectors`, then select the name of your connector in the table. 

1. **Manage the connector**

   ![Edit a Postgres connector](https://assets.timescale.com/docs/images/tiger-on-azure/edit-pg-connector-tiger-console.png)

   1. To edit the connector, click `Connectors` > `Source connectors`, then select the name of your connector in the table. You can rename the connector, delete or add new tables for syncing.
   
   1. To pause a connector, click `Connectors` > `Source connectors`, then open the three-dot menu on the right and select `Pause`. 

   1. To delete a connector, click `Connectors` > `Source connectors`, then open the three-dot menu on the right and select `Delete`. You must pause the connector before deleting it.

</Procedure>

And that is it, you are using the $PG_CONNECTOR to synchronize all the data, or specific tables, from a $PG database 
instance to your $SERVICE_LONG, in real time.

[install-psql]: /integrations/:currentVersion:/psql/
[portal-ops-mode]: https://console.cloud.timescale.com/dashboard/services
[livesync-tune-source-db]: /migrate/:currentVersion:/livesync-for-postgresql/#tune-your-source-database

