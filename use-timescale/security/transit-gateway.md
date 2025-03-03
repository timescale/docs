---
title: Peer your Timescale Cloud services with AWS Transit Gateway
excerpt: Securely connect to your Timescale Cloud services from AWS, GCP, Azure, or any other cloud or on-premise environment 
products: [cloud]
keywords: [AWS, transit gateway]
tags: [aws]
cloud_ui:
    path:
        - [services, :serviceId, operations, vpc]
---

# Peer your $SERVICE_LONGs with AWS Transit Gateway

You use [AWS Transit Gateway][aws-transit-gateway] as a traffic controller for your network. Instead of setting up lots of direct connections to virtual private clouds, on-premise data centers, and other AWS services, you connect everything to Transit Gateway. This simplifies your network and makes it easier to manage and scale.

You can create a peering connection between your $SERVICE_LONGs and AWS Transit Gateway in $CLOUD_LONG. This means that, no matter how big or complex your infrastructure is, you can connect securely to your $SERVICE_LONGs. 

To configure this secure connection, you:

1. Connect your infrastructure to AWS Transit Gateway.
1. Create a $CLOUD_LONG Peering $VPC with a peering connection to your AWS Transit Gateway.
1. Accept and configure the peering connection on your side.
1. Attach individual $SERVICE_SHORTs to the Peering $VPC.

Transit Gateway feature is available for Scale and Enterprise [pricing plans][pricing-plans].

While AWS Transit Gateway enables you to connect from almost any environment, this page provides examples for the most common use cases. 

<Tabs label="Connect from any cloud">

<Tab title="AWS">

<Procedure>

