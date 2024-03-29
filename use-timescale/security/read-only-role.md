---
title: Read-only role
excerpt: Create a role to allow read-only access to your database
product: [cloud, mst, self_hosted]
keywords: [client credentials, accounts, users, members, read-only, security]
tags: [authentication, credentials, members, security]
---

# Read-only user

You can create a role that provides read-only access to your database.

<Highlight type="important">
Adding a read-only user role to your database does not provide resource
isolation. If you want to restrict the access of a read-only user, as well as isolate resources, you can create a read replica instead. For more information, see the
[read scaling](/use-timescale/latest/ha-replicas/read-scaling/)
section.
</Highlight>

## Create a read-only user

You can create a read-only user to provide limited access to your database.

<Procedure>

### Creating a read-only user

1.  Connect to your database as the `tsdbadmin` user.

1.  At the psql prompt, create the new role:

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
