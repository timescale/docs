---
title: Integrate Google Cloud with Tiger Cloud
excerpt: Google Cloud enables you to deploy, manage, and scale cloud-based applications, databases, and data processing workflows. Integrate Google Cloud with Tiger Cloud using AWS Transit Gateway
products: [cloud]
price_plans: [scale, enterprise]
keywords: [Google Cloud, integrations]
---

import IntegrationPrereqsCloud from "versionContent/_partials/_integration-prereqs-cloud-only.mdx";
import TransitGateway from "versionContent/_partials/_transit-gateway.mdx";

# Integrate Google Cloud with $CLOUD_LONG

[Google Cloud][google-cloud] is a suite of cloud computing services, offering scalable infrastructure, AI, analytics, databases, security, and developer tools to help businesses build, deploy, and manage applications.

This page explains how to integrate your Google Cloud infrastructure with $CLOUD_LONG using [AWS Transit Gateway][aws-transit-gateway].

## Prerequisites

<IntegrationPrereqsCloud />

- Set up [AWS Transit Gateway][gtw-setup].

## Connect your Google Cloud infrastructure to your $SERVICE_LONGs

To connect to $CLOUD_LONG:

<Procedure>

1. **Connect your infrastructure to AWS Transit Gateway**

    Establish connectivity between Google Cloud and AWS. See [Connect HA VPN to AWS peer gateways][gcp-aws].

<TransitGateway />

</Procedure>

You have successfully integrated your Google Cloud infrastructure with $CLOUD_LONG.

[google-cloud]: https://cloud.google.com/?hl=en
[aws-transit-gateway]: https://aws.amazon.com/transit-gateway/
[gtw-setup]: https://docs.aws.amazon.com/vpc/latest/tgw/tgw-getting-started.html
[gcp-aws]: https://cloud.google.com/network-connectivity/docs/vpn/how-to/connect-ha-vpn-aws-peer-gateway
