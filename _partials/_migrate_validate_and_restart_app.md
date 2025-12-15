1. Update the table statistics.

    ```bash
    psql $TARGET -c "ANALYZE;"
    ```

1. Verify the data in the target $SERVICE_LONG.

   Check that your data is correct, and returns the results that you expect,

1. Enable any $CLOUD_LONG features you want to use.

   Migration from $PG moves the data only. Now manually enable $CLOUD_LONG features like
   [hypertables][hypertables-section], [hypercore][hypercore] or [data retention][data-retention]
   while your database is offline.

1. Reconfigure your app to use the target database, then restart it.

[data-retention]: /use-timescale/:currentVersion:/data-retention/about-data-retention/
[hypercore]: /use-timescale/:currentVersion:/hypercore/
[hypertables-section]: /use-timescale/:currentVersion:/hypertables/
