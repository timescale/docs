---
title: Foreign data wrappers
excerpt: Query PostgreSQL databases within or outside Timescale
products: [cloud, mst, self_hosted]
keywords: [hypertables, schemas, alter]
tags: [change]
---

# Foreign data wrappers

You use foreign data wrappers (FDWs) to query external data sources from a Timescale Cloud service. These data sources can be one of the following:

- Other Timescale Cloud services.
- PostgreSQL databases outside of Timescale Cloud.

If you are using [VPC peering][vpc-peering], you can create FDWs in your Customer VPC for a service in Timescale VPC or the same project. However, you can't create FDWs from Timescale VPC to Customer VPC.

FDWs are particularly useful if you manage multiple different Timescale Cloud service types, and need to seamlessly access and merge regular and time-series data.

<Procedure>

## Query another Timescale Cloud service 

You create FDWs with the help of the `postgres_fdw` extension, which is enabled by default. To query another service, run the following queries in the [SQL editor][sql-editor]:

1. Create a server:

   ```sql
   CREATE SERVER <server-name> FOREIGN DATA WRAPPER postgres_fdw OPTIONS (host '<service-ID>.<project-id>.tsdb.cloud.timescale.com', dbname '<database-name>', port '<port-number>');
   ```

1. Create user mapping:

   ```sql
   CREATE USER MAPPING FOR <tsdbadmin> SERVER <server-name> OPTIONS (user '<tsdbadmin>', password '<tsdbadmin-password>');
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


A user with the `tsdbadmin` role assigned already has the required `USAGE` permission to create FDWs. You can enable another user, without the `tsdbadmin` role assigned, to query foreign data. To do so, explicitly grant the permission: 

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

[vpc-peering]: /use-timescale/:currentVersion:/vpc/
[sql-editor]: /getting-started/:currentVersion:/run-queries-from-console/#ops-mode-sql-editor/




