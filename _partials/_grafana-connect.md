
import ImportPrerequisites from "versionContent/_partials/_migrate_import_prerequisites.mdx";

## Prerequisites

<ImportPrerequisites />

*   Install [self-managed Grafana][grafana-self-managed], or sign up for [Grafana Cloud][grafana-cloud]

## Add your $SERVICE_LONG as a data source 

To connect the data in your $SERVICE_LONG to Grafana:

<Procedure>

1. **Log in to Grafana** 

   In your browser, log in to either:
    - Self-hosted Grafana: at `http://localhost:3000/`. The default credentials are `admin`, `admin`.
    - Grafana Cloud: use the URL and credentials you set when you created your account.
1. **Add your $SERVICE_LONG as a data source**
   1. In the Grafana dashboard, navigate to `Configuration` > `Data sources`, then click `Add data source`.
   1. In `Add data source`, select `PostgreSQL`.
   1. Configure the data source using the connection in `$TARGET`: 
       - `Name`: the name to use for the dataset
       - `Host`: the host and port for your $SERVICE_SHORT, in this format: `<HOST>:<PORT>`
       - `Database`: `tsdb`
       - `User`: `tsdbadmin`, or another privileged user
       - `Password`: the password for `User`
       - `TLS/SSL Mode`: select `require`
       - `PostgreSQL details`: enable `TimescaleDB`
       - Leave the default setting for all other fields

      Get the values for `Host` and `Password` from the connection string generated when you created your $SERVICE_LONG. For example, in the following connection string:

      ```bash
      postgres://tsdbadmin:krifchuf3r8c5onn@s5pq0es2cy.vfbtkqzhtm.tsdb.cloud.timescale.com:39941/tsdb?sslmode=require
      ```

      `krifchuf3r8c5onn` is the password and `s5pq0es2cy.vfbtkqzhtm.tsdb.cloud.timescale.com:39941` is the host and port in the required format. 

  1.  Click `Save & test`. 
   
  Grafana checks that your details are set correctly.

</Procedure>

[grafana-self-managed]: https://grafana.com/get/?tab=self-managed
[grafana-cloud]: https://grafana.com/get/
[cloud-login]: https://console.cloud.timescale.com/