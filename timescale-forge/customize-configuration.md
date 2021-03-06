# Customize database configuration in Timescale Forge

Timescale Forge allows you to customize many TimescaleDB and PostgreSQL configuration
options for each Service individually. Most configuration values for a Service
are initially set in accordance with best practices given the compute and storage
settings of the Service. Any time you increase or decrease the compute for a Service
the most essential values are set to reflect the size of the new Service.

There are times, however, when your specific workload may require tuning some of
the many available TimescaleDB and PostgreSQL parameters. By providing the ability
to tune various runtime settings, Timescale Forge provides the balance and flexibility you need when running your workloads
in our hosted environment.

>:WARNING: Modifications of most parameters can be applied without restarting
the Timescale Forge Service. However, as when modifying the compute resources
of a running Service, some settings will require that a restart be performed,
resulting in some brief downtime (usually about 30 seconds).

### Step 1: View Service operation details  [](service-details)
To modify configuration parameters, first select the Service that 
you want to modify. This will display the _service details_ which list tabs
across the top: Overview, Operations, Metrics, Logs, and Settings.

Select **_Settings_**.

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/forge_images/timescale-forge-service-settings-basic.png" alt="View Timescale Forge service operational information"/>

### Step 2: Modify basic parameters [](basic-parameters)
Under the Settings tab, you can modify a limited set of the parameters that are
most often modified in a TimescaleDB or PostgreSQL instance. To modify a 
configured value, simply click into on the **_value_** that you would like to
change. This will reveal an editable field to apply your change. Clicking anywhere
outside of that field will save the value to be applied.

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/forge_images/timescale-forge-service-settings-modify.png" alt="View Timescale Forge service settings modification"/>

### Step 3: Apply configuration changes [](apply-changes)
Once you have modified the basic configuration parameters that you would like to
change, click the **Apply Changes** button. For some changes, such as `timescaledb.max_background_workers`
(pictured below), the Service needs to be restarted. Therefore, the
button will read **Restart and apply changes**.

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/forge_images/timescale-forge-service-settings-apply.png" alt="View Timescale Forge service apply settings parameter changes"/>

Regardless of whether the Service needs to be restarted or not, a confirmation
dialog will be displayed which lists the parameters that will be modified. Click
**Confirm** to apply the changes (and restart if necessary).

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/forge_images/timescale-forge-service-settings-confirm.png" alt="View Timescale Forge service configuration changes confirmation dialog"/>


## Configuring Advanced Parameters [](advanced-parameters)
It is also possible to configure a wide variety of Service database parameters
by flipping the **Show advanced parameters** toggle in the upper-right corner
of the **Settings** tab.

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/forge_images/timescale-forge-service-settings-advanced.png" alt="View Timescale Forge service configuration changes confirmation dialog"/>

Once toggled, a scrollable (and searchable) list of configurable parameters will
be displayed.

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/forge_images/timescale-forge-service-settings-advanced-search.png" alt="View Timescale Forge service configuration changes confirmation dialog"/>

As with the basic database configuration parameters, any changes will be highlighted
and the **Apply changes** (or **Restart and apply changes**) button will be
available to click, prompting you to confirm any changes before the Service is
modified.
