---
title: Promscale database roles and permissions
excerpt: Learn about the different database roles and permissions Promscale defines
product: promscale
keywords: [analytics, permissions, roles]
tags: [database]
---

import PromscaleDeprecation from "versionContent/_partials/_deprecated-promscale.mdx";

# Promscale database roles and permissions

<PromscaleDeprecation />

Promscale uses Role Based Access Control (RBAC) to manage permissions for the
database. You can choose to use a single PostgreSQL user for all Promscale
operations, or implement more granular control for permissions management.

Promscale uses these roles:

*   Owner: The owner of the Promscale schema and objects. Defined as the user
    that originally installed or migrated to Promscale. This user must be able
    to install PostgreSQL extensions, so they must be a PostgreSQL superuser.
    Alternatively, you can use [pgextwlist][pgextwlist] to authorize a  regular
    user to install the extensions. The owner should be consistent every time
    you migrate the Promscale schema.
*   prom_reader: This role can read but not modify the data stored by Promscale.
*   prom_writer: This role can read and write new data, but cannot modify or
    delete data. This role also includes all permissions of `prom_reader`.
*   prom_modifier: This role can read, write, and modify all data. This role
    also includes all permissions of `prom_writer`.
*   prom_maintenance: This role can execute maintenance tasks, such as
    compression and data retention jobs. This role is mostly only used
    externally, unless you are using a cron job to `execute_maintenance()`
    instead of the jobs framework. This role also includes all permission of
    `prom_reader`.
*   prom_admin: This role can change the configuration options associated with
    Promscale, including data retention policies, and chunk intervals. This role
    also includes all permissions of `prom_modifier` and `prom_maintenance`.

|Role|Migrate schema|Delete data|Write data|Read data|Execute maintenance tasks|Change configuration options|
|-|-|-|-|-|-|-|
|`owner`|✅|✅|✅|✅|✅|✅|
|`prom_reader`|❌|❌|❌|✅|❌|❌|
|`prom_writer`|❌|❌|✅|✅|❌|❌|
|`prom_modifier`|❌|✅|✅|✅|❌|❌|
|`prom_maintenance`|❌|❌|❌|✅|✅|❌|
|`prom_admin`|❌|✅|✅|✅|✅|✅|

Promscale can be run by the owner, or a user with the `prom_modifier`,
`prom_writer` or `prom_reader` role. A user can be assigned multiple roles.

You can assign roles to users with this SQL command:

```sql
GRANT <role> to <user>
```

For more information, see the
[PostgreSQL docs about permissions](https://www.postgresql.org/docs/current/user-manag.html).

## Example permissions

This section outlines some example permissions environments.

### Single owner

The simplest possible permissions environment is a single owner called `tsdbadmin`, that has permissions to install the Promscale and Timescaledb extensions. To use this environment, start Promscale with this command:

```bash
PGPASSWORD=<password> ./promscale -db-uri=postgres://tsdbadmin@<hostname>:<port>/<databasename>?sslmode=require
```

### Separate owner and modifier users

You can separate the users that are used for normal Promscale operations from
the users that can upgrade the Promscale schema. In this environment, a database
user called `tsdbadmin` has permissions to install the Promscale and Timescaledb extensions and becomes the Promscale owner.

Begin by installing the Promscale schema. Use the `-migrate=only` flag so that the command exits as soon as the schema is installed:

```sql
PGPASSWORD=<password> ./promscale \
-db-uri="postgres://tsdbadmin@<hostname>:<port>/<databasename>?sslmode=require" \
-migrate=only
```

Create a more limited user for use by Promscale with psql:

```sql
PGPASSWORD=<password> psql "postgres://tsdbadmin@<hostname>:<port>/<databasename>?sslmode=require"
```

Create the `promscale_modifier` user:

```sql
CREATE ROLE promscale_modifier_user PASSWORD '<new password>' LOGIN;
GRANT prom_modifier TO promscale_modifier_user;
```

Start promscale with the `promscale_modifier` user:

```sql
PGPASSWORD=<password> ./promscale -db-uri="postgres://promscale_modifier_user@<hostname>:<port>/<databasename>?sslmode=require"  \
-install-extensions=false -migrate=false -upgrade-extensions=false
```

### A non-superuser owner with pgextwlist

The `owner` user of Promscale need to be able to install and upgrade the
Promscale and TimescaleDB PostgreSQL extensions. In most environments, the
`owner` user is a PostgreSQL superuser. However, you can use
[pgextwlist][pgextwlist] to authorize a regular user to install the extensions
instead. Set up the `pgextwlist` extension by adding this to the PostgreSQL
configuration file:

```
local_preload_libraries=pgextwlist
extwlist.extensions=promscale,timescaledb
```

[pgextwlist]: https://github.com/dimitri/pgextwlist
