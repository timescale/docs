---
title: Data tiering
excerpt: Save on storage costs by tiering older data to separate storage
products: [cloud]
keywords: [data tiering]
tags: [storage, data management]
---

# Data tiering
Data Tiering provides a cost-effective way to store data that is rarely accessed and allows you to keep on scaling past the 16 TB limit. 

Your data is always there and can be [queried when needed][querying-tiered-data].

<!-- vale Google.SmartQuotes = NO -->

Data Tiering’s focus on simplicity allows for seamless tiering through easy to set up policies;
no need to implement and maintain custom-built, bespoke solutions to offload data to secondary storage
or fetch it back in case they are needed for analysis.
And if you have or want to not keep very old data around, you can also add retention policies over tiered data as well.

<!-- vale Google.SmartQuotes = YES -->

<Highlight type="info">
Data Tiering is available only on Timescale Cloud, and is not supported on self-hosted instances.  
</Highlight>

In this section: 
* [Learn about data tiering][about-data-tiering] before you start using it.
* Quick [tour of data tiering][tour-data-tiering].
* [Learn how to enable data tiering][enabling-data-tiering] on your instance.
*   Manually [tier chunks][manual-tier-chunk] to schedule individual chunks to be tiered.
*  Create a [Data Tiering Policy][creating-data-tiering-policy] to automatically schedule chunks to be tiered.
* [Learn how to query tiered data][querying-tiered-data].
*   Manually [untier chunks][untier-data] to move data back to local storage.


[about-data-tiering]: /use-timescale/:currentVersion:/data-tiering/about-data-tiering/
[tour-data-tiering]: /use-timescale/:currentVersion:/data-tiering/tour-data-tiering/
[enabling-data-tiering]: /use-timescale/:currentVersion:/data-tiering/enabling-data-tiering/
[manual-tier-chunk]: /use-timescale/:currentVersion:/data-tiering/manual-tier-chunk/
[creating-data-tiering-policy]: /use-timescale/:currentVersion:/data-tiering/creating-data-tiering-policy/
[querying-tiered-data]: /use-timescale/:currentVersion:/data-tiering/querying-tiered-data/
[untier-data]: /use-timescale/:currentVersion:/data-tiering/untier-data/
