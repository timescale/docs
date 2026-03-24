1. **Create a Peering $VPC in [$CONSOLE][cloud-login]**

   1. In `Security` > `VPC`, click `Create a VPC`:

      ![$CLOUD_LONG new $VPC][cloud_long-new-vpc]

   1.  Choose your region and IP range, name your VPC, then click `Create VPC`:

       ![Create a new VPC in $CLOUD_LONG][create-a-new-vpc-in-cloud_long]

       Your $SERVICE_SHORT and Peering $VPC must be in the same AWS region. The number of Peering $VPCs you can create in your project depends on your [$PRICING_PLAN][pricing-plans]. If you need another Peering $VPC, either contact [support@tigerdata.com][supporttigerdatacom] or change your plan in [$CONSOLE][cloud-login].

   1.  Add a peering connection:

       1. In the `VPC Peering` column, click `Add`.
       1. Provide your AWS account ID, Transit Gateway ID, CIDR ranges, and AWS region. $CLOUD_LONG creates a new isolated connection for every unique Transit Gateway ID. 
       
         ![Add peering][add-peering]
 
       1. Click `Add connection`.

1. **Accept and configure peering connection in your AWS account**

   Once your peering connection appears as `Processing`, you can accept and configure it in AWS:

   1. Accept the peering request coming from $CLOUD_LONG. The request can take up to 5 min to arrive. Within 5 more minutes after accepting, the peering should appear as `Connected` in $CONSOLE.

   1. Configure at least the following in your AWS account networking:

      - Your subnet route table to route traffic to your Transit Gateway for the Peering VPC CIDRs.
      - Your Transit Gateway route table to route traffic to the newly created Transit Gateway peering attachment for the Peering VPC CIDRs.
      - Security groups to allow outbound TCP 5432.

1. **Attach a $CLOUD_LONG service to the Peering VPC In [$CONSOLE][services-portal]**

   1. Select the $SERVICE_SHORT you want to connect to the Peering VPC.
   1. Click `Operations` > `Security` > `VPC`.
   1. Select the VPC, then click `Attach VPC`.

   You cannot attach a $SERVICE_LONG to multiple $CLOUD_LONG $VPCs at the same time.

[add-peering]: https://assets.timescale.com/docs/images/tiger-cloud-console/add-peering-tiger-console.png
[cloud-login]: https://console.cloud.tigerdata.com/
[cloud_long-new-vpc]: https://assets.timescale.com/docs/images/tiger-cloud-console/add-peering-vpc-tiger-console.png
[create-a-new-vpc-in-cloud_long]: https://assets.timescale.com/docs/images/tiger-cloud-console/configure-peering-vpc-tiger-console.png
[pricing-plans]: /about/:currentVersion:/pricing-and-account-management/
[services-portal]: https://console.cloud.tigerdata.com/dashboard/services
[supporttigerdatacom]: mailto:support@tigerdata.com
