---
title: Hypertables and chunks
excerpt: TigerAPI reference for dealing with hypertables and chunks. Includes all SQL functions and views related to managing hypertables, chunks, dimensions, tablespaces, and indexing
keywords: [hypertables, chunks]
products: [cloud, mst, self_hosted]
---
import OldCreateHypertable from "versionContent/_partials/_old-api-create-hypertable.mdx";
import HypertableOverview from "versionContent/_partials/_hypertable-intro.mdx";
import CreateHypertablePolicyNote from "versionContent/_partials/_create-hypertable-columnstore-policy-note.mdx";

# Hypertables and chunks

<HypertableOverview />

For more information about using hypertables, including chunk size partitioning,
see the [hypertable section][hypertables-section].

To create a [$HYPERTABLE][hypertables-section] for your time-series data, use [CREATE TABLE][hypertable-create-table].
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
  tsdb.segmentby = 'device',
  tsdb.orderby = 'time DESC'
);
```

<CreateHypertablePolicyNote />

<Highlight type="note" >

<OldCreateHypertable />

</Highlight>

[hypertable-create-table]: /api/:currentVersion:/hypertable/create_table/
[hypertables-section]: /use-timescale/:currentVersion:/hypertables/
[hypertables-section]: /use-timescale/:currentVersion:/hypertables/
[secondary-indexes]: /use-timescale/:currentVersion:/hypercore/secondary-indexes/
