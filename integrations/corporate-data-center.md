---
title: Integrate your data center with Tiger Cloud 
excerpt: Integrate your on-premise data center with Tiger Cloud using AWS Transit Gateway
products: [cloud]
price_plans: [scale, enterprise]
keywords: [on-premise, integrations]
---

import IntegrationPrereqsCloud from "versionContent/_partials/_integration-prereqs-cloud-only.mdx";
import TransitGateway from "versionContent/_partials/_transit-gateway.mdx";
import NotSupportedAzure from "versionContent/_partials/_not-supported-for-azure.mdx";

# Integrate your data center with $CLOUD_LONG

<Tabs label="Tiger Cloud on AWS and Azure" persistKey="tiger-platform-clouds">

<Tab title="Tiger Cloud on AWS" label="aws-cloud">

This page explains how to integrate your corporate on-premise infrastructure with $CLOUD_LONG using [AWS Transit Gateway][aws-transit-gateway].

## Prerequisites

<IntegrationPrereqsCloud />

- Set up [AWS Transit Gateway][gtw-setup].

## Connect your on-premise infrastructure to your $SERVICE_LONGs

To connect to $CLOUD_LONG:

<Procedure>

1. **Connect your infrastructure to AWS Transit Gateway**

   Establish connectivity between your on-premise infrastructure and AWS. See the [Centralize network connectivity using AWS Transit Gateway][aws-onprem].

<TransitGateway />

</Procedure>

You have successfully integrated your corporate data center with $CLOUD_LONG.

</Tab>

<Tab title="Tiger Cloud on Azure" label="azure-cloud">

<NotSupportedAzure />

</Tab>

</Tabs>


[aws-transit-gateway]: https://aws.amazon.com/transit-gateway/
[gtw-setup]: https://docs.aws.amazon.com/vpc/latest/tgw/tgw-getting-started.html
[aws-onprem]: https://docs.aws.amazon.com/prescriptive-guidance/latest/patterns/centralize-network-connectivity-using-aws-transit-gateway.html
