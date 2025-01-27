<Procedure>

1.  **In $CONSOLE, open [Integrations][console-integrations]**
1.  **Click `New exporter`**
1.  **Select the data type and specify `AWS CloudWatch` for provider**

    ![Add CloudWatch data exporter](https://assets.timescale.com/docs/images/tsc-integrations-cloudwatch.png)

1.  **Provide your AWS CloudWatch configuration**

    - The AWS region must be the same for your $CLOUD_LONG exporter and AWS CloudWatch Log group.
    - The exporter name appears in Cloud console, best practice is to make this name easily understandable.
    - For CloudWatch credentials, either use an [existing CloudWatch Log group][console-cloudwatch-configuration]
      or [create a new one][console-cloudwatch-create-group]. If you're uncertain, use
      the default values. For more information, see [Working with log groups and log streams][cloudwatch-log-naming].

1.  **Choose the authentication method to use for the exporter**

    <Tabs label="Authentication methods">

    <Tab title="IAM role">

    <Procedure>

    $SERVICE_LONGs run in AWS. Best practice is to use [IAM Roles for Service Accounts (IRSA)][irsa] to
    manage access between your $SERVICE_SHORTs and your AWS resources.

    Create the IRSA role following this [AWS blog post][cross-account-iam-roles].

    When you create the IAM OIDC provider:
    - Set the URL to the [region where the exporter is being created][reference].
    - Add the role as a trusted entity.

    The following example shows a correctly configured IRSA role:

    - Permission Policy:
    
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
    - Role with a Trust Policy:
    
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
    user with access to CloudWatch only with your $SERVICE_LONG:

    1. Retrieve the user information from [IAM > Users in AWS console][list-iam-users].

       If you do not have an AWS user with access restricted to CloudWatch only,
       [create one][create-an-iam-user].
       For more information, see [Creating IAM users (console)][aws-access-keys].

    1. Enter the credentials for the AWS IAM user.

       AWS keys give access to your AWS services. To keep your AWS account secure, restrict users to the minimum required permissions. Always store your keys in a safe location. To avoid this issue, use the IAM role authentication method.

    </Procedure>

    </Tab>

    </Tabs> 

1. Select the AWS Region your CloudWatch services run in, then click `Create exporter`.

</Procedure>

[console-integrations]: https://console.cloud.timescale.com/dashboard/integrations
[console-cloudwatch-configuration]: https://console.aws.amazon.com/cloudwatch/home#logsV2:log-groups
[console-cloudwatch-create-group]: https://console.aws.amazon.com/cloudwatch/home#logsV2:log-groups/create-log-group
[cloudwatch-log-naming]: https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Working-with-log-groups-and-streams.html
[cross-account-iam-roles]: https://aws.amazon.com/blogs/containers/cross-account-iam-roles-for-kubernetes-service-accounts/
[reference]: #reference
[list-iam-users]: https://console.aws.amazon.com/iam/home#/users
[create-an-iam-user]: https://console.aws.amazon.com/iam/home#/users/create
[aws-access-keys]: https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html#id_users_create_console
[irsa]: https://aws.amazon.com/blogs/opensource/introducing-fine-grained-iam-roles-service-accounts/