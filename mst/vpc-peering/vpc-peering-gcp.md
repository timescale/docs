---
title: Set up Virtual Private Cloud (VPC) peering on GCP
excerpt: Secure your Managed Service for TimescaleDB instance with VPC peering on GCP
products: [mst]
keywords: [vpc, peer, gcp]
---

# Configure VPC peering on GCP

You can Configure VPC peering for your Managed Service for TimescaleDB project,
using the VPC on GCP.

## Before you begin

*   Set up a VPC peering for your project in MST.
*   In your GCP console, click the project name and make a note of the `Project ID`.
*   In your GCP console, go to `VPC Networks`, find the VPC that you want to
    connect, and make a note of the network name for that VPC.

## Configuring a VPC peering on GCP

<Procedure>

To set up VPC peering for your project:

1.  In the MST portal, click `VPC` and select the VPC connection that you
    created.

1.  Type the project ID of your GCP project in `GCP Project ID`.

1.  Type the network name of the VPC in GCP in `GCP VPC network name`.

1.  Click `Add peering connection`.

    A new connection with the status as `Pending Peer` is listed in your GCP
    console. Make a note of the project name and the network name.

1.  In the GCP console go to `VPC` > `VPC network peering` and select
    `Create Connection`.
1.  Type a name for the peering connection and type the project ID and network
    name that you made a note of.
1.  Click `Create`.

After the peering is successful, it is active in both the MST portal and your
GCP console.

</Procedure>
