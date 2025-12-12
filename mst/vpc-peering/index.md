---
title: VPC peering
excerpt: Virtual Private Cloud peering is a method of connecting separate cloud private networks to each other. Secure your Managed Service for TimescaleDB service with VPC peering
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
$MST_SERVICE_SHORTs created and running utilize the same VPC peering connection. If needed,
you can have multiple projects that peer with different connections.

<Highlight type="note">

$MST_SERVICE_LONGs are only accessible using your VPC's internal network. They are not
accessible from the public internet. TLS certificates for VPC peered $MST_SERVICE_SHORTs are
signed by the $MST_SHORT project CA and cannot be validated against a public CA
(Let's Encrypt). You can choose whether you want to run on a VPC
peered network or on the public internet for every $MST_SERVICE_SHORT.

</Highlight>

You can set up VPC peering on:

*   [Amazon Web Services (AWS)] [vpc-aws]
*   [Google Cloud Platform (GCP)] [vpc-gcp]
*   [Microsoft Azure] [vpc-azure]
