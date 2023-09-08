---
title: Tier data to object storage
excerpt: How to tier data to object storage
products: [cloud]
keywords: [data tiering]
tags: [storage, data management]
---

import ExperimentalPrivateBeta from 'versionContent/_partials/_early_access.mdx';
import TieringBeta from 'versionContent/_partials/_cloud-data-tiering-beta.mdx';

# Tier data to object storage

Tier data from primary storage to object storage to save on storage costs. You
can continue to query a hypertable as normal after migration. All queries,
including `JOIN`s, work as usual.

This section describes how to tier data in the Timescale console. For
information abotu manually tiering and untiering your data, see the
[self-hosted data tiering][self-hosted-data-tiering] section

## Turn on data tiering

You can turn on data tiering from the Services Overview page in the Timeascale console.

<Procedure>

### Turning on data tiering

1.  In the Timescale console, from the `Services` list, click the name of
    the service you want to modify.
1.  In the `Overview` tab, locate the `Data tiering` card, and click
    `Enable data tiering`. Confirm the action.
1.  Data tiering can take a few seconds to start. When it has started, the
    `Data tiering` card shows the amount of data that has been tiered.

    <img class="main-content__illustration"
    src="FIXME"
    width={1375} height={944}
    alt="The Timescale Console showing data tiering enabled" />

</Procedure>



[data-retention]: /use-timescale/:currentVersion:/data-retention/
[show_chunks]: /api/:currentVersion:/hypertable/show_chunks/
[self-hosted-data-tiering]: /self-hosted/:currentVersion:/data-tiering/
