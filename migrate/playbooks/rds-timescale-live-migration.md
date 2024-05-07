---
title: Migrate from AWS RDS to Timescale using live migration
excerpt: Migrate from a PostgreSQL database in AWS RDS to Timescale using live migration
products: [cloud]
keywords: [data migration, postgresql, RDS]
tags: [migrate, AWS, RDS, low-downtime, pg_dump, pgcopydb]
---

import GettingHelp from "versionContent/_partials/_migrate_dual_write_backfill_getting_help.mdx";
import SourceTargetNote from "versionContent/_partials/_migrate_source_target_note.mdx";
import StepOne from "versionContent/_partials/_migrate_dual_write_step1.mdx";
import LiveMigrationRoles from "versionContent/_partials/_migrate_live_migration_rds_roles.mdx";
import DumpPreDataSourceSchema from "versionContent/_partials/_migrate_pre_data_dump_source_schema.mdx";

# Migrate from AWS RDS to Timescale using live migration with low-downtime
This document provides a step-by-step guide to migrating a database from an AWS
RDS Postgres instance to Timescale using our [live migration] strategy to achieve
low application downtime (on the order of minutes).

Live migration's replication mechanism is fundamentally based on Postgres' logical
decoding feature. However, for the purpose of this guide, an in-depth understanding
of logical decoding is not necessary.

<SourceTargetNote />

## Prerequisites
Before you start the migration process, you will need to:
1. Gather information about your RDS instance.
1. Prepare your RDS instance for Live migration.
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
 src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-live-migration/list-of-databases.jpeg"
 alt="RDS instances"/>

Note the **Endpoint**, **Port**, and **VPC** details from the "Connectivity & Security"
tab, and the **Master Username**, and **DB instance parameter group** from the "Configuration"
tab. Remember to use the **Master Password** that was supplied when the Postgres RDS instance
was created.

<img class="main-content__illustration"
 src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-live-migration/connectivity-details.jpeg"
 alt="Record endpoint, port, VPC details"/>
<img class="main-content__illustration"
 src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-live-migration/db-configuration-details.jpeg"
 alt="Record master username and DB parameter group"/>

### Prepare your RDS instance for Live migration
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
 src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-live-migration/know-db-parameter.jpeg"
 alt="Know your DB parameter group"/>

#### Create DB parameter group for configuring replication
Let’s create a DB parameter group that modifies the values for "wal_level" and "old_snapshot_threshold"
fields. We will base this group on the existing "prod-pr-group" so that we can maintain
the other fields as they are while only changing the ones we need.

<Highlight type="important">
If your AWS RDS service is a Multi-AZ DB Cluster deployment, then you will need to use
"DB Cluster Parameter Group" instead of "DB Parameter Group".
</Highlight>

1. Navigate to the "Parameter groups" panel using the sidebar.
<img class="main-content__illustration"
 src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-live-migration/create-pg-1.jpeg"
 alt="Navigate to parameter group panel"/>

2. Copy the parameter group that is active in your RDS instance.
<Highlight type="important">
If the "DB parameter group" of your RDS instance displays "default.postgres15", you need to create
a new DB parameter group. To do this, select "Create parameter group" and opt for "postgres15" in
the "Parameter group family" field.
</Highlight>
<img class="main-content__illustration"
 src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-live-migration/create-pg-2.jpeg"
 alt="Copy your existing parameter group"/>

3. Rename the parameter group, provide a description and click on "Create".
<img class="main-content__illustration"
 src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-live-migration/create-pg-3.jpg"
 alt="Rename the new parameter group"/>

* You will find the new parameter group in the "Parameter group" panel. Open the newly created
parameter group by clicking on it.
<img class="main-content__illustration"
 src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-live-migration/create-pg-4.jpeg"
 alt="Open the new parameter group"/>

4. Click on "Edit".
<img class="main-content__illustration"
 src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-live-migration/create-pg-5.jpeg"
 alt="Edit the new parameter group"/>

5. Locate "rds.logical_replication" using the search box and adjust its value from 0 to 1. Next,
locate "old_snapshot_threshold" and set its value to -1. Once you’ve made these changes, remember
to click on "Save Changes".
<img class="main-content__illustration"
 src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-live-migration/create-pg-6.jpeg"
 alt="Modify rds.logical_replication field"/>
<img class="main-content__illustration"
 src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-live-migration/create-pg-7.jpeg"
 alt="Modify old_snapshot_threshold field"/>

6. Navigate back to your RDS instance and click on "Modify".
<img class="main-content__illustration"
 src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-live-migration/create-pg-8.jpeg"
 alt="Navigate back to your RDS instance"/>

7. Navigate to the "Additional configuration" section and change the "DB parameter group" value
to the new DB parameter group that includes the updated parameter values. After making this
change, click "Continue" located at the bottom of the page.
<img class="main-content__illustration"
 src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-live-migration/create-pg-9.jpg"
 alt="Modify DB parameter group"/>

