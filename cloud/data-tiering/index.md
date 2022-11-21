---
title: Data tiering
excerpt: Save on storage costs by tiering older data to separate storage
product: cloud
keywords: [data tiering]
tags: [storage, data management]
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

## Benefits of data tiering

With data tiering, you get:

*   **Low-cost scalability.** Store high volumes of time-series data
    cost-efficiently in the object store. You pay only for what you store, with
    no extra cost for queries.

*   **Data warehousing.** Access all your data without leaving Timescale Cloud.
    Rather than running a separate system to tier and archive historical data,
    move it to native object storage.

*   **Transparent SQL queries.** You can interact with your data normally even
    when it's distributed across different storage layers. Queries and `JOIN`s
    work as usual.

## Learn more

Learn [how data tiering works][how-to].

[how-to]: /cloud/:currentVersion:/data-tiering/tier-data-object-storage/
