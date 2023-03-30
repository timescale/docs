---
title: Cannot refresh compressed chunks of a continuous aggregate
section: troubleshooting
errors:
  - language: bash
    message: |-
      ERROR:  cannot update/delete rows from chunk <CHUNK_NAME> as it is compressed
products: [cloud, mst, self_hosted]
topics: [continuous aggregates, compression]
apis:
  - [continuous aggregates, refresh_continuous_aggregate()]
  - [continuous aggregates, add_continuous_aggregate_policy()]
keywords: [continuous aggregates]
tags: [materialized views]
---

<!---
* Use this format for writing troubleshooting sections:
 - Cause: What causes the problem?
 - Consequence: What does the user see when they hit this problem?
 - Fix/Workaround: What can the user do to fix or work around the problem? Provide a "Resolving" Procedure if required.
 - Result: When the user applies the fix, what is the result when the same action is applied?
* Copy this comment at the top of every troubleshooting page
-->

Compressed chunks of a continuous aggregate can't be refreshed. This follows
from a general limitation where compressed chunks can't be updated or deleted.

If you receive historical data and must refresh a compressed region, first
[decompress the chunk][decompression]. Then manually run
[`refresh_continuous_aggregate`][refresh_continuous_aggregate].

[decompression]: /use-timescale/:currentVersion:/compression/decompress-chunks/
[refresh_continuous_aggregate]: /api/:currentVersion:/continuous-aggregates/refresh_continuous_aggregate/
