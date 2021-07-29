# Scaling compute and storage
You can use the Timescale Forge console to change how much CPU and memory
resources your service has available, as well as change the disk size for your
service. You can adjust this manually, as required, or enable autoscaling.

When you change the disk size, the changes are applied with no downtime, and the
new size generally becomes available within a few seconds. You can change the
disk size once every six hours, and you can only increase the size, not decrease
it. You can have a disk up to 10{nbsp}TB in size.

You can change the CPU and memory allocation for your service at any time, with
minimal downtime, usually less than thirty seconds. The new resources become
available as soon as the service restarts. You can change the CPU and memory
allocation up or down, as frequently as required.

## Change resource allocations manually
You can change the CPU and memory allocation, and the available disk size, using
the Timescale Forge console.

<highlight="warning">
Changing your compute settings usually requires a short downtime. Make sure you
plan for this before you begin!
</highlight>

### Procedure: Changing resource allocations manually
1.  In the Timescale Forge console, from the `Services` list, click the name of the service you want to modify.
1.  In the `Service details` page, navigate to the `Operations` tab, and click `Resources`.
1.  In the `Resize CPU / memory` field, select the new CPU and memory allocation.
1.  In the `Increase disk size` field, adjust the slider to the new disk size.
1.  Click `Apply` to save your changes. If you have changed the CPU and memory allocation, your service will go down briefly while the changes are applied.

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/forge_images/timescale-forge-service-resources-4tb.png" alt="View Timescale Forge service resource information"/>
