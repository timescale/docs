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
You can manually change both storage and compute resources.

### Storage resources
When you change the disk size, the changes are applied with no downtime. The
new size generally becomes available within a few seconds. You can only increase
your disk size, not decrease it, up to a maximum of 16&nbsp;TB.

Though your new storage is available within seconds, it needs to be optimized
behind the scenes. Optimization takes anywhere from 6 to 24 hours for each
terabyte of data. Allow enough time for optimization to finish before scaling
your service again. You must wait at least 6 hours, even if your service is
smaller than 1&nbsp;TB.

<highlight type="warning">
If you resize your service again while your previous resize is still optimizing,
the second resize fails. For more information on storage optimization, see the
[Amazon Elastic Block Store](https://aws.amazon.com/premiumsupport/knowledge-center/ebs-volume-stuck-optimizing-on-modification/)
documentation. To prevent this, wait for the recommended time between resizes.
</highlight>

### Compute resources
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

Autoscaling can only increase disk size, not decrease it. You can have a disk up
to 16&nbsp;TB in size.

Autoscaling can change the disk size once every 6 hours. When the increase is
requested, the new limit is applied, and then the used space is optimized. The
optimization process does not require downtime, and in most cases it happens
very quickly. However, if you have a lot of existing data, optimization can take
longer. You should expect 6 to 24 hours of optimization time for every terabyte
of data. For more information, see the
[Amazon Elastic Block Store documentation][aws-ebs].

<highlight type="warning">
If you ingest very large amounts of data, autoscaling might not be able to keep
up with data ingest. This happens because you need to wait for storage
optimization between resizes. In that case, you need to scale your storage
manually. To learn more, see the
[limitations of autoscaling](#limitations-of-autoscaling).
</highlight>

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

### Limitations of autoscaling
Under very heavy data ingest loads, your data might grow faster than your new
storage can be optimized. There must be a gap of at least 6 hours between
resizes. For larger databases, there should be a gap of 6 to 24 hours for each
terabyte of data.

Refer to the [autoscaling size increases][size-increases] to check the next few
tiers of storage. If you expect your database to outgrow an upper tier while
still optimizing the next tier, you should
[manually scale your database][manual-scaling] to your expected final size. This
prevents you from outgrowing your data storage before it can be resized again.

For example, say you have 100&nbsp;GB of storage. The next two tiers are
125&nbsp;GB and 150&nbsp;GB. To resize to 125&nbsp;GB, AWS needs to modify the
underlying storage volume. This can typically happen within 6 hours, but it
might take 24 hours in some cases. The time doesn't always scale linearly with
the volume size. For safety, you might want to leave 24 hours.

Resizing is triggered when your disk is 95% full, so the first resize
is triggered at 95&nbsp;GB, and the second resize is triggered at 118&nbsp;GB.
If you expect your data to grow from 95&nbsp;GB to 118&nbsp;GB within a day, you
should manually resize your storage to accommodate the heavy load.

### Size increase gradations
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

[aws-ebs]: https://aws.amazon.com/premiumsupport/knowledge-center/ebs-volume-stuck-optimizing-on-modification/
[manual-scaling]: #change-resource-allocations-manually
[size-increases]: #size-increase-gradations
