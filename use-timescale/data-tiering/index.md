---
title: Storage on Tiger Cloud
excerpt: Save on storage costs by tiering older data to a low-cost bottomless object storage tier. Tiger tiered storage makes sure you cut costs while having data available for analytical queries
products: [cloud]
keywords: [tiered storage]
tags: [storage, data management]
---

# Storage

All $SERVICE_SHORTs in [$CLOUD_LONG][cloud_long] come with high-performance storage. For [real-time analytics][create-service] $SERVICE_SHORTs, [$CLOUD_LONG][cloud_long] additionally offers a [hierarchical storage management architecture][hierarchical-storage] called tiered storage.

Engineered for infinite low-cost scalability, tiered storage consists of the following:

* **High-performance storage tier**: stores the most recent and frequently queried data. This tier comes in two types, 
standard and enhanced, and provides you with up to 64 TB of storage and 32,000 IOPS depending on your pricing plan and cloud provider. 

* **Object storage tier**: stores data that is rarely accessed and has lower performance requirements.
  For example, old data for auditing or reporting purposes over long periods of time, even forever.
  The object storage tier is low-cost and bottomless.

No matter the tier your data is stored in, you can [query it when you need it][querying-tiered-data]. 
$CLOUD_LONG seamlessly accesses the correct storage tier and generates the response.

You can [define tiering policies][creating-data-tiering-policy] to migrate 
data from the high-performance storage tier to the object tier automatically, and then set up 
[retention policies][add-retention-policies] to remove very old data from the object storage tier.

This section covers:

* [Tiered storage architecture][about-data-tiering]: understand how the tiers are built and how they differ. 
* [Tiered storage workflow][data-tiering-workflow]: enable, manage, and query data in low-cost storage.
* [Manage storage and tiering][enabling-data-tiering]: configure high-performance storage, object storage, and data tiering. 
* [Query tiered data][querying-tiered-data]: query the data in the object storage.
* [Replicas and forks with tiered data][tiered-forks]: understand how tiered storage works with forks and replicas of your $SERVICE_SHORT.

[about-data-tiering]: /use-timescale/:currentVersion:/data-tiering/about-data-tiering/
[add-retention-policies]: /api/:currentVersion:/continuous-aggregates/add_policies/
[aws-gp3]: https://docs.aws.amazon.com/ebs/latest/userguide/general-purpose.html
[cloud_long]: https://console.cloud.timescale.com/
[create-service]: /getting-started/:currentVersion:/services/
[creating-data-tiering-policy]: /use-timescale/:currentVersion:/data-tiering/enabling-data-tiering/#automate-tiering-with-policies
[data-tiering-workflow]: /use-timescale/:currentVersion:/data-tiering/about-data-tiering/#the-tiered-storage-workflow
[enabling-data-tiering]: /use-timescale/:currentVersion:/data-tiering/enabling-data-tiering/
[hierarchical-storage]: https://en.wikipedia.org/wiki/Hierarchical_storage_management
[querying-tiered-data]: /use-timescale/:currentVersion:/data-tiering/querying-tiered-data/
[tiered-forks]: /use-timescale/:currentVersion:/data-tiering/tiered-data-replicas-forks/
