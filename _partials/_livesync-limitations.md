* Schema changes must be co-ordinated. Make compatible changes to the schema in your $SERVICE_LONG first, then make
  the same changes to the source PostgreSQL instance.
* Ensure that the source $PG instance and the target $SERVICE_LONG have the same extensions installed.
  LiveSync does not create extensions on the target. If the table uses column types from an extension, 
  first create the extension on the target $SERVICE_LONG before syncing the table.
* There is WAL volume growth on the source PostgreSQL instance during large table copy.
* This works for PostgreSQL databases only as source. Timescaledb is not yet supported.
