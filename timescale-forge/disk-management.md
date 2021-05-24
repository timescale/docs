# Disk management

Timescale Forge contains several mechanisms for managing disk space on your
services. There are four key tasks that Forge performs to handle disk space:

1.  Detect if storage capacity begins to fill up
1.  Notify you about the growth
1.  Automatically activate overload protections
1.  Allow you to return your database to a normal state

This section explains what the various mechanisms are, and how to best make use
of them.

## Continuous storage monitoring

Timescale Forge continuously monitors the health and resource consumption of all
database services. You can check your health data by navigating to the `metrics`
tab in your service dashboard. These metrics are also monitored by the Timescale
operations team.

*Insert screenshot here*

If your database exceeds a storage threshold of available resources, some
automated actions are triggered, including notifications, and preventative
actions.

## Automated user alerting

When your disk usage exceeds certain thresholds, you will recieve email notifications. These notifications occur at:

*   75%
*   85%
*   95%

So that you aren't overwhelmed by automated message, the alerting thresholds use low- and high-watermarks, and only one message is sent per database per day.

## Automated overload protection

If your database continues to increase in size past these thresholds, automated overload protection is activated when your disk becomes 99% full. When this happens, your database is put into read-only mode, and you receive a notification on email and the Timescale Forge console shows the changed status.

When this happens, you can still query your database, but you cannot add any new data to it. This is to ensure that your disk does not fill up to 100%, which could prevent you from recovering the database.

With your database in read-only mode, you need to decide if you are going to increase your storage capacity, or reduce the size of your database.

## Online storage resizing

You can increase your storage size in the Timescale Forge console.

<highlight type="warning">
You can only resize your services once every six hours.
</highlight>

### Procedure: Increasing service resources
1.  In the Timescale Forge console, navigate to `Services` and click the service you want to adjust. Navigate to the `Operations` tab, and go to the `Resources` section.
1.  Adjust the sliders for CPU and disk size as required. If you increase the disk size past a certain point, you may also need to increase the CPU size to handle the increased disk size.
1.  Review the new sizes and costs in the panel on the right-hand side, and click `Restart and apply` when you are happy with the changes.
1.  The resources take a few seconds to increase, and when the increase is complete, your database is immediately available on the new resources. If your database is in read-only mode, the read-only protection is automatically removed, and you can begin writing data immediately.

*Insert screenshot here*

## Storage recovery

If you need to perform actions on your database to reduce your data usage, you can turn off read-only mode. For example, you need read-write access if you want to compress data, delete rows or tables, or drop old data using data retention policies.

<highlight type="warning">
We highly recommend that you do not manually enable read-write mode on a database that is over 99% capacity. You should consider increasing the disk size before you do this. Alternatively, you can enable read-write access on an individual session, while leaving the database in read-only mode.
</highlight>

### Procedure: Enabling read-write access on an individual session
1.  Connect to your database using `psql` and turn off read-only protection for the current session:
    ```sql
    SET default_transaction_read_only TO off;
    ```
1.  Turn on compression:
    ```sql
    ALTER TABLE purchases SET (
      timescaledb.compress,
      timescaledb.compress_segmentby = 'sku'
    );

    SELECT add_compression_policy('purchases', interval '1 day');
    ```
1.  You can also create a data retention policy to only retain, for example, data
    for 90 days. This starts working immediately on old data:
    ```sql
    SELECT add_retention_policy('purchases', interval '90 days');
    ```

As soon as the storage consumption drops below the threshold, the read-only protection is automatically removed, and you can start writing data again.
