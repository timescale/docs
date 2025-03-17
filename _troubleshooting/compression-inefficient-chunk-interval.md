---
title: Inefficient `compress_chunk_time_interval` configuration
section: troubleshooting
products: [cloud, mst, self_hosted]
topics: [compression]
errors:
  - language: text
    message: |-
      compress_chunk_time_interval configured and primary dimension not first column in compress_orderby. consider setting "<column name>" as first compress_orderby column
keywords: [compression, alter_table]
tags: [compression, alter_table]
---

When `compress_chunk_time_interval` is configured but `compress_orderby` does not have the primary dimension as the first column, chunk merging is less efficient as chunks have to be decompressed to be merged. 