1. **Create a Peering $VPC in [$CONSOLE][console-login]**

    1. In `Security` > `VPC`, click `Create a VPC`:

       ![$CLOUD_LONG new $VPC](https://assets.timescale.com/docs/images/add-peering-vpc.png)

    1.  Choose your region and IP range, name your VPC, then click `Create VPC`:

       ![Create a new VPC in $CLOUD_LONG](https://assets.timescale.com/docs/images/configure-peering-vpc.png)

       Your $SERVICE_SHORT and Peering $VPC must be in the same AWS region. The number of Peering $VPCs you can create in your project depends on your [pricing plan][pricing-plans]. If you need another Peering $VPC, either contact [support@timescale.com](mailto:support@timescale.com) or change your pricing plan in [$CONSOLE][console-login].

    1.  Add a peering connection:

        1. In the `VPC Peering` column, click `Add`.
        1. Provide your AWS account ID, Transit Gateway ID, CIDR ranges, and AWS region.
        1. Click `Add connection`.

        ![Add peering](https://assets.timescale.com/docs/images/add-peering.png)

1. **Accept and configure peering connection in your AWS account**

   Once your peering connection appears as `Processing`, you can accept and configure it in AWS:

    1. Accept the peering request coming from $CLOUD_LONG. The request can take up to 5 min to arrive. Within 5 more minutes after accepting, the peering should appear as `Connected` in $CONSOLE.

    1. Configure at least the following in yur AWS account networking:

        - Your subnet route table to route traffic to your Transit Gateway for the Peering VPC CIDRs.
        - Your Transit Gateway route table to route traffic to the newly created Transit Gateway peering attachment for the Peering VPC CIDRs.
        - Security groups to allow outbound TCP 5432.

1. **Attach a $CLOUD_LONG service to the Peering VPC In [$CONSOLE][console-services]**

    1. Select the $SERVICE_SHORT you want to connect to the Peering VPC.
    1. Click `Operations` > `Security` > `VPC`.
    1. Select the VPC, then click `Attach VPC`.

   You cannot attach a $SERVICE_LONG to multiple $CLOUD_LONG $VPCs at the same time.

</Procedure>

</Tab>

<Tab title="Microsoft Azure">

<Procedure>

1. **Connect your infrastructure to AWS Transit Gateway**

    Establish connectivity between Azure and AWS. See [AWS architectural documentation][azure-aws] for details. 

1. **Create a Peering $VPC in [$CONSOLE][console-login]**

    1. In `Security` > `VPC`, click `Create a VPC`:

       ![$CLOUD_LONG new $VPC](https://assets.timescale.com/docs/images/add-peering-vpc.png)

    1.  Choose your region and IP range, name your VPC, then click `Create VPC`:

    ![Create a new VPC in $CLOUD_LONG](https://assets.timescale.com/docs/images/configure-peering-vpc.png)

    Your $SERVICE_SHORT and Peering $VPC must be in the same AWS region. The number of Peering $VPCs you can create in your project depends on your [pricing plan][pricing-plans]. If you need another Peering $VPC, either contact [support@timescale.com](mailto:support@timescale.com) or change your pricing plan in [$CONSOLE][console-login]. 

    1.  Add a peering connection:

        1. In the `VPC Peering` column, click `Add`.
        1. Provide your AWS account ID, Transit Gateway ID, CIDR ranges, and AWS region.
        1. Click `Add connection`.

        ![Add peering](https://assets.timescale.com/docs/images/add-peering.png)

1. **Accept and configure peering connection in your AWS account**

   Once your peering connection appears as `Processing`, you can accept and configure it in AWS:

    1. Accept the peering request coming from $CLOUD_LONG. The request can take up to 5 min to arrive. Within 5 more minutes after accepting, the peering should appear as `Connected` in $CONSOLE.

    1. Configure at least the following in yur AWS account networking:

        - Your subnet route table to route traffic to your Transit Gateway for the Peering VPC CIDRs.
        - Your Transit Gateway route table to route traffic to the newly created Transit Gateway peering attachment for the Peering VPC CIDRs.
        - Security groups to allow outbound TCP 5432.

1. **Attach a $CLOUD_LONG service to the Peering VPC In [$CONSOLE][console-services]**

    1. Select the $SERVICE_SHORT you want to connect to the Peering VPC.
    1. Click `Operations` > `Security` > `VPC`.
    1. Select the VPC, then click `Attach VPC`.

   You cannot attach a $SERVICE_LONG to multiple $CLOUD_LONG $VPCs at the same time.

</Procedure>

</Tab>

<Tab title="Google Cloud Platform">

<Procedure>

1. **Connect your infrastructure to AWS Transit Gateway**

    Establish connectivity between Google Cloud Platform and AWS. See the [official documentation][gcp-aws]. 

1. **Create a Peering $VPC in [$CONSOLE][console-login]**

    1. In `Security` > `VPC`, click `Create a VPC`:

       ![$CLOUD_LONG new $VPC](https://assets.timescale.com/docs/images/add-peering-vpc.png)

    1.  Choose your region and IP range, name your VPC, then click `Create VPC`:

    ![Create a new VPC in $CLOUD_LONG](https://assets.timescale.com/docs/images/configure-peering-vpc.png)

    Your $SERVICE_SHORT and Peering $VPC must be in the same AWS region. The number of Peering $VPCs you can create in your project depends on your [pricing plan][pricing-plans]. If you need another Peering $VPC, either contact [support@timescale.com](mailto:support@timescale.com) or change your pricing plan in [$CONSOLE][console-login].

    1.  Add a peering connection:

        1. In the `VPC Peering` column, click `Add`.
        1. Provide your AWS account ID, Transit Gateway ID, CIDR ranges, and AWS region.
        1. Click `Add connection`.

        ![Add peering](https://assets.timescale.com/docs/images/add-peering.png)

1. **Accept and configure peering connection in your AWS account**

   Once your peering connection appears as `Processing`, you can accept and configure it in AWS:

    1. Accept the peering request coming from $CLOUD_LONG. The request can take up to 5 min to arrive. Within 5 more minutes after accepting, the peering should appear as `Connected` in $CONSOLE.

    1. Configure at least the following in yur AWS account networking:

        - Your subnet route table to route traffic to your Transit Gateway for the Peering VPC CIDRs.
        - Your Transit Gateway route table to route traffic to the newly created Transit Gateway peering attachment for the Peering VPC CIDRs.
        - Security groups to allow outbound TCP 5432.

1. **Attach a $CLOUD_LONG service to the Peering VPC In [$CONSOLE][console-services]**

    1. Select the $SERVICE_SHORT you want to connect to the Peering VPC.
    1. Click `Operations` > `Security` > `VPC`.
    1. Select the VPC, then click `Attach VPC`.

   You cannot attach a $SERVICE_LONG to multiple $CLOUD_LONG $VPCs at the same time.

</Procedure>

</Tab>

<Tab title="On-premise">

<Procedure>

1. **Connect your infrastructure to AWS Transit Gateway**

   Establish connectivity between your on-premise infrastructure and AWS. See the [official documentation][aws-onprem].

1. **Create a Peering $VPC in [$CONSOLE][console-login]**

    1. In `Security` > `VPC`, click `Create a VPC`:

       ![$CLOUD_LONG new $VPC](https://assets.timescale.com/docs/images/add-peering-vpc.png)

    1.  Choose your region and IP range, name your VPC, then click `Create VPC`:

   ![Create a new VPC in $CLOUD_LONG](https://assets.timescale.com/docs/images/configure-peering-vpc.png)

   Your $SERVICE_SHORT and Peering $VPC must be in the same AWS region. The number of Peering $VPCs you can create in your project depends on your [pricing plan][pricing-plans]. If you need another Peering $VPC, either contact [support@timescale.com](mailto:support@timescale.com) or change your pricing plan in [$CONSOLE][console-login].

    1.  Add a peering connection:

        1. In the `VPC Peering` column, click `Add`.
        1. Provide your AWS account ID, Transit Gateway ID, CIDR ranges, and AWS region.
        1. Click `Add connection`.

        ![Add peering](https://assets.timescale.com/docs/images/add-peering.png)

1. **Accept and configure peering connection in your AWS account**

   Once your peering connection appears as `Processing`, you can accept and configure it in AWS:

    1. Accept the peering request coming from $CLOUD_LONG. The request can take up to 5 min to arrive. Within 5 more minutes after accepting, the peering should appear as `Connected` in $CONSOLE.

    1. Configure at least the following in yur AWS account networking:

        - Your subnet route table to route traffic to your Transit Gateway for the Peering VPC CIDRs.
        - Your Transit Gateway route table to route traffic to the newly created Transit Gateway peering attachment for the Peering VPC CIDRs.
        - Security groups to allow outbound TCP 5432.

1. **Attach a $CLOUD_LONG service to the Peering VPC In [$CONSOLE][console-services]**

    1. Select the $SERVICE_SHORT you want to connect to the Peering VPC.
    1. Click `Operations` > `Security` > `VPC`.
    1. Select the VPC, then click `Attach VPC`.

   You cannot attach a $SERVICE_LONG to multiple $CLOUD_LONG $VPCs at the same time.

</Procedure>

</Tab>

</Tabs>

You can now securely access your $SERVICE_SHORTs in $CLOUD_LONG. 

[aws-transit-gateway]: https://aws.amazon.com/transit-gateway/
[pricing-plans]: /about/:currentVersion:/pricing-and-account-management/
[console-login]: https://console.cloud.timescale.com/
[console-services]: https://console.cloud.timescale.com/dashboard/services
[azure-aws]: https://aws.amazon.com/blogs/modernizing-with-aws/designing-private-network-connectivity-aws-azure/ 
[gcp-aws]: https://cloud.google.com/network-connectivity/docs/vpn/how-to/connect-ha-vpn-aws-peer-gateway
[aws-onprem]: https://docs.aws.amazon.com/prescriptive-guidance/latest/patterns/centralize-network-connectivity-using-aws-transit-gateway.html