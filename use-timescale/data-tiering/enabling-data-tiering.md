---
title: Tier data to object storage
excerpt: How to tier data to object storage
products: [cloud]
keywords: [data tiering]
tags: [storage, data management]
cloud_ui:
    path:
        - [services, :serviceId, overview]
---

# Tier data to object storage

Enable Data Tiering to begin migrating rarely used data from primary storage to object storage to save on storage costs. 

## Enabling data tiering

You can enable data tiering from the Services Overview page in the Timescale
console. 

<Procedure>

### Enabling data tiering

1.  In the Timescale console, from the `Services` list, click the name of
    the service you want to modify.
1.  In the `Overview` tab, locate the `Data tiering` card, and click
    `Enable data tiering`. Confirm the action.
1.  Data tiering can take a few seconds to turn on and once activated shows the amount of
    data that has been tiered. Once enabled, data can be tiered by manually tiering 
    a chunk or by creating a tiering policy.     

    <img class="main-content__illustration"
    src="https://assets.timescale.com/docs/images/enable-data-tiering.png"
    width={1375} height={944}
    alt="The Timescale Console showing data tiering enabled" />

</Procedure>

After data tiering is enabled you must either [manually tier data][manual-tier-chunk] or [setup a tiering policy][creating-data-tiering-policy] 
to begin tiering data from your hypertables.


[manual-tier-chunk]: /use-timescale/:currentVersion:/data-tiering/manual-tier-chunk/
[creating-data-tiering-policy]: /use-timescale/:currentVersion:/data-tiering/creating-data-tiering-policy/
