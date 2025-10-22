import NotAvailableFreePlan from "versionContent/_partials/_not-available-in-free-plan.mdx";

<Procedure>

1. **Check your $SERVICE_SHORT is running correctly**

   In [$CONSOLE][services-portal], check that your $SERVICE_SHORT is marked as `Running`.

   ![Check $SERVICE_SHORT is running](https://assets.timescale.com/docs/images/tiger-on-azure/tiger-console-services-view.png)

1. **Connect to your $SERVICE_SHORT**

   Connect using data mode or SQL editor in $CONSOLE, or psql in the command line:

   <Tabs label="Connect to your Tiger Cloud service" persistKey="sql-editor">

   <Tab title="Data mode in Console" label="data-mode">

   <NotAvailableFreePlan />

   <Procedure>

   1. In $CONSOLE, toggle `Data`. 

   1. Select your $SERVICE_SHORT in the connection drop-down in the top right. 

      ![Select a connection](https://assets.timescale.com/docs/images/tiger-cloud-console/tiger-console-data-mode-connection-dropdown.png)

   1. Run a test query:

      ```sql
      SELECT CURRENT_DATE;
      ```

      This query gives you the current date, you have successfully connected to your $SERVICE_SHORT.

   </Procedure>

   And that is it, you are up and running. Enjoy developing with $COMPANY.

   </Tab>
   
   <Tab title="SQL editor in Console" label="sql-editor">

   <Procedure>

   1. In $CONSOLE, select your $SERVICE_SHORT.
   
   1. Click `SQL editor`. 

      ![Check a $SERVICE_SHORT is running](https://assets.timescale.com/docs/images/tiger-on-azure/tiger-console-ops-mode-sql-editor-empty.png)

   1. Run a test query:

      ```sql
      SELECT CURRENT_DATE;
      ```

      This query gives you the current date, you have successfully connected to your $SERVICE_SHORT.
   
   </Procedure>

   And that is it, you are up and running. Enjoy developing with $COMPANY.

   </Tab>
   
   <Tab title="psql on the command line" label="psql">

   <Procedure>

   1. Install [psql][psql].

   1. Run the following command in the terminal using the service URL from the config file you have saved during service creation:

      ```
      psql "<your-service-url>"
      ```

   1. Run a test query:

      ```sql
      SELECT CURRENT_DATE;
      ```

      This query returns the current date. You have successfully connected to your $SERVICE_SHORT.

   </Procedure>

   And that is it, you are up and running. Enjoy developing with $COMPANY.

   </Tab>

   </Tabs>

</Procedure>

Quick recap. You:
- Manage your $SERVICE_SHORTs in the [$OPS_MODE][portal-ops-mode] in $CONSOLE: add $READ_REPLICAs and enable 
  high availability, compress data into the $COLUMNSTORE, change parameters, and so on.
- Analyze your data in the [$DATA_MODE][portal-data-mode] in $CONSOLE: write queries with
  autocomplete, save them in folders, share them, create charts/dashboards, and much more.
- Store configuration and security information in your config file.

[portal-ops-mode]: https://console.cloud.timescale.com/dashboard/services
[portal-data-mode]: https://console.cloud.timescale.com/dashboard/services?popsql
[account-portal]: https://console.cloud.timescale.com/dashboard/account
[services-portal]: https://console.cloud.timescale.com/dashboard/services
[install-psql]: /integrations/:currentVersion:/psql/
[popsql]: /getting-started/:currentVersion:/run-queries-from-console/#data-mode
[run-sqleditor]: /getting-started/:currentVersion:/run-queries-from-console/#sql-editor
[install-psql]: /integrations/:currentVersion:/psql/
[hypertables]: /use-timescale/:currentVersion:/hypertables/#hypertable-partitioning
[psql]: /integrations/:currentVersion:/psql/
