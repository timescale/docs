# Logging integrations
If you need to access logs for your services regularly, or if you need more
detailed logging than Managed Service for TimescaleDB can provide in the web
console, you can connect your Managed Service for TimescaleDB to a logging service
such as Loggly.

## Create a Loggly service integration
This section covers how to create a service integration to
[SolarWinds Loggly][loggly-site] with Managed Service for TimescaleDB.

<procedure>

### Creating a Loggly service integration

1.  Navigate to [SolarWinds Loggly][loggly-site] and create or log in to your account.
1.  From the Loggly Home screen, navigate to `Logs`→`Source Setup`. Click
    `Customer Tokens` from the top menu bar.
1.  On the `Customer Tokens` page, click `Add New` to create a new token. Give your
    token a name, and click `Save`. Copy your new token to your clipboard.
1.  Log in to your [Managed Service for TimescaleDB account][mst-portal], and navigate
    to `Service Integrations`.
1.  In the `Service Integrations` page, navigate to `Syslog`, and click
    `Add new endpoint`.
1.  In the `Create new syslog endpoint` dialog, complete these fields:

      * In the `Endpoint name` field, type a name for your endpoint.
      * In the `Server` field, type `logs-01.loggly.com`.
      * In the `Port` field, type `514`.
      * Uncheck the `TLS` checkbox.
      * In the `Format` field, select `rfc5425`.
      * In the `Structured Data` field, type `<LOGGLY_TOKEN>@41058`, using the Loggly token you copied earlier. You can also add a tag here, which you can use to more easily search for your logs in Loggly. For example, `8480330f5-aa09-46b0-b220-a0efa372b17b@41058 TAG="example-tag"`.

    Click `Create` to create the endpoint. When the endpoint has been created, it shows as an enabled service integration, with a green `active` indicator.
1.  In the Loggly dashboard, navigate to `Search` to see your incoming logs. From here,
    you can create custom dashboards and view reports for your logs.

    <img class="main-content__illustration"
      src="https://s3.amazonaws.com/assets.timescale.com/docs/images/loggly-view-logs.png" alt="Viewing incoming MST logs in Loggly"
    />

</procedure>

[loggly-site]: https://www.loggly.com/
[mst-portal]: https://portal.managed.timescale.com
