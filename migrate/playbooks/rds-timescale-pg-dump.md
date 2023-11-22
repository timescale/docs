---
title: Migrate from RDS to Timescale using pg_dump
excerpt: Migrate from a PostgreSQL database in AWS RDS to Timescale using pg_dump
products: [cloud]
keywords: [data migration, postgresql, RDS]
tags: [migrate, AWS, RDS, downtime, pg_dump, psql]
---

import GettingHelp from "versionContent/_partials/_migrate_dual_write_backfill_getting_help.mdx";
import SourceTargetNote from "versionContent/_partials/_migrate_source_target_note.mdx";
import StepOne from "versionContent/_partials/_migrate_dual_write_step1.mdx";

# Migrate from AWS RDS to Timescale using pg_dump with downtime
This guide illustrates the process of migrating a Postgres database from an
AWS RDS service to a Timescale instance. We will use Postgres community tools
like `pg_dump` and `pg_restore` to facilitate the migration process.

<Highlight type="important">
Please be aware that this migration process requires a period of downtime for
your production database, the duration of which is subject to the size of your
database. If you want a migration solution from your RDS instance to Timescale
that offers low downtime, please refer the following document: TODO HARKISHEN
</Highlight>

## Prerequisites
Before initiating the migration process, you will require:

1. Details of your AWS RDS instance
2. Intermediate machine

### Details of your AWS RDS instance
You will need the following information about your Postgres RDS instance:

* Endpoint
* Port
* Master username
* Master password
* VPC

To gather the required information, navigate to the "Databases" panel and select your RDS instance.

<img class="main-content__illustration"
 src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-pg_dump/list-of-databases.jpeg"
 alt="List of databases in RDS panel"/>

Record the **Endpoint**, **Port**, and **VPC** details from the "Connectivity & Security" tab, and the
**Master Username** from the "Configuration" tab. Remember to use the **Master Password** that was supplied
when the Postgres RDS instance was created.

<img class="main-content__illustration"
 src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-pg_dump/db-config-1.jpeg"
 alt="Record endpoint, port, VPC details"/>

<img class="main-content__illustration"
 src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-pg_dump/db-config-2.jpeg"
 alt="Record master username"/>

### Intermediate machine
In order to execute `pg_dump` and `pg_restore`, we need an EC2 instance. This
instance should have access to your RDS service. Therefore, we will set up the EC2
machine in the same VPC as the RDS service.

#### Create an EC2 instance

1. In the AWS search, type "EC2" and select the "EC2" option under services.
<img class="main-content__illustration"
 src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-pg_dump/create-ec2-instance.jpeg"
 alt="Create an EC2 instance"/>

2. Click on "Launch instance".
<img class="main-content__illustration"
 src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-pg_dump/prepare-to-launch-ec2.jpeg"
 alt="Start configuring your instance"/>

3. Configure your EC2 instance.
* For "Instance type", use 2 CPU and 8 GB memory at least. If your migration involves
a larger database, you should choose accordingly.
<img class="main-content__illustration"
 src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-pg_dump/configure-ec2-1.jpeg"
 alt="Choose instance type"/>

* For "Key pair", you can choose to use an existing key pair or create a new one.
This will be necessary when connecting to the EC2 instance from your local machine.
* For "Network Settings", select the same VPC that your RDS instance is located in.
Also, modify the "Source Type" of the security group to "My IP" so that your local
machine can connect to the EC2 instance.
<img class="main-content__illustration"
 src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-pg_dump/configure-ec2-2.jpeg"
 alt="Configure network"/>

* For "Configure Storage" section, adjust the volume size to match the size of
your database. If necessary, you should enable encryption on your volume.
<img class="main-content__illustration"
 src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-pg_dump/configure-ec2-3.jpeg"
 alt="Configure storage"/>

* Review the summary of the instance and click "Launch instance".
<img class="main-content__illustration"
 src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-pg_dump/configure-ec2-4.jpeg"
 alt="Review EC2 instance"/>

#### Prepare the EC2 instance

<Highlight type="important">
The procedures outlined in this, as well as subsequent sections, are based on the
assumption that an Ubuntu Amazon Machine Image (AMI) was selected during the
setup of the EC2 instance.
</Highlight>

To prepare your EC2 instance for migration:
1. Navigate to your EC2 instance and click on the "Connect" button.
<img class="main-content__illustration"
 src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-pg_dump/prepare-ec2-instance.jpeg"
 alt="Connect to EC2 instance"/>

