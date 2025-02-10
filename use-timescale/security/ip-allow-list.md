---
title: IP allow list
excerpt: Create a list of IP addresses that can access your services and query the data in them
product: cloud
keywords: [ip allow list, security]
tags: [ip allow list]
---

# IP allow list

You can restrict access to your $SERVICE_LONGs to trusted IP addresses only. This prevents unauthorized connections without the need for a [Virtual Private Cloud][vpc-peering]. Creating IP allow lists helps comply with security standards such as SOC 2 or HIPAA that require IP filtering. This is especially useful in regulated industries like finance, healthcare, and government.

For a more fine-grained control, you create separate IP allow lists for [the ops mode and the data mode][modes]. 

## Create and attach an IP allow list in the ops mode

You create an IP allow list at the [project level][members], then attach your $SERVICE_SHORT to it. 

<Highlight type="important">
You attach a $SERVICE_SHORT to either one $VPC, or one IP allow list. You cannot attach a $SERVICE_SHORT to a $VPC and an IP allow list at the same time.
</Highlight>

<Procedure>

1. **In [$CONSOLE][console], select `Security` > `IP Allow List`, then click `Create IP Allow List`** 

   ![Create IP allow list](https://assets.timescale.com/docs/images/create-ip-allow-list.png)

1. **Enter your trusted IP addresses**

   The number of IP addresses that you can include in one list depends on your [pricing plan][pricing-plans]. 

   ![Add IP addresses to allow list](https://assets.timescale.com/docs/images/add-ip-addresses-to-allow-list.png)

1. **Name your allow list and click `Create IP Allow List`**

   Click `+ Create IP Allow List` to create another list. The number of IP allow lists you can create depends on your [pricing plan][pricing-plans].

1. **Select a $SERVICE_LONG, then click `Operations` > `Security` > `IP Allow List`**

   ![Attach IP allow list](https://assets.timescale.com/docs/images/attach-ip-allow-list.png)

1. **Select the list in the drop-down and click `Apply`** 

1. **Type `Apply` in the confirmation popup**

</Procedure>

You have created and attached an IP allow list for the operations available in the ops mode. You can unattach or change the list attached to a $SERVICE_SHORT from the same tab. 

## Create an IP allow list in the data mode

You create an IP allow list in the data mode settings.

<Procedure>

1. **In [$CONSOLE][console], toggle `Data`**

1. **Click the project name in the upper left corner, then select `Settings`** 

1. **Scroll down and toggle `IP Allowlist`**

1. **Add IP addresses**

   1. Click `Add entry`.
   1. Enter an IP address or a range of IP addresses.
   1. Click `Add`. 
   1. When all the IP addresses have been added, click `Apply`.  
   1. Click `Confirm`.

</Procedure>

You have successfully added an IP allow list for querying your $SERVICE_SHORT in the data mode.

[console]: https://console.cloud.timescale.com/dashboard/
[pricing-plans]: /about/:currentVersion:/pricing-and-account-management/
[vpc-peering]: /use-timescale/:currentVersion:/security/vpc/
[members]: /use-timescale/:currentVersion:/members/
[modes]: /getting-started/:currentVersion:/services/






