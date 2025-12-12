For $TIMESCALE_DB [v2.23.0][tsdb-release-2-23-0] and higher, the table is automatically partitioned on the first column 
in the table with a timestamp data type. If multiple columns are suitable candidates as a partitioning column, 
$TIMESCALE_DB throws an error and asks for an explicit definition. For earlier versions, set `partition_column` to a 
time column. 

If you are self-hosting $TIMESCALE_DB [v2.20.0][tsdb-release-2-23-0] to [v2.22.1][tsdb-release-2-23-0], to convert your 
data to the $COLUMNSTORE after a specific time interval, you have to call [add_columnstore_policy] after you call 
[CREATE TABLE][hypertable-create-table]  

If you are self-hosting $TIMESCALE_DB [v2.19.3][tsdb-release-2-19-3] and below, create a [$PG relational table][postgres-createtable], 
then convert it using [create_hypertable][create_hypertable]. You then enable $HYPERCORE with a call 
to [ALTER TABLE][alter_table_hypercore].

[postgres-createtable]: https://www.postgresql.org/docs/current/sql-createtable.html
[create_hypertable]: /api/:currentVersion:/hypertable/create_hypertable/
[alter_table_hypercore]: /api/:currentVersion:/hypercore/alter_table/
[hypertable-create-table]: /api/:currentVersion:/hypertable/create_table/
[tsdb-release-2-23-0]: https://github.com/timescale/timescaledb/releases/tag/2.23.0
[tsdb-release-2-19-3]: https://github.com/timescale/timescaledb/releases/tag/2.19.3
