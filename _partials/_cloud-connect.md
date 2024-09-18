
<Procedure>

To connect to a service:

1. **Check your service is running correctly**

    In [Timescale Console][services-portal], check that your service is marked as `Running`.

   ![Check service is running](https://assets.timescale.com/docs/images/console-services-view.png)

1. **Connect to your service**

    Use either:  
    - [Data][popsql] in Timescale Console:  
      1. In [`Data` in Timescale Console][portal-data-mode], select a service and enter your password, then click `Connect`.
      
         You find your password in the config file you just downloaded.
      2. Select a query to edit:
         ![Select a query to edit](https://assets.timescale.com/docs/images/data-mode-query-window.png)

    - [SQL editor][run-sqleditor] in Timescale Console:
    
       In [`Ops` in Timescale Console][portal-ops-mode], select a service, then click `SQL editor`. 
   
      ![Check service is running](https://assets.timescale.com/docs/images/ops-view-sql-editor.png)
   
    - [psql][install-psql] on the command line:
   
      Connect to your service with the value of `Service URL` from the config file you 
        just saved:

        <CodeBlock canCopy={true} showLineNumbers={false} children={`
        psql "postgres://tsdbadmin:<PASSWORD>@<HOST>:<PORT>/tsdb?sslmode=require"
        `} />

   You can now run queries for this service.  


Quick recap. You:
- Manage your services in the [`Ops` in Timescale Console][portal-ops-mode]
- Manage your data in [`Data` in Timescale Console][portal-data-mode]
- Store configuration and security information in your config file.

</Procedure>


[portal-ops-mode]: https://console.cloud.timescale.com/dashboard/services
[portal-data-mode]: https://console.cloud.timescale.com/dashboard/services?popsql
[account-portal]: https://console.cloud.timescale.com/dashboard/account
[services-portal]: https://console.cloud.timescale.com/dashboard/services
[install-psql]: /use-timescale/:currentVersion:/integrations/query-admin/psql/
[popsql]: /getting-started/:currentVersion:/run-queries-from-console/#popsql
[run-sqleditor]: /getting-started/:currentVersion:/run-queries-from-console/#sql-editor
[install-psql]: /use-timescale/:currentVersion:/integrations/query-admin/psql/
[hypertables]: /use-timescale/:currentVersion:/hypertables/about-hypertables/#hypertable-partitioning
