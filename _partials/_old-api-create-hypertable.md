For $TIMESCALE_DB v2.23.0 and higher, the table is automatically partitioned on the first column in the table with a 
timestamp data type. For earlier versions, set `partition_column` to a time column.

If you are self-hosting $TIMESCALE_DB v2.22.1 to v2.20.0, to convert your data to the $COLUMNSTORE after a specific time 
interval, you have to call [add_columnstore_policy] after you call [CREATE TABLE][hypertable-create-table]  

If you are self-hosting $TIMESCALE_DB v2.19.3 and below, create a [$PG relational table][pg-create-table], 
then convert it using [create_hypertable][create_hypertable]. You then enable $HYPERCORE with a call 
to [ALTER TABLE][alter_table_hypercore].

[pg-create-table]: https://www.postgresql.org/docs/current/sql-createtable.html
[create_hypertable]: /api/:currentVersion:/hypertable/create_hypertable/
[alter_table_hypercore]: /api/:currentVersion:/hypercore/alter_table/
[add_columnstore_policy]: /api/:currentVersion:/hypercore/add_columnstore_policy/
[hypertable-create-table]: /api/:currentVersion:/hypertable/create_table/
[chunk_interval]: /api/:currentVersion:/hypertable/set_chunk_time_interval/