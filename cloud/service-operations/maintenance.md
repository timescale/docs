---
title: Service operations - Maintenance
excerpt: How your Timescale Cloud service is kept up-to-date
product: cloud
keywords: [updates, upgrades, maintenance]
---

# Service operations - Maintenance

On Timescale Cloud, minor software updates are handled automatically by us, and
you do not need to perform any actions.

Most updates that we perform on your Timescale Cloud services are applied during
a maintenance window that you can define to suit your workload. However, if we
detect a critical security vulnerability that affects you, we might need to
perform maintenance outside of the scheduled maintenance window.

<highlight type="important">
After a maintenance update, the DNS name remains the same, but the IP address
it points to often changes.
</highlight>

In most cases, the updates that occur during your maintenance windows do not
require any downtime. This means that there is no outage of your services during
the upgrade. However, all connections and transactions in progress during the
upgrade are reset. Usually, the database connection is automatically restored
after the reset.

Sometimes, updates that occur during your maintenance window require some
downtime. In this case, the downtime is usually between 30&nbsp;seconds and
5&nbsp;minutes. We endeavor to notify you on email ahead of the upgrade if
downtime is required, so that you can plan accordingly. However, in some cases,
we might not be able to do so. It is important that you schedule your
maintenance window to minimize the disruption that a short downtime might have
on your workloads.

To track the status of maintenance events, see the Timescale Cloud
[status page][status-page].

<highlight type="note">
To apply changes manually instead of waiting for the maintenance window,
`Pause` then `Resume` your service. Maintenance changes are automatically
applied when your service is resumed.
</highlight>

## Replicas and maintenance
Instead of downtime, services with replicas will have one or two failover 
events during maintenance, taking less than a few seconds each. During a 
maintenance event, services with replicas perform maintenance on each node 
independently. Maintenance begins on one node, which is promoted to the primary 
once it finishes. The other node will then undergo maintenance and remain the 
replica after completion. Sometimes, maintenance will begin with the primary 
first, causing the replica node to be promoted at the start, meaning the 
service will experience two total promotions (failovers) during a maintenance 
event. For more information about replicas, see the [replicas documentation][replicas-docs]. 

## Non-critical maintenance updates

Non-critical upgrades are made available before the upgrade is performed
automatically. During this time you can click `Apply upgrades` to start the
upgrade at any time. However, after the time expires, usually around a week,
the upgrade is triggered automatically in the next available maintenance window
for your service. You can configure the maintenance window so that these
upgrades are started only at a particular time, on a set day of the week. If
there are no pending upgrades available during a regular maintenance window, no
changes are performed.

When you are considering your maintenance window schedule, you might prefer to
choose a day and time that usually has very low activity, such as during the
early hours of the morning, or over the weekend. This can help minimize the
impact of a short service interruption. Alternatively, you might prefer to have
your maintenance window occur during office hours, so that you can monitor your
system during the upgrade.

<procedure>

### Adjusting your maintenance window

1.  [Log in to your Timescale Cloud account][cloud-login]. Click the name of the
    service that you want to manage the maintenance window for.
1.  In the `Operations` tab, navigate to the `Maintenance` section, and
    click `Change maintenance window`.
1.  In the `Maintenance` dialog, select the day of the week, the time, and the
    timezone that you want the maintenance window to start. Maintenance windows
    can run for up to four hours.
1.  Check `Apply new maintenance window to all services` if you want to use the
    same maintenance window settings for all of your Timescale Cloud services.
1.  Click `Apply Changes`.
    <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-maintenance-change.png" alt="Timescale Cloud change maintenance window"/>

</procedure>

## Critical updates

Critical upgrades and security fixes are installed outside normal maintenance
windows when necessary, and sometimes require a short outage. In this case, the
downtime is usually between 30&nbsp;seconds and 5&nbsp;minutes. We endeavor to
notify you on email ahead of the upgrade if downtime is required, so that you
can plan accordingly. However, in some cases, we might not be able to do so.

<highlight type="cloud" header="Sign up for Timescale Cloud" button="Try for free">
</highlight>

[status-page]: https://status.timescale.com/
[cloud-login]: https://cloud.timescale.com
[replicas-docs]: /cloud/:currentVersion:/service-operations/replicas/
