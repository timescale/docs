---
title: Foreign data wrappers
excerpt: Query PostgreSQL databases within or outside Timescale
products: [cloud, mst, self_hosted]
keywords: [hypertables, schemas, alter]
tags: [change]
---

# Foreign data wrappers

You use foreign data wrappers (FDWs) to query other PostgreSQL databases in a direct, secure, and efficient manner. 

These other databases can be located:

- Within the same Timescale project.
- Outside of Timescale completely.

Cross-project queries are not supported for security reasons. If using VPC, only services within your VPC can connect.

FDWs are particularly useful if you manage multiple PostgreSQL and time-series instances and need seamless access to both standard and time-series data.

<Procedure>

## Query another Timescale database 

To query another Timescale database in the same project, take the following steps:

1. Enable the FDW extension:

    1. In Timescale Console, select the service and enter the ops mode. 
    1. Navigate to `Operations` > `Extensions` and find `postgres_fdw` in the list. 
    1. Expand the section underneath and either click `Run` to install, or copy and run the code in the SQL editor. 

1. Create a foreign data wrapper. 

   A user with the `tsdbadmin` role assigned already has the required `USAGE` permission to create FDWs.

    1. Create a server:

       ```sql
       CREATE SERVER <server-name> FOREIGN DATA WRAPPER postgres_fdw OPTIONS (host '<service-ID>.<project-id>.tsdb.cloud.timescale.com', dbname '<database-name>', port '<port-number>');
       ```

    1. Create user mapping:

       ```sql
       CREATE USER MAPPING FOR <tsdbadmin-user-name> SERVER <server-name> OPTIONS (user '<tsdbadmin-user-name>', password '<tsdbadmin-user-password>');
       ```

    1. Import a foreign schema (recommended) or create a foreign table:

        - Import the whole schema:

          ```sql
          CREATE SCHEMA <schema-name>;
          IMPORT FOREIGN SCHEMA <foreign-schema-name> FROM SERVER <server-name> INTO <schema-name>;
          ```
          
        - Alternatively, import a limited number of tables: 

          ```sql
          CREATE SCHEMA <schema-name>;
          IMPORT FOREIGN SCHEMA <foreign-schema-name> LIMIT TO (table1, table2) FROM SERVER <server-name> INTO <schema-name>;
          ```

        - Create a foreign table: 

          ```sql
          CREATE FOREIGN TABLE <table-name> (
          code        char(5) NOT NULL,
          title       varchar(40) NOT NULL,
          did         integer NOT NULL,
          date_prod   date,
          kind        varchar(10),
          len         interval hour to minute
          )
          SERVER <server-name>;
          ```

</Procedure>

You can enable another user, without the `tsdbadmin` role assigned, to query foreign data. To do so, explicitly grant the permission: 

```sql
CREATE USER <user-name>;
GRANT <user-name> TO tsdbadmin;
CREATE SCHEMA <schema-name> AUTHORIZATION <user-name>;
CREATE SERVER <server-name> FOREIGN DATA WRAPPER postgres_fdw OPTIONS (host '<service-ID>.<project-id>.tsdb.cloud.timescale.com', dbname '<database-name>', port '<port-number>');
CREATE USER MAPPING FOR <user-name> SERVER <server-name> OPTIONS (user '<user-name>', password '<user-password>');
GRANT USAGE ON FOREIGN SERVER <server-name> TO <user-name>;

SET ROLE <user-name>;
IMPORT FOREIGN SCHEMA <foreign-schema-name> FROM SERVER <server-name> INTO <schema-name>;
```







