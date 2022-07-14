---
title: VPC peering
excerpt: Secure your Managed Service for TimescaleDB instance with VPC peering
product: mst
keywords: [vpc, peer]
---

# VPC peering
Virtual Private Cloud (VPC) peering is a method of connecting separate
Cloud private networks to each other. It makes it possible for the
virtual machines in the different VPC's to talk to each other directly without
going through the public internet. VPC peering is limited to VPCs that share the same Cloud provider.

VPC peering setup is a per project and per region setting. This means that all
services created and running utilize the same VPC peering connection. If needed,
you can have multiple projects that peer with different connections.

<highlight type="tip">
Services are only accessible via your VPC's internal network, they are not
accessible from the public internet. TLS certificates for VPC peered services are
signed by the Timescale project CA and cannot be validated against a public CA
(Let's Encrypt). You can choose service-by-service whether you want to run on VPC
peered network or on public internet.
</highlight>

## Setting it up
To set up VPC peering for your Managed Service for TimescaleDB project, submit a
request in the VPC section of the dashboard.

When creating a new service, you can choose whether the service is placed
in a VPC or not: The list of cloud providers and regions contains options like
"Belgium - Google Cloud: Belgium" and "Belgium - Google Cloud: Belgium - Project
VPC." Here selecting the former would create the service to non-VPC environment
while the latter would place the service within the VPC. The same functionality
is available with the "Migrate" feature, allowing moving a service to and from a
VPC.

The IP Range should be chosen so that it doesn't overlap with any networks you
wish to peer. For example, if your own networks use the 10.0.0.0/8 range,
selecting 192.168.0.0/24 for your Timescale project VPC makes it possible to
peer the networks.

Peering connections can be requested with the VPC request, or added later. Note
however that the VPC is not accessible until at least one connection has been
created.

After the request has been submitted VPC peering is automatically set up by
Managed Service for TimescaleDB, and the status is updated in the web console's
VPC view together with instructions for starting peering with our network. Note
that you'll need to accept a VPC peering connection request (AWS) or create a
corresponding peering from your project to Managed Service for TimescaleDB's
(Google) before Managed Service for TimescaleDB's backend can notice the peering
is ready and traffic can be routed through it. After setting up your side, the
VPC peering activates shortly on the Managed Service for TimescaleDB console.

When you have submitted a VPC peering request, you can find cloud-specific
identification details for your VPC by hovering your mouse over the `pending
peer` status message of the peering request. The details show in a popup dialog.
