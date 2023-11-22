---
title: Migrate from RDS to Timescale using live migration
excerpt: Migrate from a PostgreSQL database in AWS RDS to Timescale using live migration
products: [cloud]
keywords: [data migration, postgresql, RDS]
tags: [migrate, AWS, RDS, low-downtime, pg_dump, pgcopydb]
---

import GettingHelp from "versionContent/_partials/_migrate_dual_write_backfill_getting_help.mdx";
import SourceTargetNote from "versionContent/_partials/_migrate_source_target_note.mdx";
import StepOne from "versionContent/_partials/_migrate_dual_write_step1.mdx";
import LiveMigrationRoles from "versionContent/_partials/_migrate_live_migration_rds_roles.mdx";
import DumpDatabaseRoles from "versionContent/_partials/_migrate_dual_write_dump_database_roles.mdx";
import DumpSourceSchema from "versionContent/_partials/_migrate_dump_source_schema.mdx";

# Migrate from AWS RDS to Timescale using live migration with low-downtime
This document provides a step-by-step guide to migrating a database from an AWS
RDS Postgres instance to Timescale using our [Live migration] strategy to achieve
low application downtime (on the order of minutes).

Live migration's replication mechanism is fundamentally based on Postgres' logical
decoding feature. However, for the purpose of this guide, an in-depth understanding
of logical decoding is not necessary. It is important to note that the "Live migration"
strategy is significantly more complicated than a migration using [pg_dump/pg_restore].

<SourceTargetNote />

## Prerequisites
Before you start the migration process, you will need to:
1. Gather information about your RDS instance.
1. Prepare your RDS instance for Live Migration.
1. Prepare an intermediate machine.

### Gather information about your RDS instance
You will need the following information about your Postgres RDS instance:
* Endpoint
* Port
* Master username
* Master password
* VPC
* DB instance parameter group

To gather the required information, navigate to the "Databases" panel and select your
RDS instance.
<img class="main-content__illustration"
 src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-live-migration/TODO.jpeg"
 alt="TODO"/>

Note the **Endpoint**, **Port**, and **VPC** details from the "Connectivity & Security"
tab, and the **Master Username**, and **DB instance parameter group** from the "Configuration"
tab. Remember to use the **Master Password** that was supplied when the Postgres RDS instance
was created.

<img class="main-content__illustration"
 src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-live-migration/TODO.jpeg"
 alt="TODO"/>
<img class="main-content__illustration"
 src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-live-migration/TODO.jpeg"
 alt="TODO"/>

### Prepare your RDS instance for Live Migration
To use your RDS instance as the source database for a Live migration, and to ensure the
replication process runs smoothly, set the following configuration parameters:

| Configuration | Required Values |
|---------------|-----------------|
| wal_level | logical |
| old_snapshot_threshold | -1 |

You can check the value of above configuration parameters
```sh
postgres=> show wal_level;
 wal_level
-----------
 minimal
(1 row)

postgres=> show old_snapshot_threshold;
 old_snapshot_threshold
------------------------
 0
(1 row)
```

If the values returned do not match the ones required (as in this situation), you will
have to adjust them.

<Highlight type="important">
Modifying either of these parameters requires restarting PostgreSQL, which will cause
your database to be briefly unavailable. Ensure that you make the following configuration
changes when you're comfortable with a database restart.
</Highlight>

For users to make modifications, RDS requires the creation of a parameter group with the
desired configuration values.

A "DB parameter group" can be thought of as a set of key-value pairs that serve as the
configuration settings for the database. To find the current DB parameter group that your
RDS instance is using, go to the "Configuration" tab of your RDS service and look for the
value listed under "DB instance parameter group".

<img class="main-content__illustration"
 src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-live-migration/TODO.jpeg"
 alt="TODO"/>

#### Create DB parameter group for configuring replication
Let’s create a DB parameter group that modifies the values for "wal_level" and "old_snapshot_threshold"
fields. We will base this group on the existing "prod-pr-group" so that we can maintain
the other fields as they are while only changing the ones we need.

