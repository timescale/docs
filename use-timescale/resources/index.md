---
title: Resources
excerpt: Manage your service resources
products: [cloud]
keywords: [services, operation, storage]
tags: [disk space, resources, oom, memory]
cloud_ui:
    path:
        - [services, :serviceId, operations, resources]
        - [services, :serviceId, operations]
---

import UsageBasedStorage from "versionContent/_partials/_usage-based-storage-intro.mdx";

# Resources

<UsageBasedStorage />

Timescale allows you to resize compute (CPU/RAM) and storage independently at any
time. This is useful when you need to do something like increasing your storage
capacity, but not your compute size. You can resize compute and storage in the
Timescale console for any service, including members of multi-node
clusters.

Storage changes are applied with no downtime, and the new storage capacity is
usually available for use within a few seconds.

*   Storage can only be increased in size. You cannot decrease the amount of
    storage capacity your service has available.
*   Storage size changes can only be made once every six hours.
*   Storage can range in size from 10&nbsp;GB to 16&nbsp;TB,
     and can be changed in various increments.

You can increase or decrease the compute size of your service at any time, with
a short downtime.

*   There is momentary downtime while the new compute settings are applied.
    In most cases, this downtime is less than 30 seconds.
*   Because compute changes require an interruption to your service, plan
    accordingly so that the settings are applied during an appropriate service
    window.

To modify the compute or storage of your service, select the service that you
want to modify, and navigate to the `Operations` tab. Go to the `Resources`
section to see the current resource settings for the service.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-resources-unchanged.png" alt="View Timescale service resource information"/>

When you change compute or storage settings, the current and new hourly charges
are displayed immediately so that you can verify how the changes impact your
costs.

You can use the Timescale console to change how much CPU and memory
resources your service has available, as well as change the disk size for your
service. You can adjust this manually as required.
