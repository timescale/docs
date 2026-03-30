<Procedure>

1.  **In $CONSOLE, open [Exporters][console-integrations]**
1.  **Click `New exporter`**
1.  **Select `Metrics` for `Data type` and `Datadog` for provider**

    ![Add Datadog exporter][add-datadog-exporter]

1.  **Choose your AWS region and provide the API key**

    The AWS region must be the same for your $CLOUD_LONG exporter and the Datadog provider.

1.  **Set `Site` to your Datadog region**

1. **Export additional metrics**

   Optionally tick `PostgreSQL metrics` to export [additional metrics](/use-timescale/:currentVersion:/metrics-logging/exported-metrics/#postgres-metrics), then click `Create exporter`.

</Procedure>

[add-datadog-exporter]: https://assets.timescale.com/docs/images/tiger-cloud-console/tiger-console-integrations-datadog.png
[console-integrations]: https://console.cloud.tigerdata.com/dashboard/integrations
