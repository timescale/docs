If you run intensive queries on your $SERVICE_SHORTs, you might
encounter out of memory (OOM) errors. This occurs if your query consumes more
memory than is available.

When this happens, an `OOM killer` process shuts down $PG processes using
`SIGKILL` commands until the memory usage falls below the upper limit. Because
this kills the entire server process, it usually requires a restart.

To prevent $SERVICE_SHORT disruption caused by OOM errors, $CLOUD_LONG attempts to
shut down only the query that caused the problem. This means that the
problematic query does not run, but that your $SERVICE_SHORT continues to
operate normally.

* If the normal OOM killer is triggered, the error log looks like this:

   ```yml
   2021-09-09 18:15:08 UTC [560567]:TimescaleDB: LOG: server process (PID 2351983) was terminated by signal 9: Killed
   ```

  Wait for the $SERVICE_SHORT to come back online before reconnecting.

* $CLOUD_LONG shuts the client connection only

  If $CLOUD_LONG successfully guards the $SERVICE_SHORT against the OOM killer, it shuts
  down only the client connection that was using too much memory. This prevents
  the entire $SERVICE_SHORT from shutting down, so you can reconnect immediately. The error log looks like this:

   ```yml
   2022-02-03 17:12:04 UTC [2253150]:TimescaleDB: tsdbadmin@tsdb,app=psql [53200] ERROR: out of memory
   ```