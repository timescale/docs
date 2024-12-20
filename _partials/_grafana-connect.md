## Prerequisites

* [Create a target $SERVICE_LONG][create-service]
* Install [self-managed Grafana][grafana-self-managed], or sign up for [Grafana Cloud][grafana-cloud]

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
       - `Username`: `tsdbadmin`, or another privileged user.
       - `Password`: the password for `User`.
       - `Database`: `tsdb`.
       - `TLS/SSL Mode`: select `require`.
       - `PostgreSQL options`: enable `TimescaleDB`.
       - Leave the default setting for all other fields.

      Get the values for `Host URL` and `Password` from the connection string generated when you created your $SERVICE_LONG. For example, in the following connection string:

      ```bash
      postgres://tsdbadmin:krifchuf3r8c5onn@s5pq0es2cy.vfbtkqzhtm.tsdb.cloud.timescale.com:39941/tsdb?sslmode=require
      ```

      `krifchuf3r8c5onn` is the password and `s5pq0es2cy.vfbtkqzhtm.tsdb.cloud.timescale.com:39941` is the host URL in the required format. 

  1.  **Click `Save & test`** 
  
  Grafana checks that your details are set correctly.

</Procedure>

[grafana-self-managed]: https://grafana.com/get/?tab=self-managed
[grafana-cloud]: https://grafana.com/get/
[cloud-login]: https://console.cloud.timescale.com/
[create-service]: getting-started/:currentVersion:/services