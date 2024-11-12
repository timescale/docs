---
title: IP allow lists
excerpt: Create a list of IP addresses that can access your services
product: cloud
keywords: [ip allow list, security]
tags: [ip allow list]
---

# IP allow lists

You can restrict access to your $SERVICE_LONGs on public cloud to trusted IP addresses. This prevents unauthorized connections without the need for a Virtual Private Cloud. Creating IP allow lists helps comply with security standards, for example, SOC 2 or HIPAA, that require IP filtering, especially in regulated industries like finance, healthcare, and government.

## Create an IP allow list

You create an IP allow list at the project level. 

<Procedure>

1. In $CONSOLE, select `Security` > `IP Allow List` and click `Create IP Allow List`. 

1. Enter your IPv4 Classless Inter-Domain Routing (CIDR). 

   The number of IP addresses that you can include in one list depends on your pricing plan. 

1. Name your allow list and click `Create IP Allow List`.

1. Click `+ Create IP Allow List` to create another list. 

   The number of IP allow lists you can create depends on your pricing plan.

</Procedure>

## Add IP allow list to a service 

Once an IP allow list is created, attach your $SERVICE_LONG to it. 

<Highlight type="important">
You can attach a $SERVICE_SHORT to either one VPC, or one IP allow list. 
</Highlight>

<Procedure>

1. Select the $SERVICE_SHORT, then click `Operations` > `Security` > `IP Allow List`. 

1. Select the list in the drop-down and click `Apply`. 

1. Type `Apply` in the confirmation popup.

</Procedure>





</Procedure>






