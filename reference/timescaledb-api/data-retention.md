---
title: Data retention
excerpt: Delete old data to save disk save
keywords: [data retention, delete]
tags: [drop]
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
