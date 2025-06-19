## Connect Grafana to Tiger Cloud 

To visualize the results of your queries, enable Grafana to read the data in your $SERVICE_SHORT:

<Procedure>

1. **Log in to Grafana** 

   In your browser, log in to either:
    - Self-hosted Grafana: at `http://localhost:3000/`. The default credentials are `admin`, `admin`.
    - Grafana Cloud: use the URL and credentials you set when you created your account.
1. **Add your $SERVICE_SHORT as a data source**
   1. Open `Connections` > `Data sources`, then click `Add new data source`.
   1. Select `PostgreSQL` from the list. 
   1. Configure the connection:
      - `Host URL`, `Database name`, `Username`, and `Password` 
      
          Configure using your [connection details][connection-info]. `Host URL` is in the format `<host>:<port>`.
      - `TLS/SSL Mode`: select `require`.
      - `PostgreSQL options`: enable `TimescaleDB`.
      - Leave the default setting for all other fields.

   1. Click `Save & test`. 
  
     Grafana checks that your details are set correctly.

</Procedure>

[grafana-self-managed]: https://grafana.com/get/?tab=self-managed
[grafana-cloud]: https://grafana.com/get/
[cloud-login]: https://console.cloud.tigerdata.com/
[create-service]: /getting-started/:currentVersion:/services/
[connection-info]: /integrations/:currentVersion:/find-connection-details/
