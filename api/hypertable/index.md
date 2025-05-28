---
title: Hypertables and chunks
excerpt: Timescale Cloud API reference for dealing with hypertables and chunks. Includes all SQL functions and views related to managing hypertables, chunks, dimensions, tablespaces, and indexing
keywords: [hypertables, chunks]
products: [cloud, mst, self_hosted]
---
import OldCreateHypertable from "versionContent/_partials/_old-api-create-hypertable.mdx";
import HypertableIntro from "versionContent/_partials/_hypertable-intro.mdx";

# Hypertables and chunks

<HypertableIntro />

For more information about using hypertables, including chunk size partitioning,
see the [hypertable section][hypertable-docs].

## The $HYPERTABLE workflow

Best practice for using a $HYPERTABLE is to:

<Procedure>

1. **Create a $HYPERTABLE**

   Create a [$HYPERTABLE][hypertables-section] for your time-series data using [CREATE TABLE][hypertable-create-table].
   For [efficient queries][secondary-indexes] on data in the columnstore, remember to `segmentby` the column you will
   use most often to filter your data. For example:

   ```sql
   CREATE TABLE conditions (
      time        TIMESTAMPTZ       NOT NULL,
      location    TEXT              NOT NULL,
      device      TEXT              NOT NULL,
      temperature DOUBLE PRECISION  NULL,
      humidity    DOUBLE PRECISION  NULL
   ) WITH (
      tsdb.hypertable,
      tsdb.partition_column='time',
      tsdb.segmentby = 'device',
      tsdb.orderby = 'time DESC'
   );
   ```
   <OldCreateHypertable />

1. **Set the $COLUMNSTORE policy**

   ```sql
   CALL add_columnstore_policy('conditions', after => INTERVAL '1d');
   ```

</Procedure> 

[create_hypertable]: /api/:currentVersion:/hypertable/create_hypertable/
[hypertable-docs]: /use-timescale/:currentVersion:/hypertables/
[hypertables-section]: /use-timescale/:currentVersion:/hypertables/
[hypertable-create-table]: /api/:currentVersion:/hypertable/create_table/
[hypercore]: /use-timescale/:currentVersion:/hypercore/
[secondary-indexes]: /use-timescale/:currentVersion:/hypercore/secondary-indexes/
