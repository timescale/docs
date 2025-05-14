
[$HYPERCORE_CAP][hypercore] is the $COMPANY hybrid row-columnar 
storage engine used by $HYPERTABLEs. $HYPERTABLE_CAPs partition your data in chunks. Chunks stored in the $ROWSTORE 
use a row-oriented data format optimized for high-speed inserts and updates. Chunks stored in the $COLUMNSTORE are 
compressed into a columnar data format optimized for analytics. You ingest `hot` data into the $ROWSTORE. As data cools 
and becomes more suited for analytics, $CLOUD_LONG automatically converts these chunks of data to the $COLUMNSTORE. 
You define the moment when data is converted using a $COLUMNSTORE policy.


[hypercore]: /use-timescale/:currentVersion:/hypercore/