2. Select the "SSH client" tab.
<img class="main-content__illustration"
 src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-pg_dump/select-ssh-client.jpeg"
 alt="Use SSH client"/>

3. Connect to your EC2 instance using the "Key pair" downloaded in the previous step.
```sh
chmod 400 <key-pair>.pem
ssh -i "<key-pair>.pem" ubuntu@<EC2 instance's Public IPv4>
```

4. Install PostgreSQL client.
```sh
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget -qO- https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo tee /etc/apt/trusted.gpg.d/pgdg.asc &>/dev/null
sudo apt update
sudo apt install postgresql-client-15 -y # "postgresql-client-16" if your source DB is using PG 16.
psql --version && pg_dump --version
```

5. To allow an EC2 instance to connect to an RDS instance, you need to modify the
security group associated with your RDS instance.
* Note the Private IPv4 address of your EC2 instance.
<img class="main-content__illustration"
 src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-pg_dump/private-ipv4-address.jpeg"
 alt="Note private IPv4 address of your EC2 instance"/>

* Go to the security group associated with your RDS instance and select
"Edit inbound rules".
<img class="main-content__illustration"
 src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-pg_dump/modify-firewall-rules.jpeg"
 alt="Edit inbound rules"/>

* Choose "Add rule". In the "Type" field, select "PostgreSQL". For "Source", select
"Custom" and input the Private IPv4 address of your EC2 instance. Add a
suitable description for this rule. Finally, click on "Save rules" to apply the changes.
<img class="main-content__illustration"
 src="https://assets.timescale.com/docs/images/playbooks/rds-to-ts-pg_dump/add-firewall-rule.jpeg"
 alt="Add a new rule"/>

6. Verify the connection to the RDS service from your EC2 instance. Please note,
you will be prompted to enter the master password. This should be the same password
that you used when creating your AWS RDS service.
```sh
# psql -h <rds_endpoint> -p <rds_port> -U postgres -c "select 1"
psql -h aws-rds-migration-guide-db.csupoydrdg9f.us-east-1.rds.amazonaws.com -p 5432 -U postgres -c "select 1"
Password for user postgres:
 ?column?
----------
        1
(1 row)
```

## Performing data migration

<GettingHelp />

<SourceTargetNote />

The migration process consists of the following steps:
1. Set up a target database instance in Timescale.
2. Migrate roles and schema from source to target.
3. [optional] Enable TimescaleDB Hypertables.
4. Migrate data from source to target.
5. Verify data in target by comparing with source.

<StepOne />

## 2. Migrate roles and schema from source to target
Before starting the migration process, you should ensure that your source database
is not receiving any DML queries. This is important to guarantee a consistent
migration and to ensure that the resulting database accurately reflects your source database.

<Highlight type="important">
This will cause a downtime on applications that depend (write) on the source
database. The duration of downtime depends on the size of the source database.

For a low-downtime migration solution from AWS RDS Postgres service to Timescale,
please refer the following document: TODO Harkishen
</Highlight>

### 2.a Migrate database roles from the source to target
```sh
pg_dumpall -d "$SOURCE" \
  --quote-all-identifiers \
  --roles-only \
  --no-role-passwords \
  --file=roles.sql
```

<Highlight type="important">
Please note that AWS RDS does not permit dumping of roles with passwords, which
is why the above command is executed with the `--no-role-passwords`. However,
when the migration of roles to your Timescale instance is complete, you will
need to manually assign passwords to the necessary roles using the following
command: `ALTER ROLE role_name WITH PASSWORD 'password';`
</Highlight>

Timescale services do not support roles with superuser access. If your SQL dump
includes roles that have such permissions, you'll need to modify the file to be
compliant with the security model.

You can use the following `sed` command to remove unsupported statements and
permissions from your `roles.sql` file:
```sh
sed -i -E \
-e '/CREATE ROLE "postgres";/d' \
-e '/ALTER ROLE "postgres"/d' \
-e '/CREATE ROLE "rds/d' \
-e '/ALTER ROLE "rds/d' \
-e '/TO "rds/d' \
-e '/GRANT "rds/d' \
-e 's/(NO)*SUPERUSER//g' \
-e 's/(NO)*REPLICATION//g' \
-e 's/(NO)*BYPASSRLS//g' \
-e 's/GRANTED BY "[^"]*"//g' \
roles.sql
```

<Highlight type="info">
This command works only with the GNU implementation of `sed` (sometimes referred
to as `gsed`). For the BSD implementation (the default on macOS), you need to add
an extra argument to change the `-i` flag to `-i ''`.

