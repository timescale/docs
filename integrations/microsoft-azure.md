---
title: Integrate Microsoft Azure with Tiger  
excerpt: Microsoft Azure enables you to build, deploy, and manage applications across cloud, hybrid, and edge environments. Integrate Microsoft Azure with Tiger using AWS Transit Gateway
products: [cloud]
price_plans: [scale, enterprise]
keywords: [Azure, integrations]
---

import IntegrationPrereqsCloud from "versionContent/_partials/_integration-prereqs-cloud-only.mdx";
import TransitGateway from "versionContent/_partials/_transit-gateway.mdx";
import NotSupportedAzure from "versionContent/_partials/_not-supported-for-azure.mdx";

# Integrate Microsoft Azure with $CLOUD_LONG

<Tabs label="Tiger Cloud on AWS and Azure" persistKey="tiger-platform-clouds">

<Tab title="Tiger Cloud on AWS" label="aws-cloud">

[Microsoft Azure][azure] is a cloud computing platform and services suite, offering infrastructure, AI, analytics, security, and developer tools to help businesses build, deploy, and manage applications.

This page explains how to integrate your Microsoft Azure infrastructure with $CLOUD_LONG using [AWS Transit Gateway][aws-transit-gateway].

## Prerequisites

<IntegrationPrereqsCloud />

- Set up [AWS Transit Gateway][gtw-setup].

## Connect your Microsoft Azure infrastructure to your $SERVICE_LONGs

To connect to $CLOUD_LONG:

<Procedure>

1. **Connect your infrastructure to AWS Transit Gateway**

   Establish connectivity between Azure and AWS. See the [AWS architectural documentation][azure-aws] for details.

<TransitGateway />

</Procedure>

You have successfully integrated your Microsoft Azure infrastructure with $CLOUD_LONG.

</Tab>

<Tab title="Tiger Cloud on Azure" label="azure-cloud">

<NotSupportedAzure />

</Tab>

</Tabs>

[aws-transit-gateway]: https://aws.amazon.com/transit-gateway/
[gtw-setup]: https://docs.aws.amazon.com/vpc/latest/tgw/tgw-getting-started.html
[azure]: https://azure.microsoft.com/en-gb/
[azure-aws]: https://aws.amazon.com/blogs/modernizing-with-aws/designing-private-network-connectivity-aws-azure/ 
