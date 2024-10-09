---
title: Enabling the object storage tier
excerpt: How to enable the object storage tier
products: [cloud]
keywords: [tiered storage]
tags: [storage, data management]
cloud_ui:
    path:
        - [services, :serviceId, overview]
---

# Tier data to the object storage tier

Enable tiered storage to begin migrating rarely used data from Timescale's standard high-performance storage tier
to the object storage tier to save on storage costs. 

## Enabling the object storage tier

You can enable tiered storage from the Services Overview page in the Timescale
console. 

<Procedure>

### Enabling tiered storage

1.  In the Timescale console, from the `Services` list, click the name of
    the service you want to modify.
1.  In the `Overview` tab, locate the `Tiered Storage` card, and click
    `Enable tiered storage`. Confirm the action.
1.  Tiered storage can take a few seconds to turn on and once activated shows the amount of
    data that has been tiered. Once enabled, data can be tiered by manually tiering 
    a chunk or by creating a tiering policy.     

    <img class="main-content__illustration"
    src="https://assets.timescale.com/docs/images/enable-data-tiering-ga.png"
    width={1375} height={944}
    alt="The Timescale Console showing tiered storage enabled" />

</Procedure>

After tiered storage is enabled you must either [manually tier data][manual-tier-chunk] or [setup a tiering policy][creating-data-tiering-policy] 
to begin tiering data from your hypertables.


[manual-tier-chunk]: /use-timescale/:currentVersion:/data-tiering/manual-tier-chunk/
[creating-data-tiering-policy]: /use-timescale/:currentVersion:/data-tiering/creating-data-tiering-policy/
