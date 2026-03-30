---
title: IP allow list
excerpt: You can grant selective access to your service administration and data. See how to create IP whitelists in Tiger Console
products: [cloud]
keywords: [ip allow list, security]
tags: [ip allow list]
---

# IP allow list

You can restrict access to your $SERVICE_LONGs to trusted IP addresses only. This prevents unauthorized connections without the need for a [Virtual Private Cloud][vpc-peering]. Creating IP allow lists helps comply with security standards such as SOC 2 or HIPAA that require IP filtering. This is especially useful in regulated industries like finance, healthcare, and government.

For a more fine-grained control, you create separate IP allow lists for [service and data management][create-service]. 

## Create and attach an IP allow list for service management

You create an IP allow list at the [$PROJECT_SHORT level][projects], then attach your $SERVICE_SHORT to it. 

<Highlight type="important">

You attach a $SERVICE_SHORT to either one $VPC, or one IP allow list. You cannot attach a $SERVICE_SHORT to a $VPC and an IP allow list at the same time.

</Highlight>

<Procedure>

1. **In [$CONSOLE][console], select `Security` > `IP Allow List`, then click `Create IP Allow List`** 

   ![Create IP allow list][create-ip-allow-list]

1. **Enter your trusted IP addresses**

   The number of IP addresses that you can include in one list depends on your [$PRICING_PLAN][pricing-plans]. 

   ![Add IP addresses to allow list][add-ip-addresses-to-allow-list]

1. **Name your allow list and click `Create IP Allow List`**

   Click `+ Create IP Allow List` to create another list. The number of IP allow lists you can create depends on your [$PRICING_PLAN][pricing-plans].

1. **Select a $SERVICE_LONG, then click `Operations` > `Security` > `IP Allow List`**

   ![Attach IP allow list][attach-ip-allow-list]

1. **Select the list in the drop-down and click `Apply`** 

1. **Type `Apply` in the confirmation popup**

</Procedure>

You have created and attached an IP allow list for service management operations. You can unattach or change the list attached to a $SERVICE_SHORT from the same tab. 

## Create an IP allow list for querying your data

You create an IP allow list in the $DATA_MODE settings.

<Procedure>

1. **In [$CONSOLE][console], toggle `Data view` at the top right**

1. **Click the cog icon to open `Preferences` > `Settings`** 

1. **Log into PopSQL**

1. **Scroll down and toggle `IP Allowlist`**

1. **Add IP addresses**

   1. Click `Add entry`.
   1. Enter an IP address or a range of IP addresses.
   1. Click `Add`. 
   1. When all the IP addresses have been added, click `Apply`.  
   1. Click `Confirm`.

</Procedure>

You have successfully added an IP allow list for querying your $SERVICE_SHORT in $DATA_MODE.

[add-ip-addresses-to-allow-list]: https://assets.timescale.com/docs/images/tiger-cloud-console/add-ip-addresses-to-allow-list-tiger-console.png
[attach-ip-allow-list]: https://assets.timescale.com/docs/images/tiger-on-azure/attach-ip-allow-list-tiger-console.png
[console]: https://console.cloud.tigerdata.com/dashboard/
[create-ip-allow-list]: https://assets.timescale.com/docs/images/tiger-cloud-console/create-ip-allow-list-tiger-console.png
[create-service]: /getting-started/:currentVersion:/services/
[pricing-plans]: /about/:currentVersion:/pricing-and-account-management/
[projects]: /use-timescale/:currentVersion:/security/members/
[vpc-peering]: /use-timescale/:currentVersion:/security/vpc/
