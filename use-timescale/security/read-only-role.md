---
title: Manage data security in your Tiger Cloud service
excerpt: Learn about the available user roles to access data in your database
products: [cloud]
keywords: [client credentials, accounts, users, members, read-only, security]
tags: [authentication, credentials, members, security]
---

# Manage data security in your $SERVICE_LONG

When you create a $SERVICE_SHORT, $CLOUD_LONG assigns you the tsdmadmin role. This role has full permissions to modify data in your $SERVICE_SHORT. However, $CLOUD_LONG does not provide superuser access. tsdmadmin is not a superuser. 

As tsdmadmin, you can use standard $PG means to create other roles or assign individual permissions. This page shows you how to create a read-only role for your database. Adding a read-only role does not provide resource isolation. To restrict the access of a read-only user, as well as isolate resources, create a [read replica][read-scaling] instead. 

<Highlight type="important">

The database-level roles for the individual $SERVICE_SHORTs in your $PROJECT_SHORT do not overlap with the $PROJECT_LONG user roles. This page describes the database-level roles. For user roles available in $CONSOLE_SHORT, see [Control user access to $PROJECT_LONG][console-rbac].

</Highlight>

## Create a read-only user

You can create a read-only user to provide limited access to your database.

<Procedure>

1.  Connect to your $SERVICE_SHORT as the tsdbadmin user.

1.  Create the new role:

    ```sql
    CREATE ROLE readaccess;
    ```

1.  Grant the appropriate permissions for the role, as required. For example, to
    grant `SELECT` permissions to a specific table, use:

    ```sql
    GRANT SELECT ON <TABLE_NAME> TO readaccess;
    ```

    To grant `SELECT` permissions to all tables in a specific schema, use:

    ```sql
    GRANT SELECT ON ALL TABLES IN SCHEMA <SCHEMA_NAME> TO readaccess;
    ```

1.  Create a new user:

    ```sql
    CREATE USER read_user WITH PASSWORD 'read_password';
    ```

1.  Assign the role to the new user:

    ```sql
    GRANT readaccess TO read_user;
    ```

</Procedure>

[console-rbac]: /use-timescale/:currentVersion:/security/members/
[read-scaling]: /use-timescale/:currentVersion:/ha-replicas/read-scaling/
