import HypercoreIntroShort from "versionContent/partials/_hypercore-intro-short.mdx";

Time-series data represents the way a system, process, or behavior changes over time. $HYPERTABLE_CAPs enable 
$TIMESCALE_DB to work efficiently with time-series data. $HYPERTABLE_CAPs are $PG tables that automatically partition 
your time-series data by time. Each $HYPERTABLE is made up of child tables called chunks. Each chunk is assigned a range 
of time, and only contains data from that range. When you run a query, $TIMESCALE_DB identifies the correct chunk and 
runs the query on it, instead of going through the entire table. 

<HypercoreIntroShort />

Because $TIMESCALE_DB is 100% $PG, you can use all the standard PostgreSQL tables, indexes, stored
procedures, and other objects alongside your $HYPERTABLEs. This makes creating and working with $HYPERTABLEs similar 
to standard $PG.

