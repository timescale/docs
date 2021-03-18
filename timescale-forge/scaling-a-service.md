# Resizing Compute and Storage in Timescale Forge

Timescale Forge allows you to resize compute (CPU/RAM) and storage independently 
at any time. This is extremely useful when users have a need to increase storage 
(for instance) but not compute. The Timescale Forge console makes this very easy 
to do for any service.

Before you modify the compute or storage settings for a Forge Service, please 
note the following limitations and when a change to these settings will result in momentary downtime.

**Storage**: Storage changes are applied with no downtime, typically available 
within a few seconds. Other things to note about storage changes:
 * At the current time, storage can only be _increased_ in size.
 * Storage size changes can only be made once every six (6) hours.
 * Storage can be modified in various increments between 25GB and 4TB.

**Compute**: Modifications to the compute size of your service (increases or 
decreases) can be applied at any time, however, please note the following:
 * **_There will be momentary downtime_** while the compute settings are applied. 
 In most cases, this downtime will be less than 30 seconds.
 * Because there will be an interruption to your service, you should plan 
 accordingly to have the settings applied at an appropriate service window.

## Step 1: View Service operation details [](service-details)
To modify the compute or storage of your Service, first select the Service that 
you want to modify. This will display the _service details_ which list four tabs
across the top: Overview, Operations, Metrics, and Logs.

Select **_Operations_**.

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/forge_images/timescale-forge-service-operations.png" alt="View Timescale Forge service operational information"/>

## Step 2: Display the current Service Resources [](service-resources)
Under the Operations tab, you can perform the same **Basic** operations as before 
(Reset password, Pause service, Delete service). There is now a second, advanced
section on the left labeled **Resources**. Selecting this option displays the 
current resource settings for the Service.

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/forge_images/timescale-forge-service-resources-4tb.png" alt="View Timescale Forge service resource information"/>

## Step 3: Modify Service resources [](modify-resources)
Once you have navigated to the current Service resources, it's easy to modify 
either the compute (CPU/Memory) or disk size. As you modify either setting, 
notice that the current and new hourly charges are displayed in real-time
so that it's easy to verify how these changes will impact your costs.

As noted above, changes to disk size will not cause any downtime.  However,
the platform currently only supports _increasing_ disk size (not decreasing it), 
and you can increase disk size once every six (6) hours. 

When you're satisfied with the changes, click **Apply** (storage resizes only) or **Apply and Restart** (when modifying compute resources).

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/forge_images/timescale-forge-service-restart-4tb.png" alt="View Timescale Forge service apply resize"/>
