---
title: Integrate Timescale services with third-party monitoring
excerpt: Export telemetry metrics to Datadog or AWS CloudWatch
products: [cloud]
keywords: [integration, metrics, Datadog, AWS CloudWatch]
tags: [telemetry, monitor]
cloud_ui:
    path:
        - [integrations]
        - [services, :serviceID, operations, integrations]
---

import ExporterRegionNote from 'versionContent/_partials/_cloud-integrations-exporter-region.mdx';

# Integrate Timescale services with third-party monitoring tools

You can export your service telemetry to a third-party monitoring tool, such as
[Datadog][datadog] or [AWS CloudWatch][cloudwatch]. Exported metrics include
CPU usage, RAM usage, and storage.

## Export telemetry data

Export telemetry data by:

1.  [Creating a data exporter][create-exporter]
1.  [Attaching the exporter to a database service][attach-exporter]

### Create a data exporter

<ExporterRegionNote />

<Tabs label="Create a data exporter">

<Tab title="Datadog">

<Procedure>

#### Creating a data exporter for Datadog

1.  In the Timescale console, navigate to `Integrations`.
1.  Click `Create exporter`.
1.  Under `Choose a provider`, choose `Datadog`.
1.  Choose an AWS region for your exporter to live within Timescale. The
    exporter is only available to database services in the same AWS region.
1.  Name your exporter. This name appears in the Cloud console, so choose a
    descriptive name.
1.  Add a Datadog API key. If you don't have an API key yet, you can create one
    by following the instructions in the [Datadog
    documentation][datadog-api-key].
1.  Under Site, choose your Datadog region. You can choose a region to meet any
    regulatory requirements or application needs you might have.
1.  Click `Create exporter`.

<img class="main-content__illustration"
src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-integrations-datadog.png"
alt="Screenshot of the menu for adding a Datadog exporter" />

</Procedure>

</Tab>

<Tab title="AWS CloudWatch">

<Procedure>

#### Creating a data exporter for AWS CloudWatch

1.  In the Timescale console, navigate to `Integrations`.
1.  Click `Create exporter`.
1.  Under `Choose a provider`, choose `AWS CloudWatch`.
1.  Choose an AWS region for your exporter to live within Timescale. The
    exporter is only available to database services in the same AWS region.
1.  Name your exporter. This name appears in the Cloud console, so choose a
    descriptive name.
1.  Define names for your CloudWatch log group, log stream, and namespace. If
    you're uncertain, use the default values. For more information on naming log
    groups and logs streams, see [the AWS CloudWatch
    docs][cloudwatch-log-naming].
1.  Enter your AWS credentials. To get your AWS keys, you need to create a new
    Identity and Access Management (IAM) user in your AWS console. Make sure
    your new user has restricted access to only Cloudwatch, and keep your keys
    secret. For instructions, see the [AWS documentation][aws-access-keys].
1.  Select an AWS Region for your CloudWatch instance.
1.  <Optional />Define an IAM role to use for uploading metrics. Having a
    dedicated role with only CloudWatch permissions is a recommended security
    practice.
1.  Click `Create exporter`.

<Highlight type="warning">
AWS keys give access to your AWS services. To keep your AWS account secure,
restrict users to the minimum required permissions. Always store your keys in a
safe location.
</Highlight>

<img class="main-content__illustration"
src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-integrations-cloudwatch.png"
alt="Screenshot of the menu for adding a Datadog exporter" />

</Procedure>

</Tab>

</Tabs>

### Attach a data exporter to a service

Once you create a data exporter, you can attach it to a service. The exporter
then exports that service's telemetry data.

You can only have one exporter per service.

<ExporterRegionNote />

<Procedure>

### Attaching a data exporter to a service

1.  Navigate to `Services`. Click on the service you want to connect to your
    exporter.
1.  Navigate to `Operations`, then `Integrations`.
1.  Select and add an exporter.

</Procedure>

## Monitor service metrics

You can now monitor your service metrics from the [metrics explorer in
Datadog][datadog-metrics-explorer], or query them from the cloudWatch metrics
page in AWS Console. For more information, see the [Datadog][datadog-docs] or
[Cloudwatch][cloudwatch-docs] documentation.

When you have set up your integration, you can check that it is working
correctly by looking for the metrics that Timescale exports. The metric
names are:

*   `timescale.cloud.system.cpu.usage.millicores`
*   `timescale.cloud.system.cpu.total.millicores`
*   `timescale.cloud.system.memory.usage.bytes`
*   `timescale.cloud.system.memory.total.bytes`
*   `timescale.cloud.system.disk.usage.bytes`
*   `timescale.cloud.system.disk.total.bytes`

Additionally, Timescale exports tags that you can use to filter your
results. You can also check that these tags are being correctly exported:

|Tag|Example variable|Description|
|-|-|-|
|`host`|`us-east-1.timescale.cloud`||
|`project-id`|||
|`service-id`|||
|`region`|`us-east-1`|Timescale region|
|`role`|`replica` or `primary`|For services with replicas|
|`node-id`||For multi-node services|

## Edit a data exporter

You can edit a data exporter after you create it. Some fields, such as the
provider and AWS region, can't be changed.

<Procedure>

### Editing a data exporter

1.  Navigate to `Integrations`.
1.  Beside the exporter you want to edit, click the menu button. Click `Edit`.
1.  Edit the exporter fields and save your changes.

</Procedure>

## Delete a data exporter

Delete any data exporters that you no longer need.

<Procedure>

### Deleting a data exporter

1.  Before deleting a data exporter, remove all connected services.
1.  For each connected service, navigate to the service `Operations` tab.
1.  Click `Integrations`.
1.  Click the trash can icon to remove the exporter from the service. This
    doesn't delete the exporter itself.
1.  In the main menu, navigate to `Integrations`.
1.  Beside the exporter you want to delete, click the menu button. Click
    `Delete`.
1.  Confirm that you want to delete.

</Procedure>

[attach-exporter]: #attach-a-data-exporter-to-a-service
[aws-access-keys]: https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html#id_users_create_console
[cloudwatch]: https://aws.amazon.com/cloudwatch/
[cloudwatch-docs]: https://docs.aws.amazon.com/cloudwatch/index.html
[cloudwatch-log-naming]: https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Working-with-log-groups-and-streams.html
[create-exporter]: #create-a-data-exporter
[datadog]: https://www.datadoghq.com
[datadog-api-key]: https://docs.datadoghq.com/account_management/api-app-keys/#add-an-api-key-or-client-token
[datadog-docs]: https://docs.datadoghq.com/
[datadog-metrics-explorer]: https://app.datadoghq.com/metric/explorer
