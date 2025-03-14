import PrereqCloud from "versionContent/_partials/_prereqs-cloud-only.mdx";
import LivesyncLimitations from "versionContent/_partials/_livesync-limitations.mdx";
import LivesyncConfigureSourceDatabase from "versionContent/_partials/_livesync-configure-source-database.mdx";
import EarlyAccess from "versionContent/_partials/_early_access_2_18_0.mdx";

## Prerequisites

<PrereqCloud />

- Install the [PostgreSQL client tools][install-psql] on your sync machine.

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


![Livesync wizard](https://assets.timescale.com/docs/images/livesync-wizard.png)

<Procedure>

1. **Connect to your $SERVICE_LONG**

   In [$CONSOLE][portal-ops-mode], select the service to sync live data to. 
1. **Start livesync**
   1. Click `Actions` > `See more`. 
   1. In `Import Data`, click `livesync for PostgreSQL`.

1. **Connect the source database and target $SERVICE_SHORT**

   In `livesync for PostgreSQL`:
   1. Set the `Livesync Name`.
   2. Set the` PostgreSQL Connection String` to point to the source database you want to sync to Timescale.

1. **Select the tables to syncronize**

   IAIN: This is far as I could get, the procedure froze for me. 

</Procedure>

[install-psql]: /use-timescale/:currentVersion:/integrations/psql/
[portal-ops-mode]: https://console.cloud.timescale.com/dashboard/services
