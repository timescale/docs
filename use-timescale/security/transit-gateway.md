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

import TransitGateway from "versionContent/_partials/_transit-gateway.mdx";

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

<TransitGateway />

</Procedure>

</Tab>

<Tab title="Microsoft Azure">

<Procedure>

1. **Connect your infrastructure to AWS Transit Gateway**

    Establish connectivity between Azure and AWS. See [AWS architectural documentation][azure-aws] for details. 

<TransitGateway />

</Procedure>

</Tab>

<Tab title="Google Cloud Platform">

<Procedure>

1. **Connect your infrastructure to AWS Transit Gateway**

    Establish connectivity between Google Cloud Platform and AWS. See the [official documentation][gcp-aws]. 

<TransitGateway />

</Procedure>

</Tab>

<Tab title="On-premise">

<Procedure>

1. **Connect your infrastructure to AWS Transit Gateway**

    Establish connectivity between your on-premise infrastructure and AWS. See the [official documentation][aws-onprem].

<TransitGateway />

</Procedure>

</Tab>

</Tabs>

You can now securely access your $SERVICE_SHORTs in $CLOUD_LONG. 

[aws-transit-gateway]: https://aws.amazon.com/transit-gateway/
[pricing-plans]: /about/:currentVersion:/pricing-and-account-management/
[azure-aws]: https://aws.amazon.com/blogs/modernizing-with-aws/designing-private-network-connectivity-aws-azure/ 
[gcp-aws]: https://cloud.google.com/network-connectivity/docs/vpn/how-to/connect-ha-vpn-aws-peer-gateway
[aws-onprem]: https://docs.aws.amazon.com/prescriptive-guidance/latest/patterns/centralize-network-connectivity-using-aws-transit-gateway.html