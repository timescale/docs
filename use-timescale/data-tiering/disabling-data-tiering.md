---
title: Creating a tiering policy
excerpt: How to create a tiering policy
product: [ cloud ]
keywords: [ tiered storage, tiering ]
tags: [ storage, data management ]
---

# Disabling tiering on a hypertable

If you no longer want to use tiered storage for a particular hypertable, you 
can drop the associated metadata by calling the `disable_tiering` function.

In order to use this API, first call [remove_tiering_policy][tiering-policy] to drop 
the tiering policy associated with this hypertable. Second, make sure that there is 
no tiered data associated with this hypertable.

This query lists the tiered chunks associated with this hypertable.
```sql
select * from timescaledb_osm.tiered_chunks 
```

If you have any tiered chunks, you must either untier this data or drop these chunks 
from tiered storage. You can use the [untier_chunk][untier-data] procedure 
to untier chunks that have already been tiered to local storage.

If these two preconditions are met, you can use the disable_tiering function to drop all tiering related metadata for the hypertable.
```sql
select disable_tiering('my_hypertable_name');
```

You can verify that tiering has been disabled by listing the hypertables 
that have tiering enabled.
```sql
select * from timescaledb_osm.tiered_hypertables;
```

[untier-data]: /use-timescale/:currentVersion:/data-tiering/untier-data/
[tiering-policy]: /use-timescale/:currentVersion:/data-tiering/creating-data-tiering-policy/
