---
title: Limitations
excerpt: TimescaleDB features come with a few limitations that we are constantly working to remove. See the current and regularly updated list of limitations
keywords: [hypertables, distributed hypertables]
products: [cloud, mst, self_hosted]
---

# Limitations

While $TIMESCALE_DB generally offers capabilities that go beyond what
PostgreSQL offers, there are some limitations to using hypertables. 

## Hypertable limitations

*   Time dimensions (columns) used for partitioning cannot have NULL values.
*   Unique indexes must include all columns that are partitioning dimensions.
*   `UPDATE` statements that move values between partitions (chunks) are not
    supported. This includes upserts (`INSERT ... ON CONFLICT UPDATE`).
*   Foreign key constraints from a hypertable referencing another hypertable are not supported.


