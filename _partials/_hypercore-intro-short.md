
[$HYPERCORE_CAP][hypercore] is the hybrid row-columnar storage engine in $TIMESCALE_DB used by $HYPERTABLEs. Traditional 
databases force a trade-off between fast inserts (row-based storage) and efficient analytics 
(columnar storage). $HYPERCORE_CAP eliminates this trade-off, allowing real-time analytics without sacrificing 
transactional capabilities.

$HYPERCORE_CAP dynamically stores data in the most efficient format for its lifecycle:

* **Row-based storage for recent data**: the most recent chunk (and possibly more) is always stored in the $ROWSTORE, 
   ensuring fast inserts, updates, and low-latency single record queries. Additionally, row-based storage is used as a 
   writethrough for inserts and updates to columnar storage.
* **Columnar storage for analytical performance**: chunks are automatically compressed into the $COLUMNSTORE, optimizing 
   storage efficiency and accelerating analytical queries.

Unlike traditional columnar databases, $HYPERCORE allows data to be inserted or modified at any stage, making it a 
flexible solution for both high-ingest transactional workloads and real-time analytics—within a single database.


[hypercore]: /use-timescale/:currentVersion:/hypercore/
