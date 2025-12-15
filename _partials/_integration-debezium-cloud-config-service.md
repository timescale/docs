

1. **Connect to your $SERVICE_LONG**

   For $CLOUD_LONG, open an [SQL editor][run-queries] in [$CONSOLE][open-console]. For self-hosted, use [`psql`][psql].

1. **Enable logical replication for your $SERVICE_LONG**

   1. Run the following command to enable logical replication:

      ```sql
      ALTER SYSTEM SET wal_level = logical;
      SELECT pg_reload_conf();
      ```

   1. Restart your $SERVICE_SHORT.

1. **Create a table**

   Create a table to test the integration. For example:

     ```sql
     CREATE TABLE sensor_data (
     id SERIAL PRIMARY KEY,
     device_id TEXT NOT NULL,
     temperature FLOAT NOT NULL,
     recorded_at TIMESTAMPTZ DEFAULT now()
     );
     ```

[open-console]: https://console.cloud.timescale.com/dashboard/services
[psql]: /getting-started/:currentVersion:/run-queries-from-console/#connect-to-your-service-using-psql
[run-queries]: /getting-started/:currentVersion:/run-queries-from-console/
