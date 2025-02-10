---
title: Foreign data wrappers
excerpt: Query PostgreSQL databases within or outside Timescale
products: [cloud, mst, self_hosted]
keywords: [hypertables, schemas, alter]
tags: [change]
---

# Foreign data wrappers

You use foreign data wrappers (FDWs) to query external data sources from a $SERVICE_LONG. These external data sources can be one of the following:

- $SERVICE_LONGs
- PostgreSQL databases outside of $CLOUD_LONG

If you are using $VPC peering, you can create FDWs in your Customer VPC to query a $SERVICE_SHORT in your $CLOUD_LONG project. However, you can't create FDWs in your $SERVICE_LONGs to query a data source in your Customer VPC. This is because $CLOUD_LONG $VPC peering uses AWS PrivateLink for increased security. See [VPC peering documentation][vpc-peering] for additional details.

FDWs are particularly useful if you manage multiple $SERVICE_LONGs with different capabilities, and need to seamlessly access and merge regular and time-series data.

## Query another data source

You create FDWs with the `postgres_fdw` extension, which is enabled by default. 

<Procedure>

To query another data source, run the following queries in the [SQL editor][sql-editor]:

1. **Create a server:**

   ```sql
   CREATE SERVER myserver 
   FOREIGN DATA WRAPPER postgres_fdw 
   OPTIONS (host 'serviceID.projectID.tsdb.cloud.timescale.com', dbname 'tsdb', port '30702');
   ```

1. **Create user mapping:**

   ```sql
   CREATE USER MAPPING FOR tsdbadmin 
   SERVER myserver 
   OPTIONS (user 'tsdbadmin', password 'mysupersecurepassword');
   ```

1. **Import a foreign schema (recommended) or create a foreign table:**

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


A user with the `tsdbadmin` role assigned already has the required `USAGE` permission to create FDWs. You can enable another user, without the `tsdbadmin` role assigned, to query foreign data. To do so, explicitly grant the permission: 

```sql
CREATE USER grafana;
       
GRANT grafana TO tsdbadmin;

CREATE SCHEMA fdw AUTHORIZATION grafana;

CREATE SERVER db1 FOREIGN DATA WRAPPER postgres_fdw 
OPTIONS (host 'serviceID.projectID.tsdb.cloud.timescale.com', dbname 'tsdb', port '30702');

CREATE USER MAPPING FOR grafana SERVER db1 
OPTIONS (user 'tsdbadmin', password 'mysupersecurepassword');

GRANT USAGE ON FOREIGN SERVER db1 TO grafana;

SET ROLE grafana;

IMPORT FOREIGN SCHEMA public 
       FROM SERVER db1 
       INTO fdw;
```

[vpc-peering]: /use-timescale/:currentVersion:/security/vpc/
[sql-editor]: /getting-started/:currentVersion:/run-queries-from-console/#ops-mode-sql-editor/




