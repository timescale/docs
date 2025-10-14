---
title: Peer your Tiger services with AWS Transit Gateway
excerpt: Securely connect to your Tiger services from AWS, GCP, Azure, or any other cloud or on-premise environment 
products: [cloud]
price_plans: [scale, enterprise]
keywords: [AWS, transit gateway]
tags: [aws]
cloud_ui:
    path:
        - [services, :serviceId, operations, vpc]
---

import TransitGateway from "versionContent/_partials/_transit-gateway.mdx";
import NotSupportedAzure from "versionContent/_partials/_not-supported-for-azure.mdx";

# Securely connect to $CLOUD_LONG using AWS Transit Gateway

[AWS Transit Gateway][aws-transit-gateway] enables you to securely connect to your $CLOUD_LONG from AWS, Google Cloud, Microsoft Azure, or any other cloud or on-premise environment.

<NotSupportedAzure />

You use AWS Transit Gateway as a traffic controller for your network. Instead of setting up multiple direct connections to different clouds, on-premise data centers, and other AWS services, you connect everything to AWS Transit Gateway. This simplifies your network and makes it easier to manage and scale.

You can then create a peering connection between your $SERVICE_LONGs and AWS Transit Gateway in $CLOUD_LONG. This means that, no matter how big or complex your infrastructure is, you can connect securely to your $SERVICE_LONGs. 

For enhanced security, you can add peering connections to multiple Transit Gateways with overlapping CIDRs—$CLOUD_LONG creates a new isolated connection for every unique Transit Gateway ID. Otherwise, the existing connection is reused for your $SERVICE_SHORTs in the same project and region. 

To configure this secure connection, you:

1. Connect your infrastructure to AWS Transit Gateway.
1. Create a $CLOUD_LONG Peering $VPC with a peering connection to AWS Transit Gateway.
1. Accept and configure the peering connection on your side.
1. Attach individual $SERVICE_SHORTs to the Peering $VPC.

AWS Transit Gateway enables you to connect from almost any environment, this page provides examples for the most common use cases. 

<Tabs label="Connect from any cloud" persistKey="source-cloud" >

<Tab title="Amazon Web Services" label="aws">

<Procedure>

<TransitGateway />

</Procedure>

</Tab>

<Tab title="Microsoft Azure" label="ms-azure">

<Procedure>

1. **Connect your infrastructure to AWS Transit Gateway**

    Establish connectivity between Azure and AWS. See the [AWS architectural documentation][azure-aws] for details. 

<TransitGateway />

</Procedure>

</Tab>

<Tab title="Google Cloud" label="google-cloud">

<Procedure>

1. **Connect your infrastructure to AWS Transit Gateway**

    Establish connectivity between Google Cloud and AWS. See [Connect HA VPN to AWS peer gateways][gcp-aws]. 

<TransitGateway />

</Procedure>

</Tab>

<Tab title="On-premise" label="on-premise">

<Procedure>

1. **Connect your infrastructure to AWS Transit Gateway**

    Establish connectivity between your on-premise infrastructure and AWS. See the [Centralize network connectivity using AWS Transit Gateway][aws-onprem].

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
