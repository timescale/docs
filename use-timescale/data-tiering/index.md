---
title: Tiered Storage
excerpt: Save on storage costs by tiering older data to a low-cost bottomless object storage tier
products: [cloud]
keywords: [tiered storage]
tags: [storage, data management]
---

# Tiered storage

Tiered storage is Timescale's [hierarchical storage management architecture](https://en.wikipedia.org/wiki/Hierarchical_storage_management). Engineered for infinite, low-cost scalability, Tiered Storage
is available for the [Time series and analytics](https://www.timescale.com/products) instances you create in [Timescale](https://console.cloud.timescale.com/).

Tiered storage consists of the:
* **High-performance tier**: rapid access to the most recent, and frequently accessed data.

* **Object storage tier**: hold data that is rarely accessed and has lower performance requirements.
  For example, to save old data for auditing or reporting purposes over long periods of time, even forever.
  The Object store is low-cost bottomless data storage built on Amazon S3. You use it to avoid the
  higher costs and data size limitations associated with the high-performance tier. 

No matter the tier your data is stored in, you [query it when you need it][querying-tiered-data]. 
Timescale seamlessly figures out the storage tier to access and generates the response.

<img
class="main-content__illustration"
src="https://assets.timescale.com/docs/images/timescale-tiered-storage-architecture.png"
width={1228} height={688}
alt="Timescale Tiered Storage architecture"
/>

<!-- vale Google.SmartQuotes = NO -->

You use the API to [define tiering policies][creating-data-tiering-policy] that automatically migrate 
data from the high-performance storage tier to the object store as it ages. You use 
[retention policies][add-retention-policies] to remove very old data from the object store.

With tiered storage you don't need an ETL process, infrastructure changes, or custom-built, bespoke 
solutions to offload data to secondary storage and fetch it back in when needed.   

<!-- vale Google.SmartQuotes = YES -->

In this section:
* [Learn about the object storage tier][about-data-tiering] before you start using tiered storage.
* Quick [tour of tiered storage][tour-data-tiering].
* [Learn how to enable the object storage tier][enabling-data-tiering] on your service.
*  Manually [tier chunks][manual-tier-chunk] to schedule individual chunks to be tiered.
*  Create a [Tiering Policy][creating-data-tiering-policy] to automatically schedule chunks to be tiered.
* [Learn how to query tiered data][querying-tiered-data].
* Manually [untier chunks][untier-data] to move data back to the high-performance local storage tier.


[about-data-tiering]: /use-timescale/:currentVersion:/data-tiering/about-data-tiering/
[tour-data-tiering]: /use-timescale/:currentVersion:/data-tiering/tour-data-tiering/
[enabling-data-tiering]: /use-timescale/:currentVersion:/data-tiering/enabling-data-tiering/
[manual-tier-chunk]: /use-timescale/:currentVersion:/data-tiering/manual-tier-chunk/
[creating-data-tiering-policy]: /use-timescale/:currentVersion:/data-tiering/creating-data-tiering-policy/
[querying-tiered-data]: /use-timescale/:currentVersion:/data-tiering/querying-tiered-data/
[untier-data]: /use-timescale/:currentVersion:/data-tiering/untier-data/
[add-retention-policies]: /api/:currentVersion:/continuous-aggregates/add_policies/
