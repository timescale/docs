---
title: Set up Transit Gateway on AWS
excerpt: Secure your Managed Service for TimescaleDB instance with Transit Gateway  on AWS
products: [mst]
keywords: [vpc, peer, aws]
---

# Attach a VPC to an AWS Transit Gateway

AWS Transit Gateway (TGW) enables transitive routing from on-premises networks
through VPN and from other VPC. By creating a Transit Gateway VPC attachment,
services in an MST Project VPC can route traffic to all other networks
attached - directly or indirectly - to the Transit Gateway.

## Before you begin

*   Set up a [VPC peering for your project in MST][vpc-peering].
*   In your AWS console, go to `My Account` and make a note of your `account ID`.
*   In your AWS console, go to `Transit Gateways`, find the transit gateway that
    you want to attach, and make a note of the ID.

## Attaching a VPC to an AWS Transit Gateway

<Procedure>

To set up VPC peering for your project:

1.  In the MST portal, click `VPC` and select the VPC connection that you
    created.
1.  In the `VPC Peering connections` page select `Transit Gateway VPC Attachment`.

1.  Type the account ID of your AWS account in `AWS Account ID`.

1.  Type the ID of the transit gateway of AWS in `Transit Gateway ID`.

1.  Type the IP range in the `Network cidrs` field.

    Each Transit Gateway has a route table of its own, and by default routes
    traffic to each attached network directly to attached VPCs or indirectly
    through VPN attachments. The attached VPCs' route tables need to be updated
    to include the TGW as a target for any IP range (CIDR) that should be routed
    using the VPC attachment. These IP ranges must be configured when creating
    the attachment for an MST Project VPC.

1.  Click `Add peering connection`.

    A new connection with the status as `Pending Acceptance` is listed in your
    AWS console. Verify that the account ID and transit gateway ID match those
    listed in the MST portal.

1.  In the AWS console, go to `Actions` and select `Accept Request`. Update your
    AWS route tables to match your Timescale  CIDR settings.

After you accept the request in AWS Console, the peering connection is active in
the MST portal.

</Procedure>

[vpc-peering]: /mst/:currentVersion:/vpc-peering/vpc-peering
