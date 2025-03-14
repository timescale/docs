* Schema changes must be co-ordinated. Make compatible changes to the schema in your $SERVICE_LONG first, then make
  the same changes to the source PostgreSQL instance.
* There is WAL volume growth on the source PostgreSQL instance during large table copy.
* This works for PostgreSQL databases only as source. Timescaledb is not yet supported.