<Highlight type="important">
If your RDS service is a Multi-AZ DB Cluster deployment, then you will need to use
"DB Cluster Parameter Group" instead of "DB Parameter Group".
</Highlight>

1. Navigate to the "Parameter groups" panel using the sidebar.
<img class="main-content__illustration"
 src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-live-migration/TODO.jpeg"
 alt="TODO"/>

2. Copy the parameter group that is active in your RDS instance.
<Highlight type="important">
If the "DB parameter group" of your RDS instance displays "default.postgres15", you need to create
a new DB parameter group. To do this, select "Create parameter group" and opt for "postgres15" in
the "Parameter group family" field.
</Highlight>
<img class="main-content__illustration"
 src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-live-migration/TODO.jpeg"
 alt="TODO"/>

3. Rename the parameter group, provide a description and click on "Create".
<img class="main-content__illustration"
 src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-live-migration/TODO.jpeg"
 alt="TODO"/>

* You will find the new parameter group in the "Parameter group" panel. Open the newly created
parameter group by clicking on it.
<img class="main-content__illustration"
 src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-live-migration/TODO.jpeg"
 alt="TODO"/>

4. Click on "Edit".
<img class="main-content__illustration"
 src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-live-migration/TODO.jpeg"
 alt="TODO"/>

5. Locate "rds.logical_replication" using the search box and adjust its value from 0 to 1. Next,
locate "old_snapshot_threshold" and set its value to -1. Once you’ve made these changes, remember
to click on "Save Changes".
<img class="main-content__illustration"
 src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-live-migration/TODO.jpeg"
 alt="TODO"/>
<img class="main-content__illustration"
 src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-live-migration/TODO.jpeg"
 alt="TODO"/>

6. Navigate back to your RDS instance and click on "Modify".
<img class="main-content__illustration"
 src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-live-migration/TODO.jpeg"
 alt="TODO"/>

7. Navigate to the "Additional configuration" section and change the "DB parameter group" value
to the new DB parameter group that includes the updated parameter values. After making this
change, click "Continue" located at the bottom of the page.
<img class="main-content__illustration"
 src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-live-migration/TODO.jpeg"
 alt="TODO"/>

8. Once you have verified the new parameter group value, select "Apply immediately" and click
on "Modify DB Instance".
<img class="main-content__illustration"
 src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-live-migration/TODO.jpeg"
 alt="TODO"/>
<Highlight type="important">
Configuring the new parameter group will not cause your database to be restarted. In the next
step you will manually reboot the database.
</Highlight>

9. Your RDS service will be in the "Modifying" state for a short while, after which, you should
see that the parameter group is in the "Pending reboot" state and must be rebooted to be applied.
<img class="main-content__illustration"
 src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-live-migration/TODO.jpeg"
 alt="TODO"/>

10. Manually reboot your service in order to apply the changes. In the "Actions" dropdown, click
"Reboot" and then "Confirm".

11. After your service reboots, ensure that the new "DB parameter group" is applied in your RDS
instance.
<img class="main-content__illustration"
 src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-live-migration/TODO.jpeg"
 alt="TODO"/>

12. Reconnect to your RDS instance and verify the configuration parameter values.
```sh
postgres=> show wal_level;
 wal_level
-----------
 logical
(1 row)

postgres=> show old_snapshot_threshold ;
 old_snapshot_threshold
------------------------
 -1
(1 row)
```

### Prepare an intermediate machine
Live Migration must be executed from a dedicated machine. The live migration tools
connect to the source and target databases, and all data will flow through the
dedicated machine between the source and the target. This instance must be able
to access your RDS service and ideally is in the same region as your Timescale
instance. We will set up an EC2 instance in the same VPC as the RDS service.

#### Create an EC2 instance
1. In the AWS search, type "EC2" and select the "EC2" option under services.
<img class="main-content__illustration"
 src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-live-migration/TODO.jpeg"
 alt="TODO"/>

