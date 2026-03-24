* You **can attach**:
  * Up to 50 Customer $VPCs to a Peering $VPC.
  * A $SERVICE_LONG to a single Peering $VPC at a time.
   The $SERVICE_SHORT and the Peering $VPC must be in the same AWS region. However, you can peer a Customer $VPC and a Peering $VPC that are in different regions.
  * Multiple $SERVICE_LONGs to the same Peering $VPC.
* You **cannot attach** a $SERVICE_LONG to multiple Peering $VPCs at the same time.

  The number of Peering $VPCs you can create in your project depends on your [$PRICING_PLAN][pricing-plans].
  If you need another Peering $VPC, either contact [support@tigerdata.com][supporttigerdatacom] or change your $PRICING_PLAN in [$CONSOLE][cloud-login].

[cloud-login]: https://console.cloud.tigerdata.com/
[pricing-plans]: /about/:currentVersion:/pricing-and-account-management/
[supporttigerdatacom]: mailto:support@tigerdata.com
