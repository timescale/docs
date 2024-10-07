
<Procedure>

To connect to a service:

1. **Check your service is running correctly**

    In [Timescale Console][services-portal], check that your service is marked as `Running`.

   ![Check service is running](https://assets.timescale.com/docs/images/console-services-view.png)

1. **Connect to your service**

    Use either:  
    - [Data mode][popsql] in Timescale Console:  
      1. In the [data mode][portal-data-mode] in Timescale Console, select a service and enter your password, then click **Connect**.
      
         You find your password in the config file you just downloaded.
      2. Select a query to edit:
         ![Select a query to edit](https://assets.timescale.com/docs/images/data-mode-query-window.png)

    - [SQL editor][run-sqleditor] in Timescale Console:
    
       In the [ops mode][portal-ops-mode] in Timescale Console, select a service, then click **SQL editor**. 
   
      ![Check service is running](https://assets.timescale.com/docs/images/ops-view-sql-editor.png)
   
    - [psql][install-psql] on the command line:
   
      Connect to your service with the value of `Service URL` from the config file you 
        just saved:

        <CodeBlock canCopy={true} showLineNumbers={false} children={`
        psql "postgres://tsdbadmin:<PASSWORD>@<HOST>:<PORT>/tsdb?sslmode=require"
        `} />

   You can now run queries for this service.

Quick recap. You:
- Manage your services in the [ops mode][portal-ops-mode] in Timescale Console:  add read replicas and enable 
  high-availability, configure compression, change parameters, and so on.
- Analyze your data in the [data mode][portal-data-mode] in Timescale Console: write queries with
  autocomplete, save them in folders, share them, create charts/dashboards, and much more.
- Store configuration and security information in your config file.

</Procedure>


[portal-ops-mode]: https://console.cloud.timescale.com/dashboard/services
[portal-data-mode]: https://console.cloud.timescale.com/dashboard/services?popsql
[account-portal]: https://console.cloud.timescale.com/dashboard/account
[services-portal]: https://console.cloud.timescale.com/dashboard/services
[install-psql]: /use-timescale/:currentVersion:/integrations/query-admin/psql/
[popsql]: /getting-started/:currentVersion:/run-queries-from-console/#data-mode
[run-sqleditor]: /getting-started/:currentVersion:/run-queries-from-console/#sql-editor
[install-psql]: /use-timescale/:currentVersion:/integrations/query-admin/psql/
[hypertables]: /use-timescale/:currentVersion:/hypertables/about-hypertables/#hypertable-partitioning