2. Click on "Launch instance".
<img class="main-content__illustration"
 src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-live-migration/TODO.jpeg"
 alt="TODO"/>

3. Configure your EC2 instance.
* For "Instance type", use 2 CPU and 8 GB memory at least. If your migration
involves a larger database, you should choose accordingly.
<img class="main-content__illustration"
 src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-live-migration/TODO.jpeg"
 alt="TODO"/>

<Highlight type="info">
The procedures outlined in this, as well as subsequent sections, are based on the
assumption that an Ubuntu Amazon Machine Image (AMI) was selected during the setup
of the EC2 instance.
</Highlight>

* For "Key pair", you can choose to use an existing key pair or create a new one.
This will be necessary when connecting to the EC2 instance from your local machine.
* For "Network Settings", select the same VPC that your RDS instance is located in.
Also, modify the "Source Type" of the security group to "My IP" so that your local
machine can connect to the EC2 instance.

<img class="main-content__illustration"
 src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-live-migration/TODO.jpeg"
 alt="TODO"/>

* For "Configure Storage" section, adjust the volume size to match the *1.5x the size of your database*.
If necessary, you should enable encryption on your volume.

<img class="main-content__illustration"
 src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-live-migration/TODO.jpeg"
 alt="TODO"/>

* Review the summary of the instance and click "Launch instance".

### Prepare the EC2 instance
To prepare your EC2 instance for a low-downtime migration:
1. Navigate to your EC2 instance and click on "Connect".
<img class="main-content__illustration"
 src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-live-migration/TODO.jpeg"
 alt="TODO"/>

2. Select the "SSH client" tab.
<img class="main-content__illustration"
 src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-live-migration/TODO.jpeg"
 alt="TODO"/>

3. Connect to your EC2 instance using the "Key pair" you received while creating the EC2 instance.
```sh
chmod 400 <key-pair>.pem
ssh -i "<key-pair>.pem" ubuntu@<EC2 instance's Public IPv4>
```

4. Install PostgreSQL client and pgcopydb.
```sh
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget -qO- https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo tee /etc/apt/trusted.gpg.d/pgdg.asc &>/dev/null
sudo apt update
sudo apt install postgresql-client-15 pgcopydb -y
psql --version && pg_dump --version && pgcopydb --version
# psql (PostgreSQL) 15.5 (Ubuntu 15.5-1.pgdg22.04+1)
# pg_dump (PostgreSQL) 15.5 (Ubuntu 15.5-1.pgdg22.04+1)
# 10:20:32 3037 INFO   Running pgcopydb version 0.13-1.pgdg22.04+1 from "/usr/bin/pgcopydb"
# pgcopydb version 0.13-1.pgdg22.04+1
# compiled with PostgreSQL 15.3 (Ubuntu 15.3-1.pgdg22.04+1) on x86_64-pc-linux-gnu, compiled by gcc (Ubuntu 11.3.0-1ubuntu1~22.04) 11.3.0, 64-bit
# compatible with Postgres 10, 11, 12, 13, 14, and 15
```

5. To allow an EC2 instance to connect to an RDS instance, you need to modify the
security group associated with your RDS instance.
* Note the Private IPv4 address of your EC2 instance.
<img class="main-content__illustration"
 src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-live-migration/TODO.jpeg"
 alt="TODO"/>

* Go to the security group associated with your RDS instance and select "Edit inbound rules".
<img class="main-content__illustration"
 src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-live-migration/TODO.jpeg"
 alt="TODO"/>

* Click "Add rule". In the "Type" field, select "PostgreSQL". For "Source", select
"Custom" and input the Private IPv4 address of your EC2 instance. Add a suitable
description for this rule. Finally, click on "Save rules" to apply the changes.
<img class="main-content__illustration"
 src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-live-migration/TODO.jpeg"
 alt="TODO"/>

