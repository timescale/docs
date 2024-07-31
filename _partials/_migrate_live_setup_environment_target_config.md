1. **Disable connection pooling**
         
   By default, Timescale Cloud services are created without connection pools. Ensure 
   that connection pooling is disabled for your source database. 

1. **Setup the connections for migration**

   By default, Timescale Cloud services allow a maximum of 100 concurrent connections. If you are 
   migrating a lot of data:

   1. In [Timescale Console][tsc-portal], select `Database parameters` and search for `max_connections`.
   2. Hover the mouse over the value column, click the pencil icon, then change the value. 

      By default, for each table, Live-migration consumes 10 connections to the source database and 20 
      connections to your target Timescale Cloud service. 

      - Source: `2` + (value of `--table-jobs`). The default value is `10`
      - Target: `4` + (`2` * (value of `--table-jobs`)) + (value of `--index-jobs`). The default value is `20`. 
      
      Either update `max_connections` to handle at least `20 * <number of tables to migrate>` or set the 
      `--table-jobs` and `--index-jobs` flags to reduce the number of connection when you  
      [run the migrate command](#migrate-your-data-then-start-downtime). 

   3. Click outside the row, then click `Apply changes and restart`.
   
   Your service restarts. 
 

[modify-parameters]: /use-timescale/:currentVersion/configuration/customize-configuration/#modify-basic-parameters
[mst-portal]: https://portal.managed.timescale.com/login
[tsc-portal]: https://console.cloud.timescale.com/
[configure-instance-parameters]: /use-timescale/:currentVersion/configuration/customize-configuration/#configure-database-parameters