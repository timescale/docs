---
title: Integrate Microsoft Azure with Tiger Cloud
excerpt: Microsoft Azure enables you to build, deploy, and manage applications across cloud, hybrid, and edge environments. Integrate Microsoft Azure with Tiger Cloud using AWS Transit Gateway
products: [cloud]
price_plans: [scale, enterprise]
keywords: [Azure, integrations]
---

import IntegrationPrereqsCloud from "versionContent/_partials/_integration-prereqs-cloud-only.mdx";
import TransitGateway from "versionContent/_partials/_transit-gateway.mdx";
import AzurePrivateLink from "versionContent/_partials/_azure-privatelink.mdx";

# Integrate Microsoft Azure with $CLOUD_LONG


[Microsoft Azure][azure] is a cloud computing platform and services suite, offering infrastructure, AI, analytics, security, and developer tools to help businesses build, deploy, and manage applications.

<Tabs label="Tiger Cloud on AWS and Azure" persistKey="tiger-platform-clouds">

<Tab title="Tiger Cloud on AWS" label="aws-cloud">

This page explains how to integrate your Microsoft Azure infrastructure with $CLOUD_LONG on AWS using [AWS Transit Gateway][aws-transit-gateway].

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

<AzurePrivateLink />

</Tab>

</Tabs>

[aws-transit-gateway]: https://aws.amazon.com/transit-gateway/
[azure-aws]: https://aws.amazon.com/blogs/modernizing-with-aws/designing-private-network-connectivity-aws-azure/
[azure]: https://azure.microsoft.com/en-gb/
[gtw-setup]: https://docs.aws.amazon.com/vpc/latest/tgw/tgw-getting-started.html
