---
title: Tiered Storage
excerpt: Save on storage costs by tiering older data to a low-cost bottomless object storage tier
products: [cloud]
keywords: [tiered storage]
tags: [storage, data management]
---

# Tiered Storage
Tiered Storage is Timescale's multi-tiered storage architecture engineered to enable infinite, low-cost scalability for time series and analytical databases in the Timescale platform.

Tiered storage complements Timescale's standard high-performance storage tier with a low-cost bottomless storage tier;
an object store built on Amazon S3. We'll refer to this low-cost bottomless storage tier as object storage in our documentation.

<img
class="main-content__illustration"
src="https://assets.timescale.com/docs/images/timescale-tiered-storage-architecture.png"
width={1228} height={688}
alt="Timescale Tiered Storage architecture"
/>

This object storage tier is designed for data that is rarely accessed and has lower performance requirements.
For example, it is a great solution to keep old data for long periods of time (even forever) for auditing or reporting purposes
without incurring the higher costs or data size limitations of our high-performance storage tier.

<!-- vale Google.SmartQuotes = NO -->

Timescale offers a simple API to define policies to tier data from the high-performance storage tier to the object storage tier
as it ages without the need of any ETL process or infrastructure changes;
no need to implement and maintain custom-built, bespoke solutions to offload data to secondary storage
or fetch it back in case they are needed for analysis.
And if you have or want to not keep very old data around, you can also add retention policies over tiered data as well.

<!-- vale Google.SmartQuotes = YES -->

Your data is always there and can be [queried when needed][querying-tiered-data].
When you run a query, Timescale seamlessly figures out what storage tiers it needs to access to generate the response.

<Highlight type="info">
Tiered storage is available only on the Timescale Platform, and is not supported on self-hosted instances.  
</Highlight>

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
