---
title: Integrate Timescale services with third-party monitoring
excerpt: Export telemetry metrics to Datadog or AWS CloudWatch
products: [cloud]
keywords: [integration, metrics, Datadog, AWS CloudWatch]
tags: [telemetry, monitor]
cloud_ui:
    path:
        - [integrations]
        - [services, :serviceId, operations, integrations]
---

import ExporterRegionNote from 'versionContent/_partials/_cloud-integrations-exporter-region.mdx';

# Integrate Timescale services with third-party monitoring tools

You can export your service telemetry to a third-party monitoring tool such as
[Datadog][datadog] or [AWS CloudWatch][cloudwatch]. Exported metrics include
CPU usage, RAM usage, and storage.

## Export telemetry data

To export telemetry data you:

1.  [Create a data exporter][create-exporter]
1.  [Attach the exporter to a Timescale service][attach-exporter]

### Create a data exporter

<ExporterRegionNote />

<Tabs label="Create a data exporter">

<Tab title="Datadog">

<Procedure>

#### Create an exporter for Datadog

1.  In Timescale Console, open [Integrations][console-integrations].
1.  Click `Create exporter`, then click `Metrics` and choose `Datadog` as the provider.
     
    <img class="main-content__illustration"
    src="https://assets.timescale.com/docs/images/tsc-integrations-datadog.webp"
    alt="Screenshot of the menu for adding a Datadog exporter" />

1.  Fill the UI with your Datadog configuration. 

    The exporter must be in the same region as the provider. If you don't have an 
    API key, [Create one][datadog-api-key]. 

1.  Set `Site` to your Datadog region then click `Create exporter`.


</Procedure>

</Tab>

<Tab title="AWS CloudWatch">

<Procedure>

#### Create a data exporter for AWS CloudWatch

1.  In Timescale Console, open [Integrations][console-integrations].
1.  Click `Create exporter`, choose a data type, then click `AWS CloudWatch`.

    <img class="main-content__illustration"
    src="https://assets.timescale.com/docs/images/tsc-integrations-cloudwatch.webp"
    alt="Screenshot of the menu for adding a Datadog exporter" />

1.  Choose the AWS region for your exporter. to live within Timescale. 

    Your Timescale Service and the provider must be hosted in the same AWS region.

1.  Name your exporter. This name appears in the Cloud console, so choose a
    descriptive name.
 
1. Define names for your CloudWatch log group, log stream, and namespace. 

    If you're uncertain, use the default values. For more information on naming log
    groups and logs streams, see [the AWS CloudWatch docs][cloudwatch-log-naming].

1.  Choose the authentication method to use for the exporter:

    <Tabs label="Authentication methods">
    
    <Tab title="CloudWatch credentials">   
    
    <Procedure>

     When you use CloudWatch credentials, you link an Identity and Access Management (IAM) 
     user with access to Cloudwatch only with your Timescale service:  

    1. Retrieve the user information from the [AWS console](https://console.aws.amazon.com/iam/home#/users).   
    
       If you do not have an AWS user with access restricted to CloudWatch only, 
       [create one][create-an-iam-user]. 
       For more information, see [Creating IAM users (console)][aws-access-keys].
    2. Enter the credentials for the AWS IAM user. 

   </Procedure>
    
   </Tab>
    
   <Tab title="IAM role">

   <Procedure>
   Timescale services run in AWS. Best practice is to use IRSA to manage access 
   between Timescale services and your AWS resources.  
    
   To create a role that securely communicates between your Timescale service and your AWS 
   account:
   
    1. Create the [IRSA][irsa] role following this [AWS blog][cross-account-iam-roles].   
    
       When you create the IAM OIDC provider, the URL depends on the region where the exporter is being 
       created. It must be [one of the following](#reference). Also, you must add the role itself as a 
       trusted entity.

   The following example shows a correctly configured IRSA role:
   
   **Permission Policy**:
   ```json
   {
       "Version": "2012-10-17",
       "Statement": [
           {
               "Effect": "Allow",
               "Action": [
                   "logs:PutLogEvents",
                   "logs:CreateLogGroup",
                   "logs:CreateLogStream",
                   "logs:DescribeLogStreams",
                   "logs:DescribeLogGroups",
                   "logs:PutRetentionPolicy",
                   "xray:PutTraceSegments",
                   "xray:PutTelemetryRecords",
                   "xray:GetSamplingRules",
                   "xray:GetSamplingTargets",
                   "xray:GetSamplingStatisticSummaries",
                   "ssm:GetParameters"
               ],
               "Resource": "*"
           }
       ]
   }      
   ```
   **Trust Policy**:
   ```json
   {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Principal": {
                    "Federated": "arn:aws:iam::12345678910:oidc-provider/irsa-oidc-discovery-prod.s3.us-east-1.amazonaws.com"
                },
                "Action": "sts:AssumeRoleWithWebIdentity",
                "Condition": {
                    "StringEquals": {
                        "irsa-oidc-discovery-prod.s3.us-east-1.amazonaws.com:aud": "sts.amazonaws.com"
                    }
                }
            },
            {
                "Sid": "Statement1",
                "Effect": "Allow",
                "Principal": {
                    "AWS": "arn:aws:iam::12345678910:role/my-exporter-role"
                },
                "Action": "sts:AssumeRole"
            }
        ]
    }        
   ```    
   </Procedure>

   </Tab>
    
   </Tabs>

1. Select an AWS Region for your CloudWatch instance.
1. Click `Create exporter`.

<Highlight type="warning">
AWS keys give access to your AWS services. To keep your AWS account secure,
restrict users to the minimum required permissions. Always store your keys in a
safe location.
</Highlight>

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
1.  Select an exporter and click `Attach exporter`.

<Highlight type="warning">
If you would like to attach a logs exporter to an already existing 
service, you do not need to restart the service. The service only 
needs to be restarted when you attach the first logs exporter.
</Highlight>

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

## Reference

When you create the IAM OIDC provider, the URL depends on the region where the exporter is being 
created. It must be one of the following: 

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

[attach-exporter]: #attach-a-data-exporter-to-a-service
[aws-access-keys]: https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html#id_users_create_console
[irsa]: https://aws.amazon.com/blogs/opensource/introducing-fine-grained-iam-roles-service-accounts/
[cross-account-iam-roles]: https://aws.amazon.com/blogs/containers/cross-account-iam-roles-for-kubernetes-service-accounts/
[cloudwatch]: https://aws.amazon.com/cloudwatch/
[cloudwatch-docs]: https://docs.aws.amazon.com/cloudwatch/index.html
[cloudwatch-log-naming]: https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Working-with-log-groups-and-streams.html
[create-exporter]: #create-a-data-exporter
[datadog]: https://www.datadoghq.com
[datadog-api-key]: https://docs.datadoghq.com/account_management/api-app-keys/#add-an-api-key-or-client-token
[datadog-docs]: https://docs.datadoghq.com/
[datadog-metrics-explorer]: https://app.datadoghq.com/metric/explorer
[console-integrations]: https://console.cloud.timescale.com/dashboard/integrations
[create-an-iam-user]: https://console.aws.amazon.com/iam/home#/users/create