---
title: About data retention
excerpt: With Timescale Cloud, you can discard old data as it reaches a certain age - manually or by setting up policies. Coupled with usage-based storage, data retention dramatically cuts your storage costs
products: [cloud, mst, self_hosted]
keywords: [data retention]
---

import UsageBasedStorage from "versionContent/partials/_usage-based-storage-intro.mdx";

# About data retention

In modern applications, data grows exponentially. As data gets older, it often becomes less useful in day-to-day operations. 
However, you still need it for analysis. Timescale elegantly solves this problem with
[automated data retention policies][retention-policy]. 

Data retention policies delete raw old data for you on a schedule that you define. 
By [combining retention policies with continuous aggregates][retention-with-caggs], you can downsample your data and keep useful summaries of it instead. This lets you analyze historical data - while also saving on storage. 

<UsageBasedStorage />

## Drop data by chunk

Timescale data retention works on chunks, not on rows. Deleting data
row-by-row, for example with the PostgreSQL `DELETE` command, can be slow. But
dropping data by the chunk is faster, because it deletes an entire file from
disk. It doesn't need garbage collection and defragmentation.

Whether you use a policy or manually drop chunks, Timescale drops data by the
chunk. It only drops chunks where _all_ the data is within the specified time
range.

For example, consider the setup where you have 3 chunks containing data:

1.  More than 36 hours old
1.  Between 12 and 36 hours old
1.  From the last 12 hours

You manually drop chunks older than 24 hours. Only the oldest chunk is deleted.
The middle chunk is retained, because it contains some data newer than 24 hours.
No individual rows are deleted from that chunk.

[manual-drop]: /use-timescale/:currentVersion:/data-retention/manually-drop-chunks/
[retention-policy]: /use-timescale/:currentVersion:/data-retention/create-a-retention-policy/
[retention-with-caggs]: /use-timescale/:currentVersion:/data-retention/data-retention-with-continuous-aggregates/
