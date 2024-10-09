---
title: Virtual Private Cloud
excerpt: Use a Peering VPC and AWS PrivateLink to secure your $SERVICE_LONG
products: [cloud]
keywords: [PrivateLink, AWS, vpc, services, operations, ]
tags: [aws]
cloud_ui:
    path:
        - [services, :serviceId, operations, vpc]
---

# Secure your $CLOUD_LONG services with VPC Peering and AWS PrivateLink

You use Virtual Private Cloud ($VPC) peering to ensure that your $CLOUD_LONG services are 
only accessible through your secured AWS infrastructure. This reduces the potential 
attack vector surface and improves security.

The data isolation architecture that ensures a highly secure connection between your apps and 
$CLOUD_LONG:

<img class="main-content__illustration"
src="https://assets.timescale.com/docs/images/tsc-vpc-architecture.svg"
alt="The AWS Security Groups dashboard"/>

Your apps run inside your AWS Customer VPC, your services always run 
inside the secure $CLOUD_LONG $VPC. You control secure communication between apps in
your VPC and your services using a dedicated Peering VPC. The AWS PrivateLink connecting
$CLOUD_LONG $VPC to the dedicated Peering VPC gives the same level of protection as using a direct 
AWS PrivateLink connection. It only enables communication to be initiated from your Customer VPC 
to services running in the $CLOUD_LONG $VPC. $CLOUD_LONG cannot initiate communication with your VPC.

To configure this secure connection, you first create the Peering VPC with 
AWS PrivateLink in $CONSOLE. After you have accepted and configured the 
peering connection to your Customer VPC, you use AWS Security Groups to 
restrict the services in your Customer VPC that are visible to the Peering VPC.
The last step is to attach individual services to the Peering VPC. 

The number of VPCs you can attach to your project depends on your [pricing plan][pricing-plans]. If you 
need more VPCs either contact contact [support@timescale.com](mailto:support@timescale.com) or change your
pricing plan in $CONSOLE. Each $CLOUD_LONG VPC can have as many peering connections as you need.

## Prerequisites

In order to set up VPC peering you need the following permissions in your AWS account:

*   Accept VPC peering requests
*   Configure route table rules
*   Configure security group and firewall rules

## Set up a secured connection between $CLOUD_LONG and AWS

To connect to a $SERVICE_LONG using VPC peering, your apps and infrastructure must be already
running in an Amazon Web Services (AWS) VPC. You can peer your VPC from any AWS region.
However, your $CLOUD_LONG $VPC must be within one of the [Cloud-supported regions][tsc-regions].

The stages to create a secured connection between $CLOUD_LONG services and your AWS infrastructure are:

1. [Create a Peering VPC in $CONSOLE][aws-vpc-setup-vpc]
1. [Complete the VPC connection in your AWS][aws-vpc-complete]
1. [Set up security groups in your AWS][aws-vpc-security-groups]
1. [Attach a Timescale Service to the Peering VPC][aws-vpc-connect-vpcs]

### Create a Peering VPC in $CONSOLE

Create the VPC and the peering connection that enables you to securely route traffic 
between $CLOUD_LONG and your own VPC in a logically isolated virtual network.

<Procedure>

1.  In [$CONSOLE > VPC][console-vpc], click `New VPC`.

    The number of VPCs you can attach to your project depends on your [pricing plan][pricing-plans]. If you
    need more VPCs either contact contact [support@timescale.com](mailto:support@timescale.com) or change 
    your pricing plan in $CONSOLE. Each $CLOUD_LONG VPC can have as many peering connections as you need.

