---
title: Hypertables and chunks
excerpt: Timescale Cloud API reference for dealing with hypertables and chunks. Includes all SQL functions and views related to managing hypertables, chunks, dimensions, tablespaces, and indexing
keywords: [hypertables, chunks]
---

import HypertableIntro from "versionContent/_partials/_hypertable-intro.mdx";

# Hypertables and chunks

<HypertableIntro />

For more information about using hypertables, including chunk size partitioning,
see the [hypertable section][hypertable-docs].

## The $HYPERTABLE workflow

Best practice for using $HYPERTABLE is to:

<Procedure>

1. **Create a $HYPERTABLE**
   ```sql
   CREATE TABLE conditions (
      time        TIMESTAMPTZ       NOT NULL,
      location    TEXT              NOT NULL,
      device      TEXT              NOT NULL,
      temperature DOUBLE PRECISION  NULL,
      humidity    DOUBLE PRECISION  NULL
   ) WITH (
      tsdb.hypertable,
      tsdb.partition_column='time'
   );
   ```
   
1. **Enable $COLUMNSTORE**
   ```sql
   ALTER TABLE conditions SET (
     timescaledb.enable_columnstore = true,
     timescaledb.segmentby = 'device'
   ); 
   ```

1. **Set the $COLUMNSTORE policy**

   ```sql
   CALL add_columnstore_policy('conditions', after => INTERVAL '1d');
   ```

</Procedure> 

[create_hypertable]: /api/:currentVersion:/hypertable/create_hypertable/
[hypertable-docs]: /use-timescale/:currentVersion:/hypertables/
