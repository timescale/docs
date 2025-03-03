## Attach a data exporter to a $SERVICE_LONG

To send telemetry data to an external monitoring tool, you attach a data exporter to your
$SERVICE_LONG. You can attach only one exporter to a $SERVICE_SHORT.

To attach an exporter: 

<Procedure>

1.  **In [$CONSOLE][console-services], choose the $SERVICE_SHORT**
1.  **Click `Operations` > `Integrations`**
1.  **Select the exporter, then click `Attach exporter`**
1.  **If you are attaching a first `Logs` data type exporter, restart the $SERVICE_SHORT**

</Procedure>

## Monitor $SERVICE_LONG metrics

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
|`host`|`us-east-1.timescale.cloud`|                            |
|`project-id`||                            |
|`service-id`||                            |
|`region`|`us-east-1`| AWS region                 |
|`role`|`replica` or `primary`| For $SERVICE_SHORT with replicas |
|`node-id`|| For multi-node services    |

## Edit a data exporter

To update a data exporter:

<Procedure>

1.  **In $CONSOLE, open [Integrations][console-integrations]**
1.  **Next to the exporter you want to edit, click the menu > `Edit`**
1.  **Edit the exporter fields and save your changes**

You cannot change fields such as the provider or the AWS region.

</Procedure>

## Delete a data exporter

To remove a data exporter that you no longer need:

<Procedure>

1. **Disconnect the data exporter from your $SERVICE_LONGs**

    1. In [$CONSOLE][console-services], choose the $SERVICE_SHORT.
    1. Click `Operations` > `Integrations`.
    1. Click the trash can icon.
    1. Repeat for every $SERVICE_SHORT attached to the exporter you want to remove. 

    The data exporter is now unattached from all $SERVICE_SHORTs. However, it still exists in your project.

1. **Delete the exporter on the project level** 

   1. In $CONSOLE, open [Integrations][console-integrations]
   1. Next to the exporter you want to edit, click menu > `Delete`
   1. Confirm that you want to delete the data exporter.

</Procedure>

## Reference

When you create the IAM OIDC provider, the URL must match the region you create the exporter in.
It must be one of the following:

| Region           | Zone          | Location       | URL
|------------------|---------------|----------------|--------------------|
| `ap-southeast-1` | Asia Pacific  | Singapore      | `irsa-oidc-discovery-prod-ap-southeast-1.s3.ap-southeast-1.amazonaws.com`
| `ap-southeast-2` | Asia Pacific  | Sydney         | `irsa-oidc-discovery-prod-ap-southeast-2.s3.ap-southeast-2.amazonaws.com`
| `ap-northeast-1` | Asia Pacific  | Tokyo          | `irsa-oidc-discovery-prod-ap-northeast-1.s3.ap-northeast-1.amazonaws.com`
| `ca-central-1`   | Canada        | Central        | `irsa-oidc-discovery-prod-ca-central-1.s3.ca-central-1.amazonaws.com`
| `eu-central-1`   | Europe        | Frankfurt      | `irsa-oidc-discovery-prod-eu-central-1.s3.eu-central-1.amazonaws.com`
| `eu-west-1`      | Europe        | Ireland        | `irsa-oidc-discovery-prod-eu-west-1.s3.eu-west-1.amazonaws.com`
| `eu-west-2`      | Europe        | London         | `irsa-oidc-discovery-prod-eu-west-2.s3.eu-west-2.amazonaws.com`
| `sa-east-1`      | South America | São Paulo      | `irsa-oidc-discovery-prod-sa-east-1.s3.sa-east-1.amazonaws.com`
| `us-east-1`      | United States | North Virginia | `irsa-oidc-discovery-prod.s3.us-east-1.amazonaws.com`
| `us-east-2`      | United States | Ohio           | `irsa-oidc-discovery-prod-us-east-2.s3.us-east-2.amazonaws.com`
| `us-west-2`      | United States | Oregon         | `irsa-oidc-discovery-prod-us-west-2.s3.us-west-2.amazonaws.com`

[attach-exporter]: /use-timescale/:currentVersion:/metrics-logging/integrations/#attach-a-data-exporter-to-a-timescale-cloud-service
[aws-access-keys]: https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html#id_users_create_console
[irsa]: https://aws.amazon.com/blogs/opensource/introducing-fine-grained-iam-roles-service-accounts/
[cross-account-iam-roles]: https://aws.amazon.com/blogs/containers/cross-account-iam-roles-for-kubernetes-service-accounts/
[cloudwatch]: https://aws.amazon.com/cloudwatch/
[cloudwatch-docs]: https://docs.aws.amazon.com/cloudwatch/index.html
[cloudwatch-log-naming]: https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Working-with-log-groups-and-streams.html
[create-exporter]: /use-timescale/:currentVersion:/metrics-logging/integrations/#create-a-data-exporter
[datadog]: https://www.datadoghq.com
[datadog-api-key]: https://docs.datadoghq.com/account_management/api-app-keys/#add-an-api-key-or-client-token
[datadog-docs]: https://docs.datadoghq.com/
[datadog-metrics-explorer]: https://app.datadoghq.com/metric/explorer
[console-integrations]: https://console.cloud.timescale.com/dashboard/integrations
[console-services]: https://console.cloud.timescale.com/dashboard/services
[list-iam-users]: https://console.aws.amazon.com/iam/home#/users
[create-an-iam-user]: https://console.aws.amazon.com/iam/home#/users/create
[reference]: /use-timescale/:currentVersion:/metrics-logging/integrations/#reference
[console-cloudwatch-configuration]: https://console.aws.amazon.com/cloudwatch/home#logsV2:log-groups
[console-cloudwatch-create-group]: https://console.aws.amazon.com/cloudwatch/home#logsV2:log-groups/create-log-group
[services-portal]: https://console.cloud.timescale.com/dashboard/services
[pricing-plan-features]: /about/:currentVersion:/pricing-and-account-management/#features-included-in-each-plan
