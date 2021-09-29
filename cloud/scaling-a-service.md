# Resizing compute and storage in Timescale Cloud
Timescale Cloud allows you to resize compute (CPU/RAM) and storage independently
at any time. This is extremely useful when users have a need to increase storage
(for instance) but not compute. The Timescale Cloud console makes this very easy
to do for any service.

Before you modify the compute or storage settings for a Cloud Service, please
note the following limitations and when a change to these settings will result
in momentary downtime.

**Storage**: Storage changes are applied with no downtime, typically available
within a few seconds. Other things to note about storage changes:
*   At the current time, storage can only be _increased_ in size.
*   Storage size changes can only be made once every six (6) hours.
*   Storage can be modified in various increments between 10GB and 10TB.

**Compute**: Modifications to the compute size of your service (increases or
decreases) can be applied at any time, however, please note the following:
*   **_There is momentary downtime_** while the compute settings are applied.
    In most cases, this downtime is less than 30 seconds.
*   Because there will be an interruption to your service, you should plan
 accordingly to have the settings applied at an appropriate service window.

## View service operation details
To modify the compute or storage of your Service, first select the Service that
you want to modify. This displays the `service details`, which list four tabs
across the top: Overview, Operations, Metrics, and Logs. Select `Operations`.

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/forge_images/timescale-forge-service-operations.png" alt="View Timescale Forge service operational information"/>

## Display the current service resources
Under the Operations tab, you can perform the same basic operations as before
(Reset password, Pause service, Delete service). There is now a second, advanced
section on the left labeled `Resources`. Selecting this option displays the
current resource settings for the Service.

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/forge_images/timescale-forge-service-resources-4tb.png" alt="View Timescale Forge service resource information"/>

## Modify service resources
Once you have navigated to the current Service resources, it's easy to modify
either the compute (CPU/Memory) or disk size. As you modify either setting,
notice that the current and new hourly charges are displayed in real-time
so that it's easy to verify how these changes will impact your costs.

As noted above, changes to disk size will not cause any downtime.  However,
the platform currently only supports _increasing_ disk size (not decreasing it),
and you can increase disk size once every six (6) hours.

When you're satisfied with the changes, click `Apply` (storage resizes only) or
`Apply and Restart` (when modifying compute resources).

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/forge_images/timescale-forge-service-restart-4tb.png" alt="View Timescale Forge service apply resize"/>
# Compute resources and disk size
You can use the Timescale Cloud console to change how much CPU and memory
resources your service has available, as well as change the disk size for your
service. You can adjust this manually as required, or for disk size you can use autoscaling.

## Change resource allocations manually
When you change the disk size, the changes are applied with no downtime, and the
new size generally becomes available within a few seconds. You can change the
disk size once every six hours, and you can only increase the size, not decrease
it. You can have a disk up to 10&nbsp;TB in size.

You can change the CPU and memory allocation for your service at any time, with
minimal downtime, usually less than thirty seconds. The new resources become
available as soon as the service restarts. You can change the CPU and memory
allocation up or down, as frequently as required.

<highlight type="warning">
Changing your compute settings usually requires a short downtime. Make sure you
plan for this before you begin!
</highlight>

### Procedure: Changing resource allocations manually
1.  In the Timescale Cloud console, from the `Services` list, click the name of
    the service you want to modify.
1.  In the `Service details` page, navigate to the `Operations` tab, and click
    `Resources`.
1.  In the `Resize CPU / memory` field, select the new CPU and memory
    allocation.
1.  In the `Increase disk size` field, adjust the slider to the new disk size.
1.  Review the new allocations and costs in the comparison chart.
1.  Click `Apply` to save your changes. If you have changed the CPU and memory
    allocation, your service will go down briefly while the changes are applied.
    <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-resources-configure.png" alt="Configure resource allocations"/>

## Configure autoscaling for disk size
Disk size autoscaling is enabled by default on most services. When you consume
95% or more of your existing disk space, disk size is automatically increased to
the next size available, up to a configurable limit.

Autoscaling can change the disk size once every six hours. When the increase is
requested, the used space is optimized before the new limit is applied. As your
disk size increases, this optimization process can take longer, and the six
hours does not start running until the new size is applied, after the
optimization is complete.

Autoscaling can only increase disk size, not decrease it. You can have a disk up
to 10&nbsp;TB in size.

### Procedure: Configuring autoscaling for disk size
1.  In the Timescale Cloud console, from the `Services` list, click the name of
    the service you want to modify.
1.  In the `Service overview` page, navigate to the `Operations` tab, and click
    `Autoscaling`.
1.  Toggle `Enable storage autoscaling` to turn autoscaling on or off.
1.  In the `Storage autoscaling limit` field, adjust the slider to set the
    maximum disk size. Autoscaling can not increase the disk size higher than
    this limit.
1.  Review the new allocations and costs in the comparison chart.
1.  Click `Apply` to save your changes. The new disk size generally becomes
    available within a few seconds.
    <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-autoscale-configure.png" alt="Configure autoscaling disk size"/>
