---
title: Replicas and forks with tiered data
excerpt: How tiered data works on replicas and forks
product: [cloud]
keywords: [tiered storage]
tags: [storage, data management]
---

# How tiered data works on replicas and forks 

There is one more thing that makes Tiered Storage even more amazing: when you keep data in the low-cost object storage tier,
you pay for this data only once, independently of if you have a [high-availability replica][ha-replica]
or [read replicas][read-replica] running in your service. We call this the savings multiplication effect of Tiered Storage.

The same applies to [forks][operations-forking], which you can use, for example, for running tests or creating dev environments.
When creating one (or more) forks, you won’t be billed for data shared with the primary in the low-cost storage.

If you decide to tier more data that’s not in the primary, you will pay to store it in the low-cost tier,
but you will still see substantial savings by moving that data from the high-performance tier of the fork to the cheaper object storage tier.

## How this works behind the scenes

Once you tier data to the low-cost object storage tier, we keep a reference to that data on your Database's catalog.

Creating a replica or forking a primary server only copies the references and the metadata we keep on the catalog for all tiered data.

On the billing side, we only count and bill once for the data tiered, not for each reference there may exist towards that data. 

## What happens when a chunk is dropped or untiered on a fork

Dropping or untiering a chunk from a fork does not delete it from any other servers that reference the same chunk.

You can have one, multiple or 0 servers referencing the same chunk of data:
* That means that deleting data from a fork does not affect the other servers (including the primary);
  it just removes the reference to that data, which is for all intends and purposes equal to deleting that data from the point of view of that fork
* The primary and other servers are unaffected, as they still have their reference(s) and the metadata on their catalog(s) intact
* We never delete anything on the object storage tier if at least one server references it:
  The data is only permanently deleted (or hard deleted as we internally call this operation) once the references drop to 0.

As described above, tiered chunks are only counted once for billing purposes, so dropping or untiering a chunk that is shared with other servers
from a fork will not affect billing as it was never counted for billing purposes.

Droping or untiering a chunk that was only tiered on that fork works as expected and is covered in more detail in the following section. 

## What happens when a chunk is modified on a fork

As a reminder, tiered data is immutable - there is no such thing as updating the data.

You can untier or drop a chunk, in which case what is described in the previous section covers what happens.

And you can tier new data, at which point a fork deviates form the primary in a similar way as all forks do.
New data tiered are not shared with parent or sibling servers, this is new data tiered for that server and we count them as a new object for the purposes of billing.

If you decide to tier more data that’s not in the primary, you will pay to store it in the low-cost tier,
but you will still see substantial savings by moving that data from the high-performance tier of the fork to the cheaper object storage tier.

Similar to other types of storage tiers, this type of deviation can not happen for replicas as they have to be identical with the primary server, that's why we don't mention replicas when discussing about droping chunks or tiering additional data.

## What happens with backups and PITR

As discussed above, we never delete anything on the object storage tier if at least one server references it.
The data is only permanently deleted (or hard deleted as we internally call this operation) once the references drop to 0.

In addition to that, we delay hard deleting the data by 14 days, so that in case of a restore or PITR, all tiered data will be available.
In the case of such a restore, new references are added to the deleted tiered chunks, so they are not any more candidates for a hard deletion. 

Once 14 days pass after soft deleting the data (i.e. the number of references to the tiered data drop to 0), we hard delete the tiered data.

[ha-replica]: /use-timescale/:currentVersion:/ha-replicas/high-availability/
[read-replica]: /use-timescale/:currentVersion:/ha-replicas/read-scaling/#read-replicas
[operations-forking]: /use-timescale/:currentVersion:/services/service-management/#fork-a-service