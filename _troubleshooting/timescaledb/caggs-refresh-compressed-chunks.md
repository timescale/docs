---
title: Cannot refresh compressed chunks of a continuous aggregate
section: troubleshooting
errors:
  - language: bash
    message: |-
      ERROR:  cannot update/delete rows from chunk <CHUNK_NAME> as it is compressed
topics: [continuous aggregates, compression]
apis:
  - [continuous aggregates, refresh_continuous_aggregate()]
  - [continuous aggregates, add_continuous_aggregate_policy()]
keywords: [continuous aggregates]
tags: [materialized views]
---

Compressed chunks of a continuous aggregate can't be refreshed. This follows
from a general limitation where compressed chunks can't be updated or deleted.

If you receive historical data and must refresh a compressed region, first
[decompress the chunk][decompression]. Then manually run
[`refresh_continuous_aggregate`][refresh_continuous_aggregate].

[decompression]: /timescaledb/:currentVersion:/how-to-guides/compression/decompress-chunks/
[refresh_continuous_aggregate]: /api/:currentVersion:/continuous-aggregates/refresh_continuous_aggregate/