To check the sed version, you can use the command `sed --version`. While the
GNU version explicitly identifies itself as GNU, the BSD version of sed
generally doesn't provide a straightforward `--version` flag and simply outputs
an "illegal option" error.
</Highlight>

A brief explanation of this script is:
* `CREATE ROLE "postgres";` and `ALTER ROLE "postgres"`: These statements are
removed because they require superuser access, which is not supported by Timescale.
* `CREATE ROLE "rds`, `ALTER ROLE “rds`, `TO "rds`, `GRANT "rds`: Any creation
or alteration of rds prefixed roles are removed because of their lack of any use
in a Timescale instance. Similarly, any grants to or from "rds" prefixed roles
are ignored as well.
* `(NO)SUPERUSER`, `(NO)REPLICATION`, `(NO)BYPASSRLS`: Assigning these permissions
to a role is an action that requires superuser privileges.
* `GRANTED BY` role_specification: The GRANTED BY clause can also have permissions
that require superuser access and should therefore be removed. Note: As per the
TimescaleDB documentation, the GRANTOR in the GRANTED BY clause must be the
current user, and this clause mainly serves the purpose of SQL compatibility.
Therefore, it's safe to remove it.

### 2.b Dump the database schema from the source database
```sh
pg_dump -d "$SOURCE" \
  --format=plain \
  --quote-all-identifiers \
  --no-tablespaces \
  --no-owner \
  --no-privileges \
  --schema-only \
  --file=schema.sql
```
* `--schema-only` is used to dump only the object definitions (schema), not data.
* `--no-tablespaces` is required because Timescale does not support tablespaces
other than the default. This is a known limitation.
* `--no-owner` is required because Timescale's tsdbadmin user is not a superuser
and cannot assign ownership in all cases. This flag means that everything is owned
by the user used to connect to the target, regardless of ownership in the source.
This is a known limitation.
* `--no-privileges` is required because Timescale's tsdbadmin user is not a
superuser and cannot assign privileges in all cases. This flag means that
privileges assigned to other users must be reassigned in the target database as a
manual clean-up task. This is a known limitation.

#### 2.c Load the roles and schema into the target database
```sh
psql -X -d "$TARGET" \
  -v ON_ERROR_STOP=1 \
  --echo-errors \
  -f roles.sql \
  -f schema.sql
```

### 3. [Optional] Enable TimescaleDB Hypertables
Before restoring data from your source database, you might consider converting
standard Postgres tables into TimescaleDB Hypertables. This stage of the migration
process presents an optimal opportunity for such a conversion. Essentially, you’ll
want to transform Postgres tables that contains time series data. For each table
that you plan to convert into a Hypertable in the target database, execute the
following command:

```sh
psql -X -d "$TARGET" \
  -v ON_ERROR_STOP=1 \
  -c "SELECT create_hypertable('<table name>', '<time column name>')"
```

A more detailed explanation can be found in the [hypertable documentation][hypertable-docs].
Once the table is converted, you can follow the guides to enable more Timescale
features like [retention] and [compression].

<Highlight type="important">
This step is optional, but we strongly recommend that you perform it now.

While it is possible to convert a table to a Hypertable after the migration is
complete, this requires effectively rewriting all data in the table, which locks
the table for the duration of the operation and prevents writes.
</Highlight>

## 4. Migrate data from source to target database
### 4.a Dump data from source database
Using pg_dump, dump the data from source database into intermediate storage
```sh
pg_dump -d "$SOURCE" \
  --format=plain \
  --quote-all-identifiers \
  --no-tablespaces \
  --no-owner \
  --no-privileges \
  --data-only \
  --file=dump.sql
```

### 4.b Restore data to target database
Restore the dump file to Timescale instance
```sh
psql -d $TARGET -v ON_ERROR_STOP=1 --echo-errors \
    -f dump.sql
```
Update the table statistics by running ANALYZE on all data
```sh
psql -d $TARGET -c "ANALYZE;"
```

## 5. Verify data in the target database
Verify that the data has been successfully restored by connecting to the target
database and querying the restored data.

Once you have verified that the data is present, and returns the results that you
expect, you can reconfigure your applications to use the target database.

[hypertable-docs]: https://docs.timescale.com/use-timescale/latest/hypertables/
[retention]: https://docs.timescale.com/use-timescale/latest/data-retention/
[compression]: https://docs.timescale.com/use-timescale/latest/compression/