---
title: Integrate Timescale Cloud services with third-party monitoring tools
excerpt: Export telemetry metrics to DataDog or AWS CloudWatch
product: cloud
keywords: [integrations, DataDog, AWS CloudWatch]
---

import AttachExporter from 'versionContent/_partials/_cloud-integrations-attach-exporter.mdx';
import ExporterRegionNote from 'versionContent/_partials/_cloud-integrations-exporter-region.mdx';

# Integrate Timescale Cloud services with third-party monitoring tools

You can export your service telemetry to a third-party monitoring tool, such as
[DataDog][datadog] or [AWS CloudWatch][cloudwatch].

## Export telemetry data to DataDog

Export telemetry data to DataDog by:

1.  Creating a data exporter
1.  Attaching your database service to the exporter

<procedure>

### Creating a data exporter for DataDog

<ExporterRegionNote />

1.  In the Timescale Cloud console, navigate to `Integrations`.
1.  Click `Create exporter`.
1.  Under `Choose a provder`, choose `Datadog`.
1.  Choose an AWS region for your exporter to live within Timescale Cloud. The
    exporter is only available to database services in the same AWS region.
1.  Name your exporter. This name appears in the Cloud console, so choose a
    descriptive name.
1.  Add a DataDog API key. If you don't have an API key yet, click `Click here
    to generate a DataDog API key`.
1.  Under Site, choose your DataDog region. You can choose a region to meet any
    regulatory requirements or application needs you might have.
1.  Click `Create endpoint`.

<!-- FIXME: insert screenshot here -->

</procedure>

<AttachExporter />

## Export telemetry data to AWS CloudWatch

Export telemetry data to AWS CloudWatch by:

1.  Creating a data exporter
1.  Attaching your database service to the exporter

<procedure>

### Creating a data exporter for AWS CloudWatch

<ExporterRegionNote />

1.  In the Timescale Cloud console, navigate to `Integrations`.
1.  Click `Create exporter`.
1.  Under `Choose a provder`, choose `AWS CloudWatch`.
1.  Choose an AWS region for your exporter to live within Timescale Cloud. The
    exporter is only available to database services in the same AWS region.
1.  Name your exporter. This name appears in the Cloud console, so choose a
    descriptive name.
1.  Define names for your CloudWatch log group, log stream, and namespace. If
    you're uncertain, use the default values. For more information on naming log
    groups and logs streams, see [the AWS CloudWatch
    docs][cloudwatch-log-naming].
1.  Enter your AWS credentials. To get your AWS keys, see [Getting access keys
    for AWS CloudWatch][aws-access-keys].
1.  Select an AWS Region for your CloudWatch instance.
1.  **OPTIONAL** Define an Identity and Access Management (IAM) role to upload
    segments to a different account.

<!-- FIXME: insert screenshot here -->

</procedure>

<procedure>

### Getting access keys for AWS CloudWatch

1.  Navigate to your AWS Console.  
1.  Select `Access key - Programmatic access`.
1.  Select `Use a permissions boundary to control the maximum user permissions`.
1.  Enable `AmazonCloudWatchEvidentlyFullAccess`.
1.  Copy your access key and secret key. Remember to keep these secure.
1.  Return to the Timescale Cloud console to enter your AWS keys.

</procedure>

<AttachExporter />

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

[aws-access-keys]: #getting-access-keys-for-aws-cloudwatch
[cloudwatch]: https://aws.amazon.com/cloudwatch/
[cloudwatch-log-naming]: https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Working-with-log-groups-and-streams.html
[datadog]: https://www.datadoghq.com
