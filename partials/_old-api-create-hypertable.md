If you are self-hosting $TIMESCALE_DB v2.19.3 and below, create a [$PG relational table][pg-create-table], 
then convert it using [create_hypertable][create_hypertable]. You then enable $HYPERCORE with a call 
to [ALTER TABLE][alter_table_hypercore].


[pg-create-table]: https://www.postgresql.org/docs/current/sql-createtable.html
[create_hypertable]: /api/:currentVersion:/hypertable/create_hypertable/
[alter_table_hypercore]: /api/:currentVersion:/hypercore/alter_table/
