---
title: Configuring Hypershift
excerpt: Migrate an existing PostgreSQL database to Timescale Cloud in a single step
products: [cloud]
keywords: [data migration, Hypershift]
tags: [ingest, Hypershift, postgresql]
---

# Hypershift configuration file

You can use Hypershift&nbsp;0.3&nbsp;(beta) to migrate existing PostgreSQL
databases in one step, and enable compression and hypertable creation on the
fly.

Hypershift uses a YAML configuration file to determine how to set up your new
Timescale database. You can create your own file, or use the example file as a
starting point. To complete your file, you need these details for the tables
that you want to convert to hypertables:

*   The schema which contains the table
*   The name of the table
*   The name of the `time` column of that table
*   The chunk time interval to use
*   The compression policy you want to use

If you are not sure what chunk time interval to use, see the
[time partitioning section][chunk-time].

Use this format:

```yml
- schema: public
  name: <TABLE_NAME>
  time_column_name: <TIME_COLUMN_NAME>
  chunk_time_interval: "12h"
  compress:
    after: "48h"
    segmentby:
      - <COLUMN_NAME>
    orderby:
      - time desc
```

[chunk-time]: /use-timescale/:currentVersion:/hypertables/about-hypertables#best-practices-for-time-partitioning
