---
title: I/O boost
excerpt: Increase I/O and throughput to avoid performance bottlenecks and enhance scalability with I/O Boost
products: [cloud]
keywords: [io, io boost, performance]
---

# $IO_BOOST

You use $IO_BOOST to increase I/O and throughput of a service's [high-performance storage][data-tiering]. You can enable it for the most demanding applications, while keeping costs under control.

Enabling $IO_BOOST increases I/O in the following way:

- to 16,000 IOPS and 1,000 MBps throughput for standard high-performance storage.
- to up to 64,000 IOPS for enhanced high-performance storage.

The boost also applies to any [high-availability][ha-replicas] replicas you might have running for a service, although for an additional fee.

This feature is available under the $SCALE and $ENTERPRISE [$PRICING_PLANs][pricing-tiers]. 

## Enable $IO_BOOST

You enable $IO_BOOST from $CONSOLE.

<Procedure>

1. In [$CONSOLE][console], choose the $SERVICE_SHORT you want to enable $IO_BOOST for.

1. Open `Operations` > `Compute and storage`, then choose the right value from the `I/O Boost` dropdown. IOPS over 16,000 are only available when the storage type is set to `Enhanced`. 

1. Click `Apply`.

   ![Timescale I/O Boost](https://assets.timescale.com/docs/images/timescale-i-o-boost.png)

</Procedure>

IOPS is now changed for this service and its replicas. You can make changes once every 6 hours.

[console]: https://console.cloud.timescale.com/dashboard/services
[ha-replicas]: /use-timescale/:currentVersion:/ha-replicas/high-availability/
[read-replicas]: /use-timescale/:currentVersion:/ha-replicas/read-scaling/
[pricing-tiers]: /about/:currentVersion:/pricing-and-account-management/
[data-tiering]: /use-timescale/:currentVersion:/data-tiering/




