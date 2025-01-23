1. Update the table statistics.

    ```bash
    psql $TARGET -c "ANALYZE;"
    ```

1. Verify the data in the target Timescale Cloud service.

   Check that your data is correct, and returns the results that you expect,

1. Enable any Timescale Cloud features you want to use.

   Migration from PostgreSQL moves the data only. Now manually enable Timescale Cloud features like
   [hypertables][about-hypertables], [data compression][data-compression] or [data retention][data-retention]
   while your database is offline.

1. Reconfigure your app to use the target database, then restart it.


[about-hypertables]: /use-timescale/:currentVersion:/hypertables/about-hypertables/
[data-compression]: /use-timescale/:currentVersion:/compression/about-compression/
[data-retention]: /use-timescale/:currentVersion:/data-retention/about-data-retention/