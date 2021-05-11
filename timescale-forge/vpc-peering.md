# VPC Peering in Timescale Forge

Timescale Forge allows you to create a private network peering connection between
your cloud VPC and the Timescale Forge cloud infrastructure where your Timescale
services are hosted.

VPC peering isolates your Timescale Forge services ensuring that they are only
accessible via your peered VPC, providing a greater security model due to reduced
attack vector.

The Timescale Forge console makes creating and configuring your VPC peering connections
simple, providing controls for adding and removing VPC peering connections, migrating
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
The Timescale Forge VPC peering feature is currently limited to AWS VPC peering only.
</highlight>

<highlight type="tip">
Timescale Forge defaults to a limit of 3 VPCs per Forge project. If more VPCs are needed,
you may contact support to request a quota increase.
</highlight>

<highlight type="warning">
Once you have attached your Timescale Forge service to a VPC, it will no longer be accessible
via the public internet. It will only be accessible via your AWS VPC which has been peered
with your Timescale Forge VPC.

Timescale Forge uses a different DNS name for a Timescale service once it has been attached
to a VPC. This means that you will need to update your connection string if migrating a service
from the public internet into a VPC, or vice-versa.
</highlight>

## Setup
Before you begin, log in to the Timescale Forge console.

### Create a new VPC
In the Timescale Forge console, click `VPC` in the left navigation bar to go to the VPC
dashboard. You can add new VPCs here for your Timescale Forge services to attach to.
The VPCs created here are peered with your own VPC as part of the setup process.

<img class="main-content__illustration" src="vpc-dashboard.png" alt="Navigate to the VPC dashboard in the console"/>

Click `Create VPC`, type a name for your new VPC, and provide an IPv4 CIDR block.
Make sure that the CIDR block you choose for your VPC does not overlap with the
cloud VPC you are using to create a peering connection. If the CIDR blocks overlap,
the peering process will fail. You can always find the CIDR block of your AWS VPC
from the AWS console.

<img class="main-content__illustration" src="create-vpc.png" alt="Create a new Forge VPC"/>

<highlight type="tip">
Though VPC peering is still covered by the Timescale Forge trial period, you will be required
to enter a valid payment method in order to create a VPC.
</highlight>

### Create a peering connection
When you have created a Timescale Forge VPC, you are ready to create a peering connection
between your Forge VPC and your cloud VPC. To do this, expand the dropdown menu by clicking
the `VPC Peering` column on your Forge VPC.

<img class="main-content__illustration" src="create-peering-connection.png" alt="Expand the VPC Peering dropdown menu and enter info"/>

From this menu, enter the AWS Account ID, AWS VPC ID and AWS region of your
cloud VPC for the new peering connection. When you have entered the correct
information, click `Add peering connection` to begin the peering process.

This process is asynchronous, and results in a peering connection sent to your
AWS account for you to accept. This is an important safety mechanism, never
accept a peering connection from an unknown account. All Timescale Forge
peering connections are sent from the AWS account `142548018081`.

<highlight type="tip">
Make note of the peering connection ID (starting with `pcx-`) as it is used in the next step.
</highlight>

<img class="main-content__illustration" src="aws-accept-peering-connection.png" alt="Accept peering connection in AWS console after verifying requestor account number"/>

### Network Route & Security
Once you have accepted the peering connection from the last step, the two VPCs will now
be peered; however, in order to use this peering connection, you will need to update your
VPC's route table to include the CIDR block of your peered Forge VPC, and lastly you will
need to update your VPC's security groups.

#### Route Table
Within the AWS console, navigate to the
[Route Tables](https://console.aws.amazon.com/vpc/home#RouteTables:sort=routeTableId)
dashboard. Select the route table corresponding to your VPC. From the detail menu, select
the `Routes` tab and click the `Edit routes` button.

<img class="main-content__illustration" src="aws-route-table-routes.png" alt="The AWS Route Tables dashboard with Routes tab expanded"/>

From this view, click `Add route`. In the `Destination` column of the new row,
enter the CIDR block of the Forge VPC for which the peering connection was
configured in the previous few steps.

Then in `Target` column, enter the peering connection ID (starting with `pcx-`)
noted in the previous step where we created the peering connection.

No other configuration is needed here, so you may now click `Save routes`. This
configuration allows network traffic to flow from your VPC, across the peering
connection, and over to the Forge VPC where your Timescale services reside.

<img class="main-content__illustration" src="aws-edit-routes.png" alt="Adding a new route table entry for our peering connection"/>

#### Security Groups
Within the AWS console, navigate to the
[Security Groups](https://console.aws.amazon.com/vpc/home#securityGroups:)
dashboard. From this view, click `Create security group` to create a new security group.

<highlight type="tip">
If needed, another security group which already exists in your VPC may be used;
however, for simplicity we will assume the creation of a new security group.
</highlight>

<img class="main-content__illustration" src="aws-create-security-group.png" alt="The AWS Security Groups dashboard"/>

From the Create security group view, enter a name for your security group. Add whatever
content you would like to the description field. For the VPC field, select the VPC
which has been peered with your Forge VPC.

No inbound rules are required, so leave the inbound rules section empty.

In the outbound rules section, select `Custom TCP` for the rule type. The protocol
should remain as TCP. The port range should be `5432`, which is the port which will
be used to connect to your Timescale Forge services. The Destination should be set
to `Custom` and the value should be the CIDR block of your Forge VPC.

Finally, click `Create security group`. With this step, you will now be able to
connect to any of your Timescale Forge services attached to your peered VPC.
