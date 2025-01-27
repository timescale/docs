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

import DataDogExporter from "versionContent/_partials/_datadog-data-exporter.md";
import ManageDataExporter from "versionContent/_partials/_manage-data-exporter.md";

# Integrate Timescale Cloud Services with third-party monitoring tools

You can export telemetry data from your Timescale Cloud _Time Series and Analytics_ services to third-party
monitoring tools such as [Datadog][datadog] or [AWS CloudWatch][cloudwatch]. Available metrics include
CPU usage, RAM usage, and storage. Third-party monitoring is available for [Scale or Enterprise][pricing-plan-features]
Timescale Projects.

This page shows you how to securely connect a data exporter to a monitoring tool, and manage
the lifecycle of data exporters.

To export telemetry data you:

1.  [Create a data exporter][create-exporter] - configure a Timescale Cloud data exporter to securely communicate with
    an external monitoring tool.
1.  [Attach the exporter to a Timescale Service][attach-exporter] - connect the exporter to a Timescale Cloud Service.


## Create a data exporter

A data exporter sends telemetry data from a Timescale Cloud Service to a third-party monitoring
tool. You attach each Timescale Cloud Service to a single data exporter. Each data exporter must be in the
same AWS region as the Timescale Cloud Service you are attaching it to. If your Timescale Cloud Project
has multiple services running in different regions, create an exporter for each region.

<Tabs label="Create a data exporter">

<Tab title="Datadog">

<DataDogExporter />

</Tab>

<Tab title="AWS CloudWatch">

<Procedure>

1.  In Timescale Console, open [Integrations][console-integrations].
1.  Click `Create exporter`, choose a data type, then click `AWS CloudWatch`.

    <img class="main-content__illustration"
    src="https://assets.timescale.com/docs/images/tsc-integrations-cloudwatch.png"
    alt="The UI to add an AWS CloudWatch exporter" />

1.  Fill the UI with your AWS CloudWatch configuration:

    - The AWS region must be the same for your Timescale Cloud exporter and AWS CloudWatch Log group.
    - The exporter name appears in Cloud console, best practice is to make this name easily understandable.
    - Enter your CloudWatch credentials:

    Either use an [existing CloudWatch Log group][console-cloudwatch-configuration]
    or [create a new one][console-cloudwatch-create-group]. If you're uncertain, use
    the default values. For more information, see [Working with log groups and log streams][cloudwatch-log-naming].

1.  Choose the authentication method to use for the exporter:

    <Tabs label="Authentication methods">
    
    <Tab title="IAM role">

    <Procedure>

    Timescale Cloud Services run in AWS. Best practice is to use [IAM Roles for Service Accounts (IRSA)][irsa] to
    manage access between Timescale Cloud Services and your AWS resources.

    To create a role that securely communicates between Timescale Cloud Service and your AWS account:

    1. Create the IRSA role following this [AWS blog][cross-account-iam-roles].   
    
      When you create the IAM OIDC provider, you must: 
        - Set the URL to the [region where the exporter is being created][reference]. 
        - Add the role as a trusted entity.

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
      **Role with a Trust Policy**:
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

    <Tab title="CloudWatch credentials">

    <Procedure>

    When you use CloudWatch credentials, you link an Identity and Access Management (IAM)
    user with access to CloudWatch only with your Timescale Cloud Service:

    1. Retrieve the user information from [IAM > Users in AWS console][list-iam-users].

       If you do not have an AWS user with access restricted to CloudWatch only,
       [create one][create-an-iam-user].
       For more information, see [Creating IAM users (console)][aws-access-keys].
    
    2. Enter the credentials for the AWS IAM user.

    <Highlight type="warning">
    AWS keys give access to your AWS services. To keep your AWS account secure,
    restrict users to the minimum required permissions. Always store your keys in a
    safe location. To avoid this issue, use the IAM role authentication method. 
    </Highlight>    

    </Procedure>

    </Tab>

    </Tabs> 

1. Select the AWS Region your CloudWatch services run in, then click `Create exporter`.

</Procedure>

</Tab>

</Tabs>

<ManageDataExporter />
