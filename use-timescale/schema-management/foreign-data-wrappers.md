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

Cross-channel queries are not supported for security reasons. 

FDWs are particularly useful if you manage multiple PostgreSQL and time-series instances and need seamless access to both standard and time-series data. 

In the following example, you query data from a Timescale service within the same project.

<Procedure>

## Query another Timescale database in the same project 

1. Enable the FDW extension:

    1. In Timescale Console, select the service and toggle the ops mode. 
    1. Navigate to `Operations` > `Extensions` and find `postgres_fdw` in the list. 
    1. Expand the section underneath and either click `Run` to install or copy and run the code in the SQL editor. 

1. Create a foreign data wrapper. Take these steps under the `tsdbadmin` role, which has the required `USAGE` permissions assigned:

    1. Create a server:

       ```sql
       CREATE SERVER myserver FOREIGN DATA WRAPPER postgres_fdw OPTIONS (host 'serviceID.projectID.tsdb.cloud.timescale.com', dbname 'tsdb', port '30702');
       ```

    1. Create user mapping:

       ```sql
       CREATE USER MAPPING FOR tsdbadmin SERVER myserver OPTIONS (user 'tsdbadmin', password 'mysupersecurepassword');


    1. Import a foreign schema (recommended) or create a foreign table:

       

</Procedure>





