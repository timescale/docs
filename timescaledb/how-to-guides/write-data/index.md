# Writing data

If you are familiar with SQL, then the commands for writing to the database
should be familiar to you.  TimescaleDB uses standard SQL commands for writing data,
including INSERT, UPDATE, and DELETE as well as UPSERTs through ON CONFLICT statements;
and it all works as expected with changes to hypertables propagating down to
individual chunks.
