---
title: Integrate Timescale Cloud services with third-party monitoring
excerpt: Export telemetry metrics to Datadog or AWS CloudWatch
product: cloud
keywords: [integration, metrics, Datadog, AWS CloudWatch]
tags: [telemetry, monitor]
---

import AttachExporter from 'versionContent/_partials/_cloud-integrations-attach-exporter.mdx';

import ExporterRegionNote from 'versionContent/_partials/_cloud-integrations-exporter-region.mdx';

import Metrics from "versionContent/_partials/_cloud-integrations-metrics.mdx";

# Integrate Timescale Cloud services with third-party monitoring tools

You can export your service telemetry to a third-party monitoring tool, such as
[Datadog][datadog] or [AWS CloudWatch][cloudwatch]. Exported metrics include
CPU usage, RAM usage, and storage.

## Export telemetry data to Datadog

Export telemetry data to Datadog by:

1.  [Creating a data exporter][create-exporter-datadog]
1.  [Attaching your database service to the exporter][attach-exporter-datadog]

<ExporterRegionNote />

<procedure>

### Creating a data exporter for Datadog

1.  In the Timescale Cloud console, navigate to `Integrations`.
1.  Click `Create exporter`.
1.  Under `Choose a provider`, choose `Datadog`.
1.  Choose an AWS region for your exporter to live within Timescale Cloud. The
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

</procedure>

<AttachExporter integration="Datadog" />

You can now monitor your service metrics from the [metrics explorer in
Datadog][datadog-metrics-explorer]. For more information, see the [Datadog
documentation][datadog-docs].

<Metrics />

## Export telemetry data to AWS CloudWatch

Export telemetry data to AWS CloudWatch by:

1.  [Creating a data exporter][create-exporter-aws]
1.  [Attaching your database service to the exporter][attach-exporter-aws]

<ExporterRegionNote />

<procedure>

### Creating a data exporter for AWS CloudWatch

1.  In the Timescale Cloud console, navigate to `Integrations`.
1.  Click `Create exporter`.
1.  Under `Choose a provider`, choose `AWS CloudWatch`.
1.  Choose an AWS region for your exporter to live within Timescale Cloud. The
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

<highlight type="warning">
AWS keys give access to your AWS services. To keep your AWS account secure,
restrict users to the minimum required permissions. Always store your keys in a
safe location.
</highlight>

<img class="main-content__illustration"
src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-integrations-cloudwatch.png"
alt="Screenshot of the menu for adding a Datadog exporter" />

</procedure>

<AttachExporter integration="CloudWatch" />

You can now query your service metrics from the CloudWatch metrics page in AWS
Console. For more information, see the [CloudWatch
documentation][cloudwatch-docs].

<Metrics />

## Edit a data exporter

You can edit a data exporter after you create it. Some fields, such as the
provider and AWS region, can't be changed.

<procedure>

### Editing a data exporter

1.  Navigate to `Integrations`.
1.  Beside the exporter you want to edit, click the menu button. Click `Edit`.
1.  Edit the exporter fields and save your changes.

</procedure>

## Delete a data exporter

Delete any data exporters that you no longer need.

<procedure>

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

</procedure>

[create-exporter-datadog]: /cloud/:currentVersion:/integrations/#export-telemetry-data-to-datadog
[attach-exporter-datadog]: /cloud/:currentVersion:/integrations/#attaching-a-datadog-data-exporter-to-a-service
[create-exporter-aws]: /cloud/:currentVersion:/integrations/#creating-a-data-exporter-for-aws-cloudwatch
[attach-exporter-aws]: /cloud/:currentVersion:/integrations/#attaching-a-cloudwatch-data-exporter-to-a-service
[aws-access-keys]: <https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html#id_users_create_console>
[cloudwatch]: <https://aws.amazon.com/cloudwatch/>
[cloudwatch-docs]: <https://docs.aws.amazon.com/cloudwatch/index.html>
[cloudwatch-log-naming]: <https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Working-with-log-groups-and-streams.html>
[datadog]: <https://www.datadoghq.com>
[datadog-api-key]: <https://docs.datadoghq.com/account_management/api-app-keys/#add-an-api-key-or-client-token>
[datadog-docs]: <https://docs.datadoghq.com/>
[datadog-metrics-explorer]: <https://app.datadoghq.com/metric/explorer>
