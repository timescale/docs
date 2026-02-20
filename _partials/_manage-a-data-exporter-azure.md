### Attach a data exporter to a $SERVICE_LONG

To send telemetry data to an external monitoring tool, you attach a data exporter to your
$SERVICE_LONG. You can attach only one exporter to a $SERVICE_SHORT.

To attach an exporter:

<Procedure>

1.  **In [$CONSOLE][services-portal], choose the $SERVICE_SHORT**
1.  **Click `Operations` > `Exporters`**
1.  **Select the exporter, then click `Attach exporter`**
1.  **If you are attaching a first `Logs` data type exporter, restart the $SERVICE_SHORT**

</Procedure>

### Monitor $SERVICE_LONG metrics

You can now monitor your $SERVICE_SHORT metrics. Use the following metrics to check the service is running correctly:

*   `timescale.cloud.system.cpu.usage.millicores`
*   `timescale.cloud.system.cpu.total.millicores`
*   `timescale.cloud.system.memory.usage.bytes`
*   `timescale.cloud.system.memory.total.bytes`
*   `timescale.cloud.system.disk.usage.bytes`
*   `timescale.cloud.system.disk.total.bytes`

Additionally, use the following tags to filter your results.

|Tag|Example variable| Description                |
|-|-|----------------------------|
|`host`|`eastus.timescale.cloud`|                            |
|`project-id`||                            |
|`service-id`||                            |
|`region`|`eastus`| Azure region                 |
|`role`|`replica` or `primary`| For $SERVICE_SHORT with replicas |

### Edit a data exporter

To update a data exporter:

<Procedure>

1.  **In $CONSOLE, open [Exporters][console-integrations]**
1.  **Next to the exporter you want to edit, click the menu > `Edit`**
1.  **Edit the exporter fields and save your changes**

You cannot change fields such as the provider or the region.

</Procedure>

### Delete a data exporter

To remove a data exporter that you no longer need:

<Procedure>

1. **Disconnect the data exporter from your $SERVICE_LONGs**

    1. In [$CONSOLE][services-portal], choose the $SERVICE_SHORT.
    1. Click `Operations` > `Exporters`.
    1. Click the trash can icon next to the exporter.
    1. Repeat for every $SERVICE_SHORT attached to the exporter you want to remove.

    The data exporter is now unattached from all $SERVICE_SHORTs. However, it still exists in your project.

1. **Delete the exporter on the project level**

   1. In $CONSOLE, open [Exporters][console-integrations]
   1. Next to the exporter you want to edit, click menu > `Delete`
   1. Confirm that you want to delete the data exporter.

</Procedure>

[console-integrations]: https://console.cloud.timescale.com/dashboard/integrations
[services-portal]: https://console.cloud.timescale.com/dashboard/services