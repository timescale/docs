import IntegrationPrereqs from "versionContent/partials/_integration-prereqs.mdx";

You use PostgreSQL foreign data wrappers (FDWs) to query external data sources from a $SERVICE_LONG. These external data sources can be one of the following:

- Other $SERVICE_LONGs
- PostgreSQL databases outside of $CLOUD_LONG

If you are using $VPC peering, you can create FDWs in your Customer VPC to query a $SERVICE_SHORT in your $CLOUD_LONG project. However, you can't create FDWs in your $SERVICE_LONGs to query a data source in your Customer VPC. This is because $CLOUD_LONG $VPC peering uses AWS PrivateLink for increased security. See [VPC peering documentation][vpc-peering] for additional details.

PostgreSQL FDWs are particularly useful if you manage multiple $SERVICE_LONGs with different capabilities, and need to seamlessly access and merge regular and time-series data.

## Prerequisites

<IntegrationPrereqs />

## Query another data source

To query another data source: 

<Tabs label="Query another data source">

<Tab title="Timescale Cloud">

You create PostgreSQL FDWs with the `postgres_fdw` extension, which is enabled by default in $CLOUD_LONG.

<Procedure>

1. **Connect to your service**

   See [how to connect][connect].

1. **Create a server**

   Run the following command using your [connection details][connection-info]:

   ```sql
   CREATE SERVER myserver 
   FOREIGN DATA WRAPPER postgres_fdw 
   OPTIONS (host '<host>', dbname 'tsdb', port '<port>');
   ```

1. **Create user mapping**

   Run the following command using your [connection details][connection-info]:

   ```sql
   CREATE USER MAPPING FOR tsdbadmin 
   SERVER myserver 
   OPTIONS (user 'tsdbadmin', password '<password>');
   ```

1. **Import a foreign schema (recommended) or create a foreign table**

    - Import the whole schema:

      ```sql
      CREATE SCHEMA foreign_stuff;
      
      IMPORT FOREIGN SCHEMA public 
      FROM SERVER myserver 
      INTO foreign_stuff ;
      ```

    - Alternatively, import a limited number of tables:

      ```sql
      CREATE SCHEMA foreign_stuff;
      
      IMPORT FOREIGN SCHEMA public 
      LIMIT TO (table1, table2) 
      FROM SERVER myserver 
      INTO foreign_stuff;
      ```

    - Create a foreign table. Skip if you are importing a schema:

      ```sql
      CREATE FOREIGN TABLE films (
          code        char(5) NOT NULL,
          title       varchar(40) NOT NULL,
          did         integer NOT NULL,
          date_prod   date,
          kind        varchar(10),
          len         interval hour to minute
      )
      SERVER film_server;
      ```

</Procedure>


A user with the `tsdbadmin` role assigned already has the required `USAGE` permission to create PostgreSQL FDWs. You can enable another user, without the `tsdbadmin` role assigned, to query foreign data. To do so, explicitly grant the permission. For example, for a new `grafana` user:

```sql
CREATE USER grafana;
       
GRANT grafana TO tsdbadmin;

CREATE SCHEMA fdw AUTHORIZATION grafana;

CREATE SERVER db1 FOREIGN DATA WRAPPER postgres_fdw 
OPTIONS (host '<host>', dbname 'tsdb', port '<port>');

CREATE USER MAPPING FOR grafana SERVER db1 
OPTIONS (user 'tsdbadmin', password '<password>');

GRANT USAGE ON FOREIGN SERVER db1 TO grafana;

SET ROLE grafana;

IMPORT FOREIGN SCHEMA public 
       FROM SERVER db1 
       INTO fdw;
```

</Tab>

<Tab title="Self-hosted TimescaleDB">

You create PostgreSQL FDWs with the `postgres_fdw` extension. See [documenation][enable-fdw-docs] on how to enable it. 

<Procedure>

1. **Connect to your database**

   Use [`psql`][psql] to connect to your database. 

1. **Create a server**

   Run the following command using your [connection details][connection-info]:

   ```sql
   CREATE SERVER myserver 
   FOREIGN DATA WRAPPER postgres_fdw 
   OPTIONS (host '<host>', dbname '<database_name>', port '<port>');
   ```

1. **Create user mapping**

   Run the following command using your [connection details][connection-info]:

   ```sql
   CREATE USER MAPPING FOR postgres 
   SERVER myserver 
   OPTIONS (user 'postgres', password '<password>');
   ```

1. **Import a foreign schema (recommended) or create a foreign table**

   - Import the whole schema:

     ```sql
     CREATE SCHEMA foreign_stuff;
     
     IMPORT FOREIGN SCHEMA public 
     FROM SERVER myserver 
     INTO foreign_stuff ;
     ```

   - Alternatively, import a limited number of tables:

     ```sql
     CREATE SCHEMA foreign_stuff;
     
     IMPORT FOREIGN SCHEMA public 
     LIMIT TO (table1, table2) 
     FROM SERVER myserver 
     INTO foreign_stuff;
     ```

   - Create a foreign table. Skip if you are importing a schema:

     ```sql
     CREATE FOREIGN TABLE films (
         code        char(5) NOT NULL,
         title       varchar(40) NOT NULL,
         did         integer NOT NULL,
         date_prod   date,
         kind        varchar(10),
         len         interval hour to minute
     )
     SERVER film_server;
     ```

</Procedure>

</Tab>

</Tabs>

[vpc-peering]: /use-timescale/:currentVersion:/security/vpc/
[sql-editor]: /getting-started/:currentVersion:/run-queries-from-console/#ops-mode-sql-editor/
[connect]: /getting-started/:currentVersion:/run-queries-from-console/
[connection-info]: /integrations/:currentVersion:/find-connection-details/
[enable-fdw-docs]: https://www.postgresql.org/docs/current/postgres-fdw.html
[psql]: /integrations/:currentVersion:/psql/
