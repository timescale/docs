---
title: Tiered Storage
excerpt: Save on storage costs by tiering older data to a low-cost bottomless object storage tier
products: [cloud]
keywords: [tiered storage]
tags: [storage, data management]
---

# Tiered storage

Tiered storage is a [hierarchical storage management architecture](https://en.wikipedia.org/wiki/Hierarchical_storage_management) for 
[Time series and analytics][create-service] services you create in [$CLOUD_LONG](https://console.cloud.timescale.com/).

Engineered for infinite low-cost scalability, tiered storage consists of the:

* **High-performance tier**: rapid access to the most recent, and frequently accessed data.

* **Object storage tier**: store data that is rarely accessed and has lower performance requirements.
  For example, to save old data for auditing or reporting purposes over long periods of time, even forever.
  The object store is low-cost bottomless data storage built on Amazon S3. You use it to avoid the
  higher costs and data size limitations associated with the high-performance tier. 

No matter the tier your data is stored in, [query it when you need it][querying-tiered-data]. 
Timescale seamlessly accesses the correct storage tier and generates the response.

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
solutions to offload data to secondary storage and fetch it back in when needed. Kick back and relax, 
we do the work for you. 

<Highlight type="info">

Tiered storage is only available for the [Time series and analytics](https://www.timescale.com/products)
instances you create in [$CLOUD_LONG](https://console.cloud.timescale.com/). 

Tiered storage **DOES NOT** work on Self-hosted TimescaleDB or Managed Service for TimescaleDB.  
</Highlight>

<!-- vale Google.SmartQuotes = YES -->

This section explains the following:
* [Learn about the object storage tier][about-data-tiering]: understand tiered storage.
* [Manage tiering][enabling-data-tiering]: enable and disable data tiering, automate tiering with 
   policies, or tier and untier manually.
* [Query tiered data][querying-tiered-data]: query and performance for tiered data.
* [Replicas and forks with tiered data][replicas-and-forks]: how tiered storage works
  with forks and replicas. 


[about-data-tiering]: /use-timescale/:currentVersion:/data-tiering/about-data-tiering/
[enabling-data-tiering]: /use-timescale/:currentVersion:/data-tiering/enabling-data-tiering/
[replicas-and-forks]: /use-timescale/:currentVersion:/data-tiering/tiered-data-replicas-forks/
[creating-data-tiering-policy]: /use-timescale/:currentVersion:/data-tiering/enabling-data-tiering/#automate-tiering-with-policies
[querying-tiered-data]: /use-timescale/:currentVersion:/data-tiering/querying-tiered-data/
[add-retention-policies]: /api/:currentVersion:/continuous-aggregates/add_policies/
[create-service]: /getting-started/:currentVersion:/services/
