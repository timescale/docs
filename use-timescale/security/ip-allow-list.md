---
title: IP allow list
excerpt: Create a list of IP addresses that can access your services
product: cloud
keywords: [ip allow list, security]
tags: [ip allow list]
---

# IP allow list

You can restrict access to your $SERVICE_LONGs on public cloud to trusted IP addresses only. This prevents unauthorized connections without the need for a Virtual Private Cloud. Creating IP allow lists helps comply with security standards, for example, SOC 2 or HIPAA, that require IP filtering, especially in regulated industries like finance, healthcare, and government.

<Highlight type="important">
You can attach a $SERVICE_SHORT to either one VPC, or one IP allow list. 
</Highlight>

## Create and attach an IP allow list

You create an IP allow list at the project level, then attach your $SERVICE_SHORT to it.

<Procedure>

1. In [$CONSOLE][console], select `Security` > `IP Allow List` and click `Create IP Allow List`. 

   ![Create IP allow list](https://assets.timescale.com/docs/images/create-ip-allow-list.png)

1. Enter your trusted IP addresses. 

   The number of IP addresses that you can include in one list depends on your [pricing plan][pricing-plans]. 

   ![Add IP addresses to allow list](https://assets.timescale.com/docs/images/add-ip-addresses-to-allow-list.png)

1. Name your allow list and click `Create IP Allow List`.

   Click `+ Create IP Allow List` to create another list. The number of IP allow lists you can create depends on your [pricing plan][pricing-plans].

1. Select a $SERVICE_LONG, then click `Operations` > `Security` > `IP Allow List`. 

   ![Attach IP allow list](https://assets.timescale.com/docs/images/attach-ip-allow-list.png)

1. Select the list in the drop-down and click `Apply`. 

1. Type `Apply` in the confirmation popup.

</Procedure>

[console]: https://console.cloud.timescale.com/dashboard/
[pricing-plans]: /about/:currentVersion:/pricing-and-account-management/








