
import ImportPrerequisites from "versionContent/_partials/_migrate_import_prerequisites.mdx";

## Add Timescale as a data source in Grafana

Grafana is and open source analytics and monitoring solution. You use Grafana to visualize queries 
directly from your $SERVICE_LONG.

### Prerequisites

<ImportPrerequisites />

*   Install self-managed Grafana, or sign up for [Grafana Cloud][install-grafana]

### Add your $SERVICE_LONG as a data source in Grafana

To connect the data in your $SERVICE_LONG to Grafana:

<Procedure>

1. **Log in to Grafana** 

   In your browser, log in to either :
    - Self-hosted Grafana: at `http://localhost:3000/`. The default credentials are `admin`, `admin`.
    - Grafana Cloud: use the URL and credentials you set when you created your account.
1. **Add your $SERVICE_LONG as a data source**
   1. In the Grafana dashboard, navigate to `Configuration` > `Data sources`, then click `Add data source`.
   1. In `Add data source`, select `PostgreSQL`.
   1. Configure the data source using the connection in `$TARGET`:
       - `Name`: the name to use for the dataset
       - `Host`: the host and port for your $SERVICE_SHORT, in this format: `<HOST>:<PORT>`.
    
           For example: `example.tsdb.cloud.timescale.com:35177`.
       - `Database`: `tsdb`
       - `User`: `tsdbadmin`, or another privileged user
       - `Password`: the password for `User`
       - `TLS/SSL Mode`: select `require`
       - `PostgreSQL details`: enable `TimescaleDB`
       - Leave the default setting for all other fields
   1.  Click `Save & test`. 
   
   Grafana checks that your details are set correctly.

</Procedure>

[install-grafana]: https://grafana.com/get/
[cloud-login]: https://console.cloud.timescale.com/
