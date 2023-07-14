---
title: Set up Virtual Private Cloud (VPC) peering on AWS
excerpt: Secure your Managed Service for TimescaleDB instance with VPC peering on AWS
products: [mst]
keywords: [vpc, peer, aws]
---

# Configure VPC peering on AWS

You can Configure VPC peering for your Managed Service for TimescaleDB project,
using the VPC on AWS.

## Before you begin

*   Set up a VPC peering for your project in MST.
*   In your AWS console, go to `My Account` and make a note of your `account ID`.
*   In your AWS console, go to `Peering connections`, find the VPC that you want to
    connect, and make a note of the ID for that VPC.

## Configuring a VPC peering

<Procedure>

To set up VPC peering for your project:

1.  In the MST portal, click `VPC` and select the VPC connection that you
    created.

1.  Type the account ID of your AWS account in `AWS Account ID`.

1.  Type the ID of the VPC in AWS in `AWS VPC ID`.

1.  Click `Add peering connection`.

    A new connection with a status of `Pending Acceptance` is listed in your
    AWS console. Verify that the account ID and VPC ID match those listed in the
    MST portal.

1.  In the AWS console, go to `Actions` and select `Accept Request`. Update your
    AWS route tables to match your Aiven CIDR settings.

After you accept the request in AWS Console, the peering connection is active in
the MST portal.

</Procedure>
