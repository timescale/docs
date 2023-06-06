---
title: Autoscaling
excerpt: Set up Timescale to automatically resize your compute and storage
products: [cloud]
keywords: [scaling, services, operations]
tags: [cpu, storage, disk space]
cloud_ui:
    path:
        - [services, :serviceId, operations, autoscaling]
---

# Autoscaling

Disk size autoscaling is enabled by default on most services. When you consume
85% or more of your existing disk space, disk size is automatically increased to
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

<Highlight type="warning">
If you ingest very large amounts of data, autoscaling might not be able to keep
up with data ingest. This happens because you need to wait for storage
optimization between resizes. In that case, you need to scale your storage
manually. To learn more, see the
[limitations of autoscaling](#limitations-of-autoscaling).
</Highlight>

You can also use autoscaling with Timescale multi-node clusters. In this
case, you should define different scale limits for the access node and data
nodes. This is not just because they have different workloads, but also because
access nodes are less demanding for storage than data nodes. Data nodes have a
single scaling threshold that applies across all the data nodes.

## Configure autoscaling for disk size

Disk size autoscaling is enabled by default on most services. You can configure
autoscaling on your services to work in the most effective way for your
workload.

<Procedure>

### Configuring autoscaling for disk size

1.  In the Timescale console, from the `Services` list, click the name of
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

</Procedure>

## Limitations of autoscaling

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

Resizing is triggered when your disk is 85% full, so the first resize
is triggered at 85&nbsp;GB, and the second resize is triggered at 118&nbsp;GB.
If you expect your data to grow from 85&nbsp;GB to 118&nbsp;GB within a day, you
should manually resize your storage to accommodate the heavy load.

## Size increase gradations

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
