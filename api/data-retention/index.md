---
title: Data retention
excerpt: Timescale Cloud API reference for data retention. Includes SQL functions for adding and removing data retention policies that run on a schedule that you define
keywords: [data retention, delete]
tags: [drop]
products: [cloud, self_hosted, mst]
---

# Data Retention <Tag type="community">Community</Tag>

An intrinsic part of time-series data is that new data is accumulated and old
data is rarely, if ever, updated. This means that the relevance of the data
diminishes over time. It is therefore often desirable to delete old data to save
disk space.

With TimescaleDB, you can manually remove old chunks of data or implement
policies using these APIs.

For more information about creating a data retention policy, see the
[data retention section][data-retention-howto].

[data-retention-howto]: /use-timescale/:currentVersion:/data-retention/create-a-retention-policy/