8. Once you have verified the new parameter group value, select "Apply immediately" and click
on "Modify DB Instance".
<img class="main-content__illustration"
 src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-live-migration/create-pg-10.jpg"
 alt="Apply DB parameter group"/>
<Highlight type="important">
Configuring the new parameter group will not cause your database to be restarted. In the next
step you will manually reboot the database.
</Highlight>

9. Your RDS service will be in the "Modifying" state for a short while, after which, you should
see that the parameter group is in the "Pending reboot" state and must be rebooted to be applied.
<img class="main-content__illustration"
 src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-live-migration/create-pg-11.jpg"
 alt=""/>

10. Manually reboot your service in order to apply the changes. In the "Actions" dropdown, click
"Reboot" and then "Confirm".

11. After your service reboots, ensure that the new "DB parameter group" is applied in your RDS
instance.
<img class="main-content__illustration"
 src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-live-migration/create-pg-12.jpeg"
 alt="Ensure the new DB parameter group on your RDS instance"/>

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
 src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-live-migration/search-ec2.jpg"
 alt="Search for EC2 services"/>

2. Click on "Launch instance".
<img class="main-content__illustration"
 src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-live-migration/launch-ec2-instance.jpg"
 alt="Launch EC2 instance"/>

3. Configure your EC2 instance.

  a. For "Application and OS image", choose Ubuntu Server LTS.

  b. For "Instance type", use 2 CPU and 8 GB memory at least. If your migration involves a larger database, you should choose accordingly.
  <img class="main-content__illustration"
    src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-live-migration/config-instance-type.jpg"
    alt="Configure instance type"/>

  c. For "Key pair", you can choose to use an existing key pair or create a new one. This will be necessary when connecting to the EC2 instance from your local machine.

  d. For "Network Settings", select the same VPC that your RDS instance is located in. Also, modify the "Source Type" of the security group to "My IP" so that your local machine can connect to the EC2 instance.
  <img class="main-content__illustration"
    src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-live-migration/config-network.jpg"
    alt="Configure network"/>

  e. For "Configure Storage" section, adjust the volume size to match the *1.5x the size of your database*. If necessary, you should enable encryption on your volume.
  <img class="main-content__illustration"
    src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-live-migration/config-storage.jpg"
    alt="Configure storage"/>

4. Review the summary of the instance and click "Launch instance".
<img class="main-content__illustration"
 src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-pg_dump/configure-ec2-4.jpeg"
 alt="Review EC2 instance"/>

### Prepare the EC2 instance
To prepare your EC2 instance for a low-downtime migration:
1. Navigate to your EC2 instance and click on "Connect".
<img class="main-content__illustration"
 src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-live-migration/navigate-to-ec2-instance.jpg"
 alt="Navigate to your EC2 instance"/>

2. Select the "SSH client" tab.
<img class="main-content__illustration"
 src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-live-migration/connect-ssh.jpg"
 alt="Connect to your EC2 using SSH client"/>

3. Connect to your EC2 instance using the "Key pair" you received while creating the EC2 instance.
```sh
chmod 400 <key-pair>.pem
ssh -i "<key-pair>.pem" ubuntu@<EC2 instance's Public IPv4>
```

4. To allow an EC2 instance to connect to an RDS instance, you need to modify the
security group associated with your RDS instance.

  a. Note the Private IPv4 address of your EC2 instance.
  <img class="main-content__illustration"
    src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-live-migration/note-private-ipv4.jpg"
    alt="Note the private IPv4 address"/>

  b. Go to the security group associated with your RDS instance and select "Edit inbound rules".
  <img class="main-content__illustration"
    src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-live-migration/edit-security-group.jpg"
    alt="Edit the security group"/>

  c. Click "Add rule". In the "Type" field, select "PostgreSQL". For "Source", select
  "Custom" and input the Private IPv4 address of your EC2 instance. Add a suitable
  description for this rule. Finally, click on "Save rules" to apply the changes.
  <img class="main-content__illustration"
    src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-live-migration/add-new-rule.jpg"
    alt="Add new rule"/>

5. Verify the connection to the RDS service from your EC2 instance. Please note,
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

<GettingHelp />

## Perform "live migration"
The remaining steps for migrating data from a RDS Postgres instance to Timescale
with low-downtime are the same as the ones mentioned in "Live migration"
documentation from [Step 1] onwards. You should follow the mentioned steps
to successfully complete the migration process.

[live migration]: /migrate/:currentVersion:/live-migration/live-migration-from-postgres/
[Step 1]: /migrate/:currentVersion:/live-migration/live-migration-from-postgres/#1-set-up-a-target-database-instance-in-timescale
