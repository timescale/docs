<Procedure>

1.  **In $CONSOLE, open [Exporters][console-integrations]**
1.  **Click `New exporter`**
1.  **Select the data type and specify `AWS CloudWatch` for provider**

    ![Add CloudWatch data exporter](https://assets.timescale.com/docs/images/tiger-cloud-console/tiger-console-integrations-cloudwatch.png)

1.  **Provide your AWS CloudWatch configuration**

    - The AWS region must be the same for your $CLOUD_LONG exporter and AWS CloudWatch Log group.
    - The exporter name appears in $CONSOLE, best practice is to make this name easily understandable.
    - For CloudWatch credentials, either use an [existing CloudWatch Log group][console-cloudwatch-configuration]
      or [create a new one][console-cloudwatch-create-group]. If you're uncertain, use
      the default values. For more information, see [Working with log groups and log streams][cloudwatch-log-naming].

1.  **Choose the authentication method to use for the exporter**

    ![Add CloudWatch authentication](https://assets.timescale.com/docs/images/tiger-cloud-console/tiger-cloud-integrations-cloudwatch-authentication.png)

    <Tabs label="Authentication methods" persistKey="authentication">

    <Tab title="IAM role" label="iam">

    <Procedure>
    
    1. In AWS, navigate to [IAM > Identity providers][create-an-iam-id-provider], then click `Add provider`.

    1. Update the new identity provider with your details:

       Set `Provider URL` to the [region where you are creating your exporter][reference].

       ![oidc provider creation](https://assets.timescale.com/docs/images/aws-create-iam-oicd-provider.png)

    1. Click `Add provider`.

    1. In AWS, navigate to [IAM > Roles][add-id-provider-as-wi-role], then click `Create role`. 

    1. Add your identity provider as a Web identity role and click `Next`.

        ![web identity role creation](https://assets.timescale.com/docs/images/aws-create-role-web-identity.png)

    1. Set the following permission and trust policies:

       - Permission policy:
    
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
      1. Click `Add role`. 

    </Procedure>

    </Tab>

    <Tab title="CloudWatch credentials" label="cloudwatch">

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

[add-id-provider-as-wi-role]: https://console.aws.amazon.com/iam/home#/roles
[aws-access-keys]: https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html#id_users_create_console
[cloudwatch-log-naming]: https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Working-with-log-groups-and-streams.html
[console-cloudwatch-configuration]: https://console.aws.amazon.com/cloudwatch/home#logsV2:log-groups
[console-cloudwatch-create-group]: https://console.aws.amazon.com/cloudwatch/home#logsV2:log-groups/create-log-group
[console-integrations]: https://console.cloud.timescale.com/dashboard/integrations
[create-an-iam-id-provider]: https://console.aws.amazon.com/iam/home#/identity_providers
[create-an-iam-user]: https://console.aws.amazon.com/iam/home#/users/create
[list-iam-users]: https://console.aws.amazon.com/iam/home#/users
[reference]: /use-timescale/:currentVersion:/metrics-logging/aws-cloudwatch/#reference
