---
title: About security in Tiger Cloud
excerpt: Learn how Tiger Cloud protects your data with secure development practices, as well as configurable features that restrict access to your services
products: [cloud]
keywords: [security]
tags: [encryption, VPC, privacy]
---

import SecurityOverview from "versionContent/_partials/_security-overview.mdx";

# About security in $CLOUD_LONG

<Tabs label="Tiger Cloud on AWS and Azure" persistKey="tiger-platform-clouds">

<Tab title="Tiger Cloud on AWS" label="aws-cloud">

<SecurityOverview />

## Networking with Virtual Private Cloud (VPC) peering

When using VPC peering, **no public Internet-based access** is provided to the
$SERVICE_SHORT. $SERVICE_SHORT_CAP addresses are published in public DNS, but they can only be
connected to from the customer's peered VPC using private network addresses.

VPC peering only enables communication to be initiated from your Customer VPC to
$SERVICE_LONGs running in the $CLOUD_LONG VPC. $CLOUD_LONG cannot initiate
communication with your VPC. To learn how to set up VPC Peering, see
[Secure your $SERVICE_LONGs with VPC Peering and AWS PrivateLink][vpc-peering].

</Tab>

<Tab title="Tiger Cloud on Azure" label="azure-cloud">

<SecurityOverview />

</Tab>

</Tabs>


[timescale-privacy-policy]: https://www.timescale.com/legal/privacy
[tsc-tos]: https://www.timescale.com/legal/timescale-cloud-terms-of-service
[tsc-data-processor-addendum]: https://www.timescale.com/legal/timescale-cloud-data-processing-addendum
[aws-kms]: https://aws.amazon.com/kms/
[ec2-security]: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/data-protection.html
[ebs-security]: https://docs.aws.amazon.com/ebs/latest/userguide/ebs-encryption.html
[vpc-peering]: /use-timescale/:currentVersion:/security/vpc
[security-at-timescale]: https://www.timescale.com/security
[ip-allowlist]: /use-timescale/:currentVersion:/security/ip-allow-list/
[pricing-plan-features]: /about/:currentVersion:/pricing-and-account-management/#features-included-in-each-plan
