---
title: Data tiering
excerpt: Save on storage costs by tiering older data to separate storage
product: cloud
keywords: [data tiering]
tags: [storage, data management]
cloud_ui:
    path:
        - [services, :serviceID, operations, data-tiering]
    priority: 1
---

import ExperimentalPrivateBeta from 'versionContent/_partials/_experimental-private-beta.mdx';
import TieringBeta from 'versionContent/_partials/_cloud-data-tiering-beta.mdx';

# Data tiering

Save on storage costs by tiering data to a low-cost object-storage layer.

Timescale Cloud includes a low-cost object-storage layer built on Amazon S3.
This allows you to tier your hypertable data across different storage layers to
get the best price performance. You can use primary storage for data that
requires quick access, and low-cost object storage for historical data. You can
query all your data with standard SQL, no matter where it's stored.

<ExperimentalPrivateBeta />
<TieringBeta />

*   Learn [how data tiering works][about-data-tiering] before you start using it.
*   [Tier data to object storage][tier-data]
*   [Untier data][untier-data]

[about-data-tiering]: /cloud/:currentVersion:/data-tiering/about-data-tiering/
[tier-data]: /cloud/:currentVersion:/data-tiering/tier-data-object-storage/
[untier-data]: /cloud/:currentVersion:/data-tiering/untier-data/
