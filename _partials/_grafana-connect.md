## Prerequisites

import IntegrationPrereqs from "versionContent/_partials/_integration-prereqs.mdx";

<IntegrationPrereqs />

* Install [self-managed Grafana][grafana-self-managed] or sign up for [Grafana Cloud][grafana-cloud].

## Add your $SERVICE_SHORT as a data source 

To connect the data in your $SERVICE_SHORT to Grafana:

<Procedure>

1. **Log in to Grafana** 

   In your browser, log in to either:
    - Self-hosted Grafana: at `http://localhost:3000/`. The default credentials are `admin`, `admin`.
    - Grafana Cloud: use the URL and credentials you set when you created your account.
1. **Add your $SERVICE_SHORT as a data source**
   1. Open `Connections` > `Data sources`, then click `Add new data source`.
   1. Select `PostgreSQL` from the list. 
   1. Configure the connection:
       - `Host URL`, `Username`, `Password`, and `Database`: configure using your [connection details][connection-info]. 
       - `Database name`: provide the name for your dataset.
       - `TLS/SSL Mode`: select `require`.
       - `PostgreSQL options`: enable `TimescaleDB`.
       - Leave the default setting for all other fields.

  1.  **Click `Save & test`** 
  
  Grafana checks that your details are set correctly.

</Procedure>

[grafana-self-managed]: https://grafana.com/get/?tab=self-managed
[grafana-cloud]: https://grafana.com/get/
[cloud-login]: https://console.cloud.timescale.com/
[create-service]: /getting-started/:currentVersion:/services/
[connection-info]: /use-timescale/:currentVersion:/integrations/find-connection-details/