# VPC Peering with AWS in Timescale Forge

Timescale Forge allows you to create a private network peering connection between
your cloud VPC and the Timescale Forge cloud infrastructure where your Timescale
services are hosted.

VPC peering isolates your Timescale Forge services ensuring that they are only
accessible via your peered VPC, offering greater security due to a reduced
attack vector surface.

The Timescale Forge console makes creating and configuring your VPC peering connections
simple. It provides controls for adding and removing VPC peering connections, migrating
services to and from VPCs, and creating new services with VPC peering attachments.

## Requirements and limitations
To use Timescale Forge VPC peering, you need your own cloud VPC, where your
applications and infrastructure are already running.

If you do not have administrative access to your cloud provider account, you will need
to work with someone from your team with sufficient permissions to:

- accept VPC peering requests,
- configure route table rules,
- configure security group and firewall rules.

<highlight type="tip">
Timescale Forge defaults to a limit of 3 VPCs per project. If you need more VPCs,
you may contact support to request a quota increase.
</highlight>

<highlight type="warning">
Once you have attached your Timescale Forge service to a VPC, it will no longer be accessible
via the public internet. It will only be accessible via your AWS VPC which has been peered
with your Timescale Forge VPC.
</highlight>