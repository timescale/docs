---
title: Livesync from Postgres to Timescale Cloud
excerpt: Synchronize updates to your primary PostgreSQL database with the corresponding Timescale Cloud service in real time
products: [cloud]
keywords: [migration, low-downtime, backup]
tags: [recovery, logical backup, replication]
---

import MigrationPrerequisites from "versionContent/_partials/_migrate_prerequisites.mdx";
import SetupConnectionStrings from "versionContent/_partials/_migrate_live_setup_connection_strings.mdx";

import LivesyncConsole from "versionContent/_partials/_livesync-console.mdx"
import LivesyncTerminal from "versionContent/_partials/_livesync-terminal.mdx"


# Livesync from PostgreSQL to Timescale Cloud

You use Livesync to synchronize all the data, or specific tables, from a PostgreSQL database instance to your 
$SERVICE_LONG in real-time. You run Livesync continuously, turning PostgreSQL into a primary database with your 
$SERVICE_LONG as a logical replica. This enables you to leverage $CLOUD_LONG’s real-time analytics capabilities on 
your replica data.

![livesync view status](https://assets.timescale.com/docs/images/livesync-view-status.png)

Livesync leverages the a well-established PostgreSQL logical replication protocol. By relying on this protocol, 
Livesync ensures compatibility, familiarity, and a broader knowledge base. Making it easier for you to adopt Livesync 
and integrate your data.

Livesync can:
* Copy existing data from a PostgreSQL instance to a $SERVICE_LONG:
  - Copy data at up to 150 GB/hr.
  
    You need at least a 4 CPU/16GB source database, and a 4 CPU/16GB target $SERVICE_SHORT.
  - Copy the publication tables in parallel. 
  
    Large tables are still copied using a single connection. Parallel copying is in the backlog.
  - Forget foreign key relationships. 
  
    Livesync disables foreign key validation during the sync. For example, if a `metrics` table refers to 
    the `id` column on the `tags` table, you can still sync only the `metrics` table without worrying about their 
    foreign key relationships.
  - Track progress. PostgreSQL expose `COPY` progress under in `pg_stat_progress_copy`.
* Synchronize real-time changes from a PostgreSQL instance to a $SERVICE_LONG.
* Add and remove tables on demand using the [PostgreSQL PUBLICATION interface](https://www.postgresql.org/docs/current/sql-createpublication.html).
* Enable features such as [hypertables][about-hypertables], [columnstore][compression], and 
   [continuous aggregates][caggs] on your logical replica.  

<Highlight type="information">

You use Livesync for data synchronization, rather than migration. It is in alpha and is not recommended for
production use.

</Highlight>

If you have an questions or feedback, talk to us in [#livesync in Timescale Community][join-livesync-on-slack].


<Tabs label="Livesync">

<Tab title="Timescale Console">

<LivesyncConsole />

</Tab>
<Tab title="Terminal">

<LivesyncTerminal />

</Tab>
</Tabs>


[create-publication]: https://www.postgresql.org/docs/current/sql-createpublication.html
[alter-publication]: https://www.postgresql.org/docs/current/sql-alterpublication.html
[install-docker]: https://docs.docker.com/engine/install/
[about-hypertables]: /use-timescale/:currentVersion:/hypertables/about-hypertables/
[lives-sync-specify-tables]: /migrate/:currentVersion:/livesync/#specify-the-tables-to-synchronize
[compression]: /use-timescale/:currentVersion:/compression/about-compression
[caggs]: /use-timescale/:currentVersion:/continuous-aggregates/about-continuous-aggregates/
[join-livesync-on-slack]: https://app.slack.com/client/T4GT3N2JK/C086NU9EZ88