6. Verify the connection to the RDS service from your EC2 instance. Please note,
you will be prompted to enter the master password. This should be the same password
that you used when creating your AWS RDS service.
```sh
# psql -h <rds_endpoint> -p <rds_port> -U postgres -c "select 1"
psql -h aws-rds-low-downtime-migration-db.c8tzn206yp6f.us-west-2.rds.amazonaws.com -p 5432 -U postgres -c "select 1"
Password for user postgres:
 ?column?
----------
        1
(1 row)
```

## Performing data migration
The migration process consists of the following steps:
1. Set up a target database instance in Timescale.
1. Prepare the source database for the live migration.
1. Set up a replication slot and snapshot.
1. Migrate roles and schema from source to target.
1. Follow the remaining steps from "Live migration" documentation.

<StepOne />

## 2. Prepare the source database for the live migration
In order to replicate `UPDATE` and `DELETE` operations on tables in the source database,
the tables must have either a primary key or `REPLICA IDENTITY`. Replica identity
assists logical decoding in identifying the rows being modified. It defaults to
using the table's primary key.

If a table doesn't have a primary key, you'll have to manually set the replica identity.
One option is to use a unique, non-partial, non-deferrable index that includes only
columns marked as `NOT NULL`.

```sql
ALTER TABLE {table_name} REPLICA IDENTITY USING INDEX {_index_name};
```

If there's no primary key or viable unique index to use, you will have to set
`REPLICA IDENTITY` to `FULL`. If you are expecting a large number of `UPDATE` or `DELETE`
operations on the table, we do not recommend using `FULL`. For each `UPDATE` or `DELETE`
statement, Postgres will have to read the whole table to find all matching rows, which
will result in significantly slower replication.

```sql
ALTER TABLE {table_name} REPLICA IDENTITY FULL;
```

## 3. Set up a replication slot and snapshot
Once you're sure that the tables which will be affected by `UPDATE` and `DELETE`
queries have `REPLICA IDENTITY` set, you will need to create a replication slot.

Replication slots keep track of transactions (recorded in Write-Ahead Log files)
in the source database that have not been streamed to the target database yet. We
will use `pgcopydb` to create a replication slot in the source database.

```sh
pgcopydb follow \
  --source "$SOURCE" \
  --target "$TARGET" \
  --fail-fast \
  --plugin wal2json
```

This command is going to be active during most of the migration process. You can
run it in the background or use terminal multiplexers like `screen` or `tmux`.

The `follow` command sets up a replication slot in the source database to stream
changes. These changes are held in "intermediate machine" on disk until "apply" is
given. We will discuss about apply command in subsequent steps.

Additionally, `follow` command exports a snapshot ID to `/tmp/pgcopydb/snapshot`.
This ID can be utilized to migrate data that was in the database before the replication
slot was created.

## 4. Migrate roles and schema from source to target
Before the stream of changes can be applied, the schema and data that existed prior
to the creation of the replication slot in the source database must be migrated.
The larger the size of the source database, the more time it takes to perform the
initial migration, and the longer the buffered files need to be stored.

### 4.a Migrate database roles from source database
<LiveMigrationRoles />

### 4.b Dump the database schema from the source database
<DumpSourceSchema />

### 4.c Load the roles and schema into the target database
```sh
psql -X -d "$TARGET" \
  -v ON_ERROR_STOP=1 \
  --echo-errors \
  -f roles.sql \
  -f schema.sql
```

## 5. Follow the remaining steps from Live migration documentation
The remaining steps for migrating data from a RDS Postgres instance to Timescale
with low-downtime are the same as the ones mentioned in "Live migration"
documentation from [Step 5] onwards. You should follow the mentioned steps
to successfully complete the migration process.

[pg_dump/pg_restore]: /migrate/:currentVersion:/playbooks/rds-timescale-pg-dump/
[Live migration]: /migrate/:currentVersion:/live-migration/live-migration-from-postgres/
[Step 5]: /migrate/:currentVersion:/live-migration/live-migration-from-postgres/#5-enable-hypertables