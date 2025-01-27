## Attach a data exporter to a Timescale Cloud Service

To send telemetry data to an external monitoring tool, you attach the data exporter to a
Timescale Cloud Service. Each data exporter must be in the same AWS region as the Timescale Cloud Service you are
attaching it to.

Each Timescale Cloud Service has one exporter only. The exporter sends telemetry data from that
service to the monitoring provider.

<Procedure>

1.  In [Timescale Portal > Services][services-portal], choose the service to monitor.
1.  Click `Operations`, then `Integrations`.
1.  Select an exporter, then click `Attach exporter`.

<Highlight type="warning">
You need to restart the Timescale Cloud Services when you attach a first `Logs` 
data type exporter.
</Highlight>

</Procedure>

## Monitor Timescale Cloud Service metrics

You can now monitor your service metrics from the [metrics explorer in
Datadog][datadog-metrics-explorer], or query them from the CloudWatch metrics
page in AWS Console. For more information, see the [Datadog][datadog-docs] or
[CloudWatch][cloudwatch-docs] documentation.

Use the following metrics to check the service is running correctly:

*   `timescale.cloud.system.cpu.usage.millicores`
*   `timescale.cloud.system.cpu.total.millicores`
*   `timescale.cloud.system.memory.usage.bytes`
*   `timescale.cloud.system.memory.total.bytes`
*   `timescale.cloud.system.disk.usage.bytes`
*   `timescale.cloud.system.disk.total.bytes`

Additionally, use the following tags to filter your results.

|Tag|Example variable|Description|
|-|-|-|
|`host`|`us-east-1.timescale.cloud`||
|`project-id`|||
|`service-id`|||
|`region`|`us-east-1`|Timescale region|
|`role`|`replica` or `primary`|For services with replicas|
|`node-id`||For multi-node services|

## Edit a data exporter

To update a data exporter:

<Procedure>

1.  In Timescale Console, open [Integrations][console-integrations].
1.  Beside the exporter you want to edit, click the menu button. Click `Edit`.
1.  Edit the exporter fields and save your changes.

You cannot change fields such as the provider or the AWS region.

</Procedure>


## Delete a data exporter

To remove a data exporter that you no longer need:

<Procedure>

1. Disconnect the data exporter from your Timescale Cloud Services:

   For each Timescale Cloud Services the data exporter is connected to:
    1. In Timescale Console, open [Services][console-services], then select the Timescale Cloud Service to
       update.
    1.  Click `Operations`, then click `Integrations`.
    1.  Click the trash can icon.

   The data exporter is removed from this service. However, it still exists in your Timescale Cloud project.

1.  In Timescale Console, open [Integrations][console-integrations].
1.  Beside the exporter you want to delete, click the menu button, then click `Delete`.
1.  Confirm that you want to delete the data exporter.

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
