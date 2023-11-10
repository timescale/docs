---
title: Tiered Storage
excerpt: Save on storage costs by tiering older data to a low-cost bottomless storage tier
products: [cloud]
keywords: [tiered storage]
tags: [storage, data management]
---

# Tiered Storage
Tiered storage complements Timescale's standard high-performance storage tier with a low-cost bottomless storage tier backed by S3.

This low-cost bottomless storage tier is designed for data that is rarely accessed and has lower performance requirements.
For example, it is a great solution to keep old data for long periods of time (even forever) for auditing or reporting purposes
without incurring the higher costs or data size limitations of our high-performance storage tier.

<!-- vale Google.SmartQuotes = NO -->

Timescale offers a simple API to define policies to tier data from the high-performance storage tier to the low-cost bottomless storage
tier as it ages without the need of any ETL process or infrastructure changes;
no need to implement and maintain custom-built, bespoke solutions to offload data to secondary storage
or fetch it back in case they are needed for analysis.
And if you have or want to not keep very old data around, you can also add retention policies over tiered data as well.

<!-- vale Google.SmartQuotes = YES -->

Your data is always there and can be [queried when needed][querying-tiered-data].
When you run a query, Timescale seamlessly figures out what storage tiers it needs to access to generate the response.

<Highlight type="info">
Tiered storage is available only on Timescale Cloud, and is not supported on self-hosted instances.  
</Highlight>

In this section: 
* [Learn about tiered storage][about-data-tiering] before you start using it.
* Quick [tour of tiered storage][tour-data-tiering].
* [Learn how to enable tiered storage][enabling-data-tiering] on your instance.
*   Manually [tier chunks][manual-tier-chunk] to schedule individual chunks to be tiered.
*  Create a [Tiering Policy][creating-data-tiering-policy] to automatically schedule chunks to be tiered.
* [Learn how to query tiered data][querying-tiered-data].
*   Manually [untier chunks][untier-data] to move data back to local storage.


[about-data-tiering]: /use-timescale/:currentVersion:/data-tiering/about-data-tiering/
[tour-data-tiering]: /use-timescale/:currentVersion:/data-tiering/tour-data-tiering/
[enabling-data-tiering]: /use-timescale/:currentVersion:/data-tiering/enabling-data-tiering/
[manual-tier-chunk]: /use-timescale/:currentVersion:/data-tiering/manual-tier-chunk/
[creating-data-tiering-policy]: /use-timescale/:currentVersion:/data-tiering/creating-data-tiering-policy/
[querying-tiered-data]: /use-timescale/:currentVersion:/data-tiering/querying-tiered-data/
[untier-data]: /use-timescale/:currentVersion:/data-tiering/untier-data/
