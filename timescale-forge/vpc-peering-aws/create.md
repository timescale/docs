# Create and connect a Timescale Forge VPC with AWS

## Setup
Before you begin, log in to the [Timescale Forge console](https://console.forge.timescale.com/).

## Create a new VPC
In the Timescale Forge console, click `VPC` in the left navigation bar to go to the VPC
dashboard. You can add new VPCs here for your Timescale Forge services to attach to.
The VPCs created here are peered with your own VPC as part of the setup process.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/timescale-forge/vpc-dashboard.png" alt="Navigate to the VPC dashboard in the console"/>

Click `Create VPC`, type a name for your new VPC, and provide an IPv4 CIDR block
(E.G., `10.0.0.0/16` or `192.168.0.0/24`). Make sure that the CIDR block you
choose for your VPC does not overlap with the cloud VPC you are using to create
a peering connection. If the CIDR blocks overlap, the peering process will fail.
You can always find the CIDR block of your AWS VPC from the AWS console.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/timescale-forge/create-vpc.png" alt="Create a new Forge VPC"/>

<highlight type="tip">
VPC peering can be enabled for free during your Timescale Forge trial, but you will be
required to enter a valid payment method in order to create a VPC (even though you
will not yet be charged for it).
</highlight>

## Create a peering connection
When you have created a Timescale Forge VPC, you are ready to create a peering connection
between your Forge VPC and your cloud VPC. To do this, click the `Add` text in
the `VPC Peering` column for the Forge VPC that you would like to connect.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/timescale-forge/create-peering-connection.png" alt="Expand the VPC Peering dropdown menu and enter info"/>

In the form that is displayed, enter the AWS Account ID, AWS VPC ID, and AWS region of your
cloud VPC for the new peering connection. When you have entered the correct
information, click `Add peering connection` to begin the peering process.

This process is asynchronous, and results in a peering connection sent to your
AWS account for you to accept. This is an important safety mechanism — never
accept a peering connection from an unknown account. All Timescale Forge
peering connections are sent from the AWS account `142548018081`.

Navigate to the AWS console's
[Peering Connections](https://console.aws.amazon.com/vpc/home#PeeringConnections:)
dashboard. Find the new peering connection request sent from Timescale Forge, and
accept the request.

<highlight type="tip">
Make note of the peering connection ID (starting with `pcx-`) as it is used in the next step.
</highlight>

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/timescale-forge/aws-accept-peering-connection.png" alt="Accept peering connection in AWS console after verifying requestor account number"/>

## Network routing and security in AWS
Once you have accepted the peering connection, the two VPCs will now be peered;
however, in order to use this peering connection, you need to update your
VPC's route table to include the CIDR block of your peered Timescale Forge VPC,
and you also need to update your VPC's security groups.

### Route table
Within the AWS console, navigate to the
[Route Tables](https://console.aws.amazon.com/vpc/home#RouteTables:sort=routeTableId)
dashboard. Select the route table corresponding to your VPC. From the detail menu, select
the `Routes` tab and click the `Edit routes` button.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/timescale-forge/aws-route-table-routes.png" alt="The AWS Route Tables dashboard with Routes tab expanded"/>

From this view, click `Add route`. In the `Destination` column of the new row,
enter the CIDR block of the Timescale Forge VPC for which the peering connection
was configured in the previous few steps.

In the `Target` column, enter the peering connection ID (starting with `pcx-`)
noted in the previous step where you created the peering connection.

No other configuration is needed here, so click `Save routes`. This
configuration allows network traffic to flow from your VPC, across the peering
connection, and over to the Timescale Forge VPC where your TimescaleDB services reside.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/timescale-forge/aws-edit-routes.png" alt="Adding a new route table entry for our peering connection"/>

### Security groups
Within the AWS console, navigate to the
[Security Groups](https://console.aws.amazon.com/vpc/home#securityGroups:)
dashboard. From this view, click `Create security group` to create a new security group.

<highlight type="tip">
If you need to, you can use another security group which already exists in your VPC,
however, for simplicity we will assume the creation of a new security group.
</highlight>

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/timescale-forge/aws-create-security-group.png" alt="The AWS Security Groups dashboard"/>

From the `Create security group` view, enter a name for your security group. Add whatever
content you would like to the description field. For the `VPC` field, select the VPC
which has been peered with your Forge VPC.

No inbound rules are required, so leave the inbound rules section empty.

In the outbound rules section, select `Custom TCP` for the rule type. The protocol
should remain as TCP. The port range should be `5432`, which is the port which will
be used to connect to your Timescale Forge services. The Destination should be set
to `Custom` and the value should be the CIDR block of your Forge VPC.

<highlight type="tip">
AWS may pre-populate the `Destination` column with the value `0.0.0.0/0`. Though this
value will certainly work, it is more "open" than needed, and should be deleted.
</highlight>

Finally, click `Create security group`. With this step, you will now be able to
connect to any of your Timescale Forge services attached to your peered VPC. In the next
section, you will learn how to create a Timescale Forge service with a VPC attachment.

## Create a service with VPC attachment
In the Timescale Forge console, navigate to the
[Services Dashboard](https://console.forge.timescale.com/dashboard/services). Click
`Create service` and select the compute and disk size which fits your needs.

Expand the dropdown menu under the `Select a VPC` step and select the VPC you created
previously. If you have multiple VPCs, select the VPC which you want your new service
to be attached to.

Click `Create Service`, and Timescale Forge will create your new service. Due to
selecting a VPC during setup, your new service will be created with an attachment to
your selected VPC.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/timescale-forge/create-service-with-vpc.png" alt="Create new service with VPC attachment"/>