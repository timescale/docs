---
title: I/O boost
excerpt: Increase I/O and throughput to avoid performance bottlenecks and enhance scalability
products: [cloud]
keywords: [io, io boost, performance]
---

# I/O boost

You use I/O boost to increase I/O and throughput of a service's [high-performance storage][data-tiering]. You can enable it for the most demanding applications, while keeping costs under control.

Enabling I/O boost increases I/O to 16,000 IOPS and throughput to 1,000 MBps. The boost also applies to any [high-availability][ha-replicas] replicas you might have running for a service, although for an additional fee.

This feature is available under the Scale and Enterprise [pricing tiers][pricing-tiers]. 

## Enable I/O boost

You enable I/O boost from the `Operations` tab in [$CONSOLE][console].

<Procedure>

1. **In $CONSOLE, choose the $SERVICE_SHORT you want to enable I/O boost for**. 

1. **Open the `Operations` tab and toggle the I/O boost switch. Then click `Apply`**.

   ![Timescale I/O Boost](https://assets.timescale.com/docs/images/timescale-i-o-boost.png)

</Procedure>

I/O boost is now enabled for this service and its replicas. You can enable or disable it once every 24 hours. 

[console]: https://console.cloud.timescale.com/dashboard/services
[ha-replicas]: /use-timescale/:currentVersion:/ha-replicas/high-availability/
[read-replicas]: /use-timescale/:currentVersion:/ha-replicas/read-scaling/
[pricing-tiers]: /about/:currentVersion:/pricing-and-account-management/
[data-tiering]: /use-timescale/:currentVersion:/data-tiering/




