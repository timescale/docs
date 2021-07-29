# Compute resources and disk size
You can use the Timescale Forge console to change how much CPU and memory
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

<highlight="warning">
Changing your compute settings usually requires a short downtime. Make sure you
plan for this before you begin!
</highlight>

### Procedure: Changing resource allocations manually
1.  In the Timescale Forge console, from the `Services` list, click the name of
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

Autoscaling can change the disk size once every six hours, and can only increase
the size, not decrease it. You can have a disk up to 10{nbsp}TB in size.

### Procedure: Configuring autoscaling for disk size
1.  In the Timescale Forge console, from the `Services` list, click the name of
    the service you want to modify.
1.  In the `Service details` page, navigate to the `Operations` tab, and click
    `Autoscaling`.
1.  Toggle `Enable storage autoscaling` to turn autoscaling on or off.
1.  In the `Storage autoscaling limit` field, adjust the slider to set the
    maximum disk size. Autoscaling can not increase the disk size higher than
    this limit.
1.  Review the new allocations and costs in the comparison chart.
1.  Click `Apply` to save your changes. The new disk size generally becomes
    available within a few seconds.
    <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-autoscale-configure.png" alt="Configure autoscaling disk size"/>
