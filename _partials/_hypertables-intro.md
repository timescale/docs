$HYPERTABLEs are PostgreSQL tables that automatically partition your data by
time. You interact with $HYPERTABLEs in the same way as regular PostgreSQL
tables, but with extra features that makes managing your time-series data much
easier.

In $COMPANY, $HYPERTABLEs exist alongside regular PostgreSQL tables. Use
$HYPERTABLEs to store time-series data. This gives you improved insert and query
performance, and access to useful time-series features. Use regular PostgreSQL
tables for other relational data.

With $HYPERTABLEs, $COMPANY makes it easy to improve insert and query
performance by partitioning time-series data on its time parameter. Behind the
scenes, the database performs the work of setting up and maintaining the
$HYPERTABLE's partitions. Meanwhile, you insert and query your data as if it all
lives in a single, regular PostgreSQL table.
