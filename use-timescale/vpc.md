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
between an external cloud provider and your Timescale services. 

<Highlight type="cloud" header="Sign up for Timescale" button="Try for free">
</Highlight>

This
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

By default, you can have three VPCs in each project. If you need more VPCs,
contact Support by clicking the `Support` button in the Timescale console and
ask for a quota increase. Each VPC can have as many peering connections as you
need.


<Highlight type="note">
You are not charged for the VPC during your Timescale trial
</Highlight>



## Prerequisites

In order to set up VPC peering you need the following permissions in your AWS account:

*   Accept VPC peering requests
*   Configure route table rules
*   Configure security group and firewall rules

## Setup a secured connection between Timescale and AWS

- Setup VPCs and peering in Timescale
- Complete the VPC connection in AWS
- Set up security groups in AWS
- Create a Timescale Service with VPC attachment

### Setup VPCs and peering in Timescale

Create a Timescale VPC and the peering connection you use to connect the Timescale 
VPC to your AWS VPC.

<Procedure>

1.  In [Timescale Console > VPC][console-vpc], click `Create VPC`.
1.  Choose your region and IP range, then click `Create VPC`. 

    <img class="main-content__illustration"
    src="https://assets.timescale.com/docs/images/tsc-vpc-create.png" 
    alt="Create a new Timescale VPC"/>

1.  For as many peering connections as you need:

   1. In the `VPC Peering` column, click `Add`.
   2. Enter information about your existing AWS VPC, then click `Add Connection`.

        <img class="main-content__illustration"
        src="https://assets.timescale.com/docs/images/tsc-vpc-add-peering.png"
        alt="Create a new Timescale VPC"/>

Timescale sends a peering request to your AWS account so you can 
[complete the VPC connection][aws-vpc-complete].
</Procedure>


### Complete the VPC connection in AWS

To ensure that that network traffic flows securely, when you accept a peering request in AWS, 
you edit the routing table to match IP Range and CIDR block between your AWS and Timescale VPCs.

The request acceptance process is an important safety mechanism. Do not accept a
peering request from an unknown account.

<Procedure>

1. In [AWS > VPC Dashboard > Peering connections][aws-dashboard], accept the peering connection 
    request from Timescale.

    Take a note of the peering connection ID, which starts with `pcx-`.
 
1. For the peering connection, click  `Route Tables`, the select the `Route Table ID`
    corresponding to your VPC.
1.  Click `Routes`, then click `Edit routes`.
1. If you do not already have a route that corresponds to the `IP range / CIDR block` in your 
   Timescale VPN: 

   1.  Click `Edit routes` then `Add route`, and set :
       * `Destination`: the CIDR block of your Timescale VPC. For example: `10.0.0.7/17`.
       * `Target`: the peering connection ID you noted earlier.
   2.  Click `Save changes`.

Network traffic is secured between your AWS account and Timescale for this project. 
</Procedure>

### Set up security groups in AWS

You need to create a security group within AWS that allows you to connect to any
of your Timescale services from the peered VPC. These instructions show
you how to create a new security group for your VPC, but you can also use an
existing security group if you already have one.

<Procedure>

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

<img class="main-content__illustration"
width={1375} height={944}
src="https://assets.timescale.com/docs/images/aws-vpc-securitygroup.webp"
alt="The AWS Security Groups dashboard"/>

</Procedure>

### Connect a Timescale Service to your VPC

Now that your VPC peering connection is set up, you can create a new Timescale
Cloud service with the VPC attachment.

<Highlight type="warning">
When you attach a Timescale Service to a VPC, you can only access it using the peered
AWS VPC. It is no longer accessible using the public internet.
</Highlight>

<Procedure>

1.  In [Timescale Console > Services][console-services] select the Service you want to
    connect to the VPC. 
   If you don't have a Timescale Service, [create a new one][create-service].
1. Click `Operations` > `VPC`.
1. Select the VPC, then click `Attach VPC`.

And that is it, your Timescale Service is now securely communicating securely with your AWS 
account only using a VPC. 
</Procedure>



### Migrate a VPC service between networks

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

1.  [Log in to your Timescale account][console-login] and navigate to
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
[console-login]: https://console.cloud.timescale.com/
[console-vpc]: https://console.cloud.timescale.com/dashboard/vpc
[console-services]: https://console.cloud.timescale.com/dashboard/services
[timescale-support]: https://www.timescale.com/contact/
[tsc-regions]: /use-timescale/:currentVersion:/regions/
[aws-vpc-complete]: /use-timescale/:currentVersion:/vpc/#complete-the-vpc-connection-in-aws
[create-service]: /getting-started/:currentVersion:/services/#create-a-timescale-service