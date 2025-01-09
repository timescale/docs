## Prerequisites

import IntegrationPrereqs from "versionContent/_partials/_integration-prereqs.mdx";
import ConnectionString from "versionContent/_partials/_connection-string.mdx";

<IntegrationPrereqs />

* Install [self-managed Grafana][grafana-self-managed], or sign up for [Grafana Cloud][grafana-cloud].

## Add your $SERVICE_LONG as a data source 

To connect the data in your $SERVICE_LONG to Grafana:

<Procedure>

1. **Log in to Grafana** 

   In your browser, log in to either:
    - Self-hosted Grafana: at `http://localhost:3000/`. The default credentials are `admin`, `admin`.
    - Grafana Cloud: use the URL and credentials you set when you created your account.
   
1. **Add your $SERVICE_LONG as a data source**
   1. Open `Connections` > `Data sources`, then click `Add new data source`.
   1. Select `PostgreSQL` from the list. 
   1. Configure the following fields:
       - `Host URL`: the host and port for your $SERVICE_SHORT, in this format: `<HOST>:<PORT>`.
       - `Database name`: the name to use for the dataset.
       - `Username`: `tsdbadmin` or another privileged user.
       - `Password`: the password for `Username`.
       - `Database`: `tsdb`.
       - `TLS/SSL Mode`: select `require`.
       - `PostgreSQL options`: enable `TimescaleDB`.
       - Leave the default setting for all other fields.

      <ConnectionString />

  1.  **Click `Save & test`** 
  
  Grafana checks that your details are set correctly.

</Procedure>

[grafana-self-managed]: https://grafana.com/get/?tab=self-managed
[grafana-cloud]: https://grafana.com/get/
[cloud-login]: https://console.cloud.timescale.com/
[create-service]: /getting-started/:currentVersion:/services/