* This works for $PG databases only as source. $TIMESCALE_DB is not yet supported.

* The source must be running $PG 13 or later.

* Schema changes must be co-ordinated.

  Make compatible changes to the schema in your $SERVICE_LONG first, then make
  the same changes to the source $PG instance.

* Ensure that the source $PG instance and the target $SERVICE_LONG have the same extensions installed.

  The $PG_CONNECTOR does not create extensions on the target. If the table uses
  column types from an extension, first create the extension on the
  target $SERVICE_LONG before syncing the table.

* There is WAL volume growth on the source $PG instance during large table copy.
