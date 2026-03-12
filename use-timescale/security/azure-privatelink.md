---
title: Azure Private Link
excerpt: Azure Private Link ensures that your Tiger Cloud services are only accessible through your secured Azure infrastructure. Set up Private Link connections in Tiger Cloud Console
products: [cloud]
price_plans: [performance, scale, enterprise]
keywords: [PrivateLink, Azure, private endpoint, services, operations, security]
tags: [azure, security]
cloud_ui:
    path:
        - [services, :serviceId, operations, azure-privatelink]
---

import AzurePrivateLink from "versionContent/_partials/_azure-privatelink.mdx";
import NotSupportedAws from "versionContent/_partials/_not-supported-for-aws.mdx";

# Secure your $CLOUD_LONG services with Azure Private Link

Azure Private Link creates a private connection between your Azure Virtual Network and $SERVICE_LONGs hosted on Azure, eliminating exposure to the public internet. Applications in your Azure VNet connect to a Private Endpoint with a private IP address, which links to $CLOUD_LONG. Once connected, your $SERVICE_SHORTs become accessible only through the Private Endpoint, providing enhanced security, reduced attack surface, and compliance with data isolation requirements.

<NotSupportedAws />

<AzurePrivateLink />

[azure-privatelink-architecture]: https://assets.timescale.com/docs/images/tiger-cloud-console/azure-privatelink-architecture.svg