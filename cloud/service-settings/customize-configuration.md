# Service Settings - Database configuration
Timescale Cloud allows you to customize many TimescaleDB and PostgreSQL
configuration options for each Service individually. Most configuration values
for a service are initially set in accordance with best practices given the
compute and storage settings of the service. Any time you increase or decrease
the compute for a Service, the most essential values are set to reflect the size
of the new service.

There are times, however, when your specific workload could require tuning some
of the many available TimescaleDB and PostgreSQL parameters. By providing the
ability to tune various runtime settings, Timescale Cloud provides the balance
and flexibility you need when running your workloads in our hosted environment.

<highlight type="warning">
You can modify most parameters without restarting the Timescale Cloud Service.
However, some changes do require a restart, resulting in some brief downtime
(usually about 30 seconds). An example of a change that needs a restart is modifying
the compute resources of a running service.
</highlight>

### View service operation details
To modify configuration parameters, first select the Service that you want to
modify. This displays the `service details`, with these tabs across the top:
Overview, Operations, Metrics, Logs, and Settings. Select `Settings`.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-settings.png" alt="View Timescale Cloud service settings"/>

### Modify basic parameters
Under the Settings tab, you can modify a limited set of the parameters that
are most often modified in a TimescaleDB or PostgreSQL instance. To modify a
configured value, click the value that you would like to change. This reveals
an editable field to apply your change. Clicking anywhere outside of that field
saves the value to be applied.

<highlight type="note">
The values for some of the parameters vary depending on the plan. For example,
the value for `max_connections` is exactly 25 in the smallest compute tier, but
ranges from 25 to 500 in the next tier.
</highlight>

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-settings-change.png" alt="Change Timescale Cloud configuration parameters"/>

### Apply configuration changes
When you have modified the configuration parameters that you would
like to change, click `Apply Changes`. For some changes, such as
`timescaledb.max_background_workers` (pictured below), the Service needs to be
restarted. In this case, the button reads `Restart and apply changes`.

Regardless of whether the service needs to be restarted or not, a confirmation
dialog is displayed which lists the parameters that are being modified. Click
`Confirm` to apply the changes (and restart if necessary).

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-settings-confirm.png" alt="Confirm Timescale Cloud configuration changes"/>
