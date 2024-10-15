---
title: Disable tiering on a hypertable
excerpt: How to create a tiering policy
product: [ cloud ]
keywords: [ tiered storage, tiering ]
tags: [ storage, data management ]
---

# Disable tiering on a hypertable

If you no longer want to use tiered storage for a particular hypertable, you 
can drop the associated metadata by calling the `disable_tiering` function.

To disable tiering on a hypertable:

<Procedure>

1. Call [remove_tiering_policy][tiering-policy] and drop any tiering policy associated with this hypertable.

1. Make sure that there is no tiered data associated with this hypertable:

   1. List the tiered chunks associated with this hypertable:
      ```sql
      select * from timescaledb_osm.tiered_chunks 
      ```

   1. If you have any tiered chunks, either untier this data, or drop these chunks from tiered storage. 

      You can use the [untier_chunk][untier-data] procedure to untier chunks that have already been tiered to local storage.

1. Use `disable_tiering` to drop all tiering related metadata for the hypertable:

   ```sql
   select disable_tiering('my_hypertable_name');
   ```

1. Verify that tiering has been disabled by listing the hypertables that have tiering enabled.
   ```sql
   select * from timescaledb_osm.tiered_hypertables;
   ```

</Procedure>

And that is it, you have disable tiering on a hypertable. 

[untier-data]: /use-timescale/:currentVersion:/data-tiering/untier-data/
[tiering-policy]: /use-timescale/:currentVersion:/data-tiering/creating-data-tiering-policy/