1.  Choose your region and IP range, then click `Create VPC`. 

    ![Create a new VPC in $CLOUD_LONG](https://assets.timescale.com/docs/images/tsc-vpc-create.png)

1.  For as many peering connections as you need:

    1. In the `VPC Peering` column, click `Add`.
    2. Enter information about your existing AWS VPC, then click `Add Connection`.

       ![Create a new $CLOUD_LONG $VPC](https://assets.timescale.com/docs/images/tsc-vpc-add-peering.png)

$CLOUD_LONG sends a peering request to your AWS account so you can 
[complete the VPC connection in AWS][aws-vpc-complete].
</Procedure>


### Complete the VPC connection in AWS
 
When you receive the $CLOUD_LONG peering request in AWS, edit your routing table to match 
the `IP Range` and `CIDR block` between your AWS and $CLOUD_LONG VPCs.

When you peer a VPC with multiple CIDRs, all CIDRs are added to the $CLOUD_LONG rules automatically.
After you have finished peering, further changes in your VPC's CIDRs are not detected automatically. 
If you need to refresh the CIDRs, please recreate the peering connection. 

The request acceptance process is an important safety mechanism. Do not accept a
peering request from an unknown account.

<Procedure>

1. In [AWS > VPC Dashboard > Peering connections][aws-dashboard], select the peering connection 
    request from $CLOUD_LONG.

    Copy the peering connection ID to the clipboard. The connection request starts with `pcx-`.
 
1. In the peering connection, click  `Route Tables`, then select the `Route Table ID`
    that corresponds to your VPC.
1.  In `Routes`, click `Edit routes`. You see the list of existing Destinations.

    ![Create a new VPC route](https://assets.timescale.com/docs/images/tsc-vpc-add-route.png).

    If you do not already have a destination that corresponds to the `IP range / CIDR block` of 
    your Timescale VPC: 

    1.  Click `Add route`, and set:
        * `Destination`: the CIDR block of your Timescale VPC. For example: `10.0.0.7/17`.
        * `Target`: the peering connection ID you copied to your clipboard.
    2.  Click `Save changes`.

Network traffic is secured between your AWS account and $CLOUD_LONG for this project. 
</Procedure>

### Set up security groups in AWS

Security groups allow specific inbound and outbound traffic at the resource level. 
You can associate a VPC with one or more security groups and each instance in your 
VPC may belong to a different set of security groups. The security group choices 
for your VPC are:

* Create a security group to use for your $CLOUD_LONG VPC only.
* Associate your VPC with an existing security group.
* Do nothing, your VPC is automatically associated with the default one.

<Procedure>

To create a security group specific to your $CLOUD_LONG VPC:

1. [AWS > VPC Dashboard > Security Groups][aws-security-groups], click `Create security group`.

1. Enter the rules for this security group:

   <img class="main-content__illustration"
   src="https://assets.timescale.com/docs/images/aws-vpc-securitygroup.webp"
   alt="The AWS Security Groups dashboard"/>

    *  `VPC`: select the VPC that is peered with Timescale.
    *  `Inbound rules`: leave empty.
    *  `Outbound rules`:
       * `Type`: `Custom TCP`
       * `Protocol`: `TCP`
       * `Port range`: `5432`
       * `Destination`: `Custom`
       * `Info`: the CIDR block of your $CLOUD_LONG VPC.
1.  Click `Add rule`, then click `Create security group`.

</Procedure>

### Attach a $CLOUD_LONG service to the Peering VPC

Now that $CLOUD_LONG is communicating securely with your AWS infrastructure, you can attach 
one or more services to the VPC. 

After you attach a $SERVICE_SHORT to a VPC, you can only access it through the peered
AWS VPC. It is no longer accessible using the public internet.


<Procedure>

1.  In [$CONSOLE > Services][console-services] select the $SERVICE_SHORT you want to
    connect to the VPC.
1. Click `Operations` > `VPC`.
1. Select the VPC, then click `Attach VPC`.

</Procedure>

And that is it, your $SERVICE_SHORT is now securely communicating with your AWS
account inside a VPC.

## Migrate a $CLOUD_LONG $SERVICE_SHORT between VPCs

To ensure that your applications continue to run without interruption, you keep
$SERVICE_SHORT attached to the VPC. However, you can change the VPC your
$SERVICE_SHORT is attached to, or disconnect from a VPC and enable access to the
$SERVICE_SHORT from the public internet.

<Highlight type="info">

$CLOUD_LONG uses a different DNS for services that are attached to a VPC.
When you migrate a $SERVICE_SHORT between public access and a VPC, you need
to update your connection string.

</Highlight>

<Procedure>

1. In [$CONSOLE > Services][console-services] select the $SERVICE_SHORT to migrate.

   If you don't have a $SERVICE_SHORT, [create a new one][create-service].
1. Click `Operations` > `VPC`.
1. Select the VPC, then click `Attach VPC`.

</Procedure>

Migration takes a few minutes to complete and requires a change to DNS settings for the
Service. The $SERVICE_SHORT is not accessible during this time. If you receive a DNS error, allow
some time for DNS propagation.

[aws-dashboard]: https://console.aws.amazon.com/vpc/home#PeeringConnections:
[aws-security-groups]: https://console.aws.amazon.com/vpcconsole/home#securityGroups:
[console-login]: https://console.cloud.timescale.com/
[console-vpc]: https://console.cloud.timescale.com/dashboard/vpc
[console-services]: https://console.cloud.timescale.com/dashboard/services
[timescale-support]: https://www.timescale.com/contact/
[tsc-regions]: /use-timescale/:currentVersion:/regions/


[aws-vpc-setup-vpc]: /use-timescale/:currentVersion:/vpc/#create-a-peering-vpc-in-timescale-console
[aws-vpc-complete]: /use-timescale/:currentVersion:/vpc/#complete-the-vpc-connection-in-aws
[aws-vpc-security-groups]: /use-timescale/:currentVersion:/vpc/#set-up-security-groups-in-aws
[aws-vpc-connect-vpcs]: /use-timescale/:currentVersion:/vpc/#attach-a-timescale-service-to-the-peering-vpc


[create-service]: /getting-started/:currentVersion:/services/#create-a-timescale-cloud-service
[pricing-plans]: /about/:currentVersion:/pricing-and-account-management/
