# Service operations - Autoscaling
Timescale Cloud allows you to resize compute (CPU/RAM) and storage independently
at any time. This is useful when you need to do something like increasing your
storage capacity, but not your compute size. You can resize compute and storage
in the Timescale Cloud console for any service, including members of multi-node
clusters.

Storage changes are applied with no downtime, and the new storage capacity is
usually available for use within a few seconds.
*   Storage can only be increased in size. You cannot decrease the amount of
    storage capacity your service has available.
*   Storage size changes can only be made once every six hours.
*   Storage can range in size from 10&nbsp;GB to 16&nbsp;TB,
     and can be changed in various increments.

You can increase or decrease the compute size of your service at any time, with
a short downtime.
*   There is momentary downtime while the new compute settings are applied.
    In most cases, this downtime is less than 30 seconds.
*   Because compute changes require an interruption to your service, plan
    accordingly so that the settings are applied during an appropriate service
    window.

To modify the compute or storage of your service, select the service that you
want to modify, and navigate to the `Operations` tab. Go to the `Resources`
section to see the current resource settings for the service.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-resources-unchanged.png" alt="View Timescale Cloud service resource information"/>

When you change compute or storage settings, the current and new hourly charges
are displayed immediately so that you can verify how the changes impact your
costs.

You can use the Timescale Cloud console to change how much CPU and memory
resources your service has available, as well as change the disk size for your
service. You can adjust this manually as required, or for disk size you can use autoscaling.

## Change resource allocations manually
When you change the disk size, the changes are applied with no downtime, and the
new size generally becomes available within a few seconds. You can change the
disk size once every six hours, and you can only increase the size, not decrease
it. You can have a disk up to 16&nbsp;TB in size.

You can change the CPU and memory allocation for your service at any time, with
minimal downtime, usually less than thirty seconds. The new resources become
available as soon as the service restarts. You can change the CPU and memory
allocation up or down, as frequently as required.

<highlight type="warning">
Changing your compute settings usually requires a short downtime. Make sure you
plan for this before you begin!
</highlight>

<procedure>

### Changing resource allocations manually
1.  In the Timescale Cloud console, from the `Services` list, click the name of
    the service you want to modify.
1.  In the `Service details` page, navigate to the `Operations` tab, and click
    `Resources`.
1.  In the `Resize CPU / memory` field, select the new CPU and memory
    allocation.
1.  In the `Increase disk size` field, adjust the slider to the new disk size.
1.  Review the new allocations and costs in the comparison chart.
1.  Click `Apply` to save your changes. If you have changed the CPU and memory
    allocation, your service goes down briefly while the changes are applied.
    <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-resources-changed-apply.png" alt="Configure resource allocations"/>

</procedure>

## Configure autoscaling for disk size
Disk size autoscaling is enabled by default on most services. When you consume
95% or more of your existing disk space, disk size is automatically increased to
the next size available, up to a configurable limit.

Autoscaling can change the disk size once every six hours. When the increase is
requested, the new limit is applied, and then the used space is optimized. The
optimization process does not require downtime, and in most cases it happens
very quickly. However, if you have a lot of existing data, optimization can take
longer, and in some cases this could create a delay longer than six hours.

Autoscaling can only increase disk size, not decrease it. You can have a disk up
to 16&nbsp;TB in size.

If you have a Timescale Cloud multi-node cluster, you can also use
autoscaling. We recommend that you define different scale limits for the access
node and data nodes, not just because they have different workloads, but also
because access nodes are less demanding for storage than data nodes. Data nodes
have a single scaling threshold that applies across all the data nodes.

<procedure>

### Configuring autoscaling for disk size
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
    <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-autoscaling.png" alt="Configure autoscaling disk size"/>

</procedure>

Size increases occur with these gradations:
*   10&nbsp;GB
*   25&nbsp;GB
*   50&nbsp;GB
*   75&nbsp;GB
*   100&nbsp;GB
*   125&nbsp;GB
*   150&nbsp;GB
*   175&nbsp;GB
*   200&nbsp;GB
*   225&nbsp;GB
*   250&nbsp;GB
*   275&nbsp;GB
*   300&nbsp;GB
*   325&nbsp;GB
*   350&nbsp;GB
*   375&nbsp;GB
*   400&nbsp;GB
*   425&nbsp;GB
*   450&nbsp;GB
*   475&nbsp;GB
*   500&nbsp;GB
*   600&nbsp;GB
*   700&nbsp;GB
*   800&nbsp;GB
*   900&nbsp;GB
*   1&nbsp;TB
*   1.5&nbsp;TB
*   2&nbsp;TB
*   2.5&nbsp;TB
*   3&nbsp;TB
*   4&nbsp;TB
*   5&nbsp;TB
*   6&nbsp;TB
*   7&nbsp;TB
*   8&nbsp;TB
*   9&nbsp;TB
*   10&nbsp;TB
*   12&nbsp;TB
*   14&nbsp;TB
*   16&nbsp;TB
