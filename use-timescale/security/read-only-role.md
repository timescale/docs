---
title: Role-based access to your data
excerpt: Learn about the available user roles to access data in your database
products: [cloud]
keywords: [client credentials, accounts, users, members, read-only, security]
tags: [authentication, credentials, members, security]
---

# Role-based access to your data

When you create a $SERVICE_SHORT, $CLOUD_LONG assigns you the `tsdmadmin` role. This role has the full scope of permissions to modify data in your $SERVICE_SHORT, but it is not a superuser. $CLOUD_LONG does not provide superuser access. 

As `tsdmadmin`, you can use standard $PG means to create other roles or assign individual permissions. This page explains how to create a read-only role for your database. Note that adding a read-only role does not provide resource isolation. If you want to restrict the access of a read-only user, as well as isolate resources, you can create a read replica instead. For more information, see [Read scaling][read-scaling].

<Highlight type="important">

The user roles for managing data in the underlying database and administering $SERVICE_SHORTs in $CONSOLE_LONG do not overlap. This page describes the user roles on the database level. For user roles available in $CONSOLE_SHORT, see [Role-based access to Tiger Cloud projects][console-rbac].

</Highlight>

## Create a read-only user

You can create a read-only user to provide limited access to your database.

<Procedure>

1.  Connect to your $SERVICE_SHORT as the `tsdbadmin` user.

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
