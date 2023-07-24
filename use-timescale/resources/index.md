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

Timescale allows you to resize compute (CPU/RAM) resources independently at any
time. You can resize compute in the Timescale console for any service, with a
short downtime.

Because compute changes require an interruption to your service, plan
accordingly so that the settings are applied during an appropriate service
window.
