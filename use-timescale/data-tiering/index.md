---
title: Storage on Tiger Cloud
excerpt: Save on storage costs by tiering older data to a low-cost bottomless object storage tier. Tiger Cloud tiered storage makes sure you cut costs while having data available for analytical queries
products: [cloud]
price_plans: [scale, enterprise, performance]
keywords: [tiered storage]
tags: [storage, data management]
---

# Storage

<Tabs label="Tiger Cloud on AWS and Azure" persistKey="tiger-platform-clouds">

<Tab title="Tiger Cloud on AWS" label="aws-cloud">

Tiered storage is a [hierarchical storage management architecture][hierarchical-storage] for 
[real-time analytics][create-service] $SERVICE_SHORTs you create in [$CLOUD_LONG](https://console.cloud.timescale.com/).

Engineered for infinite low-cost scalability, tiered storage consists of the following:

* **High-performance storage tier**: stores the most recent and frequently queried data. This tier comes in two types, 
standard and enhanced, and provides you with up to 64 TB of storage and 32,000 IOPS. 

* **Object storage tier**: stores data that is rarely accessed and has lower performance requirements.
  For example, old data for auditing or reporting purposes over long periods of time, even forever.
  The object storage tier is low-cost and bottomless.

No matter the tier your data is stored in, you can [query it when you need it][querying-tiered-data]. 
$CLOUD_LONG seamlessly accesses the correct storage tier and generates the response.

<!-- vale Google.SmartQuotes = NO -->

You [define tiering policies][creating-data-tiering-policy] that automatically migrate 
data from the high-performance storage tier to the object tier as it ages. You use 
[retention policies][add-retention-policies] to remove very old data from the object storage tier.

With tiered storage you don't need an ETL process, infrastructure changes, or custom-built, bespoke 
solutions to offload data to secondary storage and fetch it back in when needed. Kick back and relax, 
we do the work for you.

<!-- vale Google.SmartQuotes = YES -->

In this section, you:
* [Learn more about storage tiers][about-data-tiering]: understand how the tiers are built and how they differ. 
* [Manage storage and tiering][enabling-data-tiering]: configure high-performance storage, object storage, and data tiering. 
* [Query tiered data][querying-tiered-data]: query the data in the object storage. 
* [Learn about replicas and forks with tiered data][replicas-and-forks]: understand how tiered storage works
  with forks and replicas of your $SERVICE_SHORT.

</Tab>

<Tab title="Tiger Cloud on Azure" label="azure-cloud">

$CLOUD_LONG stores your data in high-performance storage optimized for frequent querying. Based on [AWS EBS gp3][aws-gp3], the high-performance storage provides you with up to 16 TB and 16,000 IOPS. Its [$HYPERCORE row-columnar storage engine][hypercore], designed specifically for real-time analytics, enables you to compress your data by up to 98%, while improving performance. 

Coupled with other optimizations, $CLOUD_LONG high-performance storage makes sure your data is always accessible and your queries run at lightning speed. 

</Tab>

</Tabs>


[about-data-tiering]: /use-timescale/:currentVersion:/data-tiering/about-data-tiering/
[enabling-data-tiering]: /use-timescale/:currentVersion:/data-tiering/enabling-data-tiering/
[replicas-and-forks]: /use-timescale/:currentVersion:/data-tiering/tiered-data-replicas-forks/
[creating-data-tiering-policy]: /use-timescale/:currentVersion:/data-tiering/enabling-data-tiering/#automate-tiering-with-policies
[querying-tiered-data]: /use-timescale/:currentVersion:/data-tiering/querying-tiered-data/
[add-retention-policies]: /api/:currentVersion:/continuous-aggregates/add_policies/
[create-service]: /getting-started/:currentVersion:/services/
[hierarchical-storage]: https://en.wikipedia.org/wiki/Hierarchical_storage_management
[hypercore]: /use-timescale/:currentVersion:/hypercore
[aws-gp3]: https://docs.aws.amazon.com/ebs/latest/userguide/general-purpose.html