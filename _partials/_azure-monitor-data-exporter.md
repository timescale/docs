<Procedure>

1.  **In $CONSOLE, open [Exporters][console-integrations]**
1.  **Click `New exporter`**
1.  **Select `Metrics` for `Data type` and `Azure Monitor` for provider**

    ![Add Azure Monitor exporter][add-azure-monitor-exporter]

1.  **Provide your Azure Monitor configuration**

    - The exporter name appears in $CONSOLE, best practice is to make this name easily understandable.
    - Connection string: Retrieve this from your Azure Monitor Application Insights resource. In the Azure portal, navigate to your Application Insights resource, and copy the Connection String from the Overview page. The connection string contains your InstrumentationKey and IngestionEndpoint.

1.  **Configure optional settings** (Advanced)

    - **Max batch size**: Maximum number of telemetry items per batch (default: 1024). Higher values reduce network overhead but increase memory usage.
    - **Max batch interval**: Maximum interval in seconds before sending a batch (default: 10). Lower values provide near real-time data but increase network traffic.
    - **Span events enabled**: Enable export of span events for distributed tracing (default: false).
    - **Custom events enabled**: Enable export of custom events for logs (default: false).

1.  **Click `Create exporter`**

</Procedure>

[add-azure-monitor-exporter]: https://assets.timescale.com/docs/images/tiger-cloud-console/tiger-console-integrations-azure-monitor.png
[console-integrations]: https://console.cloud.timescale.com/dashboard/integrations