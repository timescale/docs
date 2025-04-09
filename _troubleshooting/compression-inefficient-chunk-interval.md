---
title: Inefficient `compress_chunk_time_interval` configuration
section: troubleshooting
products: [cloud, mst, self_hosted]
topics: [compression, hypercore]
errors:
  - language: text
    message: |-
      compress_chunk_time_interval configured and primary dimension not first column in compress_orderby. 
      consider setting "<column name>" as first compress_orderby column
keywords: [compression, alter_table]
tags: [compression, alter_table]
---

When you configure `compress_chunk_time_interval` but do not set the primary dimension as the first column in `compress_orderby`, $TIMESCALE_DB decompresses chunks before merging. This makes merging less efficient. Set the primary dimension of the chunk as the first column in `compress_orderby` to improve efficiency. 



