---
title: Virtual Private Cloud
excerpt: Use VPC peering to secure your Timescale database
products: [cloud]
keywords: [vpc, services, operations]
tags: [aws]
cloud_ui:
    path:
        - [services, :serviceId, operations, vpc]
        - [vpc]
---

# Virtual Private Cloud

Timescale allows you to create a virtual private cloud (VPC) network
between an external cloud provider and your Timescale services. This
allows you to isolate your Timescale services so that they are only
accessible using your external cloud account, and is useful if you need to
improve security through a reduction in the potential attack vector surface.

When you have VPC peering set up in your external cloud provider, you can create
and configure your VPC peering connections in the Timescale console.
Timescale provides controls for adding and removing VPC peering
connections, migrating services to and from VPCs, and creating new services with
VPC peering attachments.

To use VPC peering, you need your own cloud VPC, where your
applications and infrastructure are already running. This section covers how to
get your VPC peering set up in Amazon Web Services (AWS). You can peer your VPC
from any AWS region, though the Timescale VPC itself must be within one of
the [Cloud-supported regions][tsc-regions].

You need to have these permissions on your cloud provider account to set up
VPC peering:

*   Accept VPC peering requests
*   Configure route table rules
*   Configure security group and firewall rules

By default, you can have three VPCs in each project. If you need more VPCs,
contact Support by clicking the `Support` button in the Timescale console and
ask for a quota increase. Each VPC can have as many peering connections as you
need.

<Highlight type="warning">
When you have attached your Timescale service to a VPC, it is no longer
accessible using the public internet. It is only accessible using a peered
AWS VPC.
</Highlight>

<Highlight type="cloud" header="Sign up for Timescale" button="Try for free">
</Highlight>

## Create a new VPC in Timescale

To begin, you need to create a new VPC in the Timescale console.

<Procedure>

### Creating a new VPC

<Highlight type="note">
You can create a VPC during your Timescale trial for free, but you need to
enter a valid payment method. You are not charged for the service until your
trial has finished.
</Highlight>

1.  [Log in to your Timescale account][cloud-login] and navigate to
    the `VPC` section.
1.  Click `Create VPC`.
1.  In the `Create a VPC` dialog:
    *   Type a name for your new VPC and select the region that matches the
        region of the service you want to attach it to.
    *   Provide an IPv4 CIDR block. Make sure that your VPC CIDR block has its
        mask in the range between 16 and 28 and that the CIDR block you choose
        for your Timescale VPC does not overlap with the CIDR block used
        by your AWS VPC peer. If the CIDR blocks overlap, the peering process
        fails. You can find the CIDR block of your AWS VPC from the AWS console.
        This example uses the `10.0.0.0/16` CIDR block.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-vpc-create.png" alt="Create a new Timescale VPC"/>

</Procedure>

## Create a peering connection

When you have created a Timescale VPC, you can create a peering connection
between your Timescale VPC and your AWS VPC.

<Procedure>

### Creating a peering connection

1.  [Log in to your Timescale account][cloud-login] and navigate to
    the `VPC` section. Click the name of the VPC you want to modify.
1.  In the `VPC Peering` column, click `Add`.
1.  Provide the AWS account ID, the VPC ID, and the AWS VPC region for the new
    peering connection.
1.  Click `Add peering connection` to begin the peering process.
1.  Repeat for each peering connection you require.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-vpc-addpeering.png" alt="Expand the VPC Peering dropdown menu and enter info"/>

</Procedure>

## Complete the VPC connection in AWS

When you create a peering connection in Timescale, the peering request is
sent to your AWS account for you to accept. When you have accepted the request,
you need to edit the routing table so that network traffic can flow between the
AWS VPC, and your Timescale services.

<Highlight type="warning">
The request acceptance process is an important safety mechanism. Do not accept a
peering connection from an unknown account.
</Highlight>

<Procedure>

### Completing the VPC connection in AWS

1.  [Log in to your AWS dashboard][aws-dashboard], and navigate
    to `Peering Connections` to accept the new peering connection request sent
    from Timescale.
1.  Take a note of the peering connection ID, which starts with `pcx-`.
1.  Navigate to the `Route Tables` section, and select the route table
    corresponding to your VPC.
1.  In the `Detail` menu, select the `Routes` tab, and click `Edit routes`.
1.  Click `Add route`, and complete these details:
    *   In the `Destination` column, type the CIDR block of the Timescale
        VPC you set up earlier.
    *   In the `Target` column, type the peering connection ID from the incoming
        peering connection, which starts with `pcx-`.
2.  Click `Save routes`.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/aws-vpc-routetable.png" alt="Route table on AWS"/>

</Procedure>

## Set up security groups in AWS

You need to create a security group within AWS that allows you to connect to any
of your Timescale services from the peered VPC. These instructions show
you how to create a new security group for your VPC, but you can also use an
existing security group if you already have one.

<Procedure>

### Setting up security groups in AWS

1.  [Log in to your AWS dashboard][aws-dashboard], and navigate
    to `Security Groups`.
1.  Click `Create security group`, and complete these details:
    *   In the `Security group name` field, type a name for your security group.
    *   In the `VPC` field, select the VPC that is peered with your Timescale
        Cloud VPC.
    *   Leave the `Inbound rules` section empty.
    *   In the `Outbound rules` section, select `Custom TCP` for the rule
        type, `TCP` for the protocol, and `5432` for the port. Select `Custom`
        for the destination, and type the CIDR block of your Timescale
        VPC.
1.  Click `Add rule`.
1.  Click `Create security group`.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/aws-vpc-securitygroup.png" alt="The AWS Security Groups dashboard"/>

</Procedure>

## Create a Timescale service with VPC attachment

Now that your VPC peering connection is set up, you can create a new Timescale
Cloud service with the VPC attachment.

<Procedure>

### Creating a Timescale service with VPC attachment

1.  [Log in to your Timescale account][cloud-login] and navigate to
    the `Services` section. Click `Create service` and select the compute and
    disk size as required for your database.
1.  In the `Select a VPC` section, expand the dropdown menu, and select the VPC
    you created earlier.
1.  Click `Create Service`.

</Procedure>

## Migrating a VPC service between networks

In most cases, when you have connected a service to a VPC, you need to keep it
attached to ensure that your applications continue to run without interruption.
However, you can migrate Timescale services between VPCs within a project,
or migrate them to and from the public network, if you need to.

<Highlight type="warning">
Timescale uses a different DNS name for a Timescale service once it has
been attached to a VPC. This means that you need to update your connection
string if you are migrating a service between the public internet and a VPC.
</Highlight>

Before you begin, ensure you already have your VPC connection set up.

<Procedure>

### Migrating Timescale services to or between VPCs

1.  [Log in to your Timescale account][cloud-login] and navigate to
    the `Services` section. Click the name of the service you want to migrate.
1.  In the `Operations` tab, navigate to the `VPC` section, and select the new
    VPC to attach the service to. The migration can take a few minutes to
    complete, and your services are not accessible during this time.

<Highlight type="important">
Migrating your services to a VPC requires a change to the DNS settings for the
service. If you receive a DNS error, allow some more time for DNS propagation to
complete.
</Highlight>

</Procedure>

[aws-dashboard]: https://console.aws.amazon.com/vpc/home#PeeringConnections:
[cloud-login]: https://console.cloud.timescale.com/
[timescale-support]: https://www.timescale.com/contact/
[tsc-regions]: /use-timescale/:currentVersion:/regions/
