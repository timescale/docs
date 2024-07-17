1. **Disable connection pooling**
         
   By default, Timescale Cloud services are created without connection pools. If you have 
   added connection pools to your target service:

   1. In [Timescale Console][tsc-portal], select the service you are migrating your data to. 
   1. Select `Operations`, then `Connection pooling`. 
   1. Remove any connection pools. 

1. **Setup the connections for migration**

   By default, Timescale Cloud services allow a maximum of 100 concurrent connections. If you are 
   migrating a lot of data:

   1. In [Timescale Console][tsc-portal], select `Database parameters` and search for `max_connections`.
   2. Hover the mouse over the value column, click the pencil icon, then change the value. 
      
      **IAIN**: some kind of formula to calculate the max connections would help. 
   3. Click outside the row, then click `Apply changes and restart`.
   
   Your service restarts. 
 

[modify-parameters]: /use-timescale/:currentVersion/configuration/customize-configuration/#modify-basic-parameters
[mst-portal]: https://portal.managed.timescale.com/login
[tsc-portal]: https://console.cloud.timescale.com/
[configure-instance-parameters]: /use-timescale/:currentVersion/configuration/customize-configuration/#configure-database-parameters