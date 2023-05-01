---
title: Configure VPC peering 
excerpt: Secure your Managed Service for TimescaleDB instance with VPC peering
products: [mst]
keywords: [vpc, peer]
---

# Configure VPC peering

You can Configure VPC peering for your Managed Service for TimescaleDB project,
using the VPC section of the dashboard for your project. VPC peering setup is a
per project and per region setting. This means that all services created and
running utilize the same VPC peering connection. If needed, you can have
multiple projects that peer with different connections.

## Configuring a VPC peering

You can configure VPC peering as a project and region-specific setting. This
means that all services created and running use the same VPC peering connection.
If necessary, you can use different connections for VPC peering across multiple
projects. Only Admin and operator user roles can create a VPC.

<Procedure>

To set up VPC peering for your project:

1.  In the MST portal, click `VPC`.

1.  Click `Create VPC`.

1.  Choose a cloud provider in the `Cloud` list.

1.  In the `IP range` field, type the IP range that you want to use for the VPC connection.
    Use an IP range that does not overlap with any networks that you want to connect
    through VPC peering. For example, if your own networks use the range 10.0.0.0/8,
    you could set the range for your Timescale project VPC to 192.168.0.0/24.

1.  Click `Create VPC`.

The state of the VPC is listed in the table.

</Procedure>
