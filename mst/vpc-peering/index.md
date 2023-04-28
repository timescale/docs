---
title: VPC peering
excerpt: Secure your Managed Service for TimescaleDB instance with VPC peering
products: [mst]
keywords: [vpc, peer]
---

# VPC peering

Virtual Private Cloud (VPC) peering is a method of connecting separate Cloud
private networks to each other. It makes it possible for the virtual machines in
the different VPCs to talk to each other directly without going through the
public internet. VPC peering is limited to VPCs that share the same Cloud
provider.

VPC peering setup is a per project and per region setting. This means that all
services created and running utilize the same VPC peering connection. If needed,
you can have multiple projects that peer with different connections.

<Highlight type="tip">
Services are only accessible via your VPC's internal network, they are not
accessible from the public internet. TLS certificates for VPC peered services are
signed by the Timescale project CA and cannot be validated against a public CA
(Let's Encrypt). You can choose service-by-service whether you want to run on VPC
peered network or on public internet.
</Highlight>

You can set up VPC peering on:

*   [Amazon Web Services (AWS)] [vpc-aws]
*   [Google Cloud Platform (GCP)] [vpc-gcp]
*   [Microsoft Azure] [vpc-azure]

[vpc-aws]: /mst/:currentVersion:/vpc-peering/vpc-peering-aws
[vpc-gcp]: /mst/:currentVersion:/vpc-peering/vpc-peering-gcp
[vpc-azure]: /mst/:currentVersion:/vpc-peering/vpc-peering-azure
