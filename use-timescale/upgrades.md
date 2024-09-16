---
title: Maintenance and upgrades
excerpt: Keeping your service up-to-date
products: [cloud]
keywords: [updates, upgrades, maintenance]
cloud_ui:
    path:
        - [services, :serviceId, operations, maintenance]
---

# Maintenance and upgrades

On Timescale, minor software updates are handled automatically, and
you do not need to perform any actions.

Most updates performed on your Timescale services are applied during a
maintenance window that you can define to suit your workload. However, if there
is a critical security vulnerability that affects you, maintenance might need to
occur outside of the scheduled maintenance window.

<Highlight type="important">
After a maintenance update, the DNS name remains the same, but the IP address
it points to often changes.
</Highlight>

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

To track the status of maintenance events, see the Timescale
[status page][status-page].

<Highlight type="note">
To apply changes manually instead of waiting for the maintenance window,
`Pause` then `Resume` your service. Maintenance changes are automatically
applied when your service is resumed.
</Highlight>

## Replicas and maintenance

Services with replicas require minimal write downtime during maintenance,
while read-only queries keep working through the maintenance. The maintenance
requires up to two failovers, performed automatically, taking less than a few
seconds each.

During a maintenance event, services with replicas perform maintenance on each
node independently. When maintenance goes on with the primary node, the primary
node needs to be restarted. If the restart takes more than a minute, the replica
node is promoted to the primary, given that the replica has no replication lag.
If the maintenance on the primary node is completed within a minute and it comes
back online, the replica remains as a replica.

When maintenance starts on the primary and results in the promotion of the replica
node, the maintenance proceeds then with the newly promoted replica, following the same
sequence. If the newly promoted replica takes more than a minute to restart, the former
primary is promoted back. In total, the process may result in up to two minutes of write
downtime and two failover events.

For more information about replicas, see the
[replicas section][replicas-docs].

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

<Procedure>

### Adjusting your maintenance window

1.  [Log in to your Timescale account][cloud-login]. Click the name of the
    service that you want to manage the maintenance window for.
2.  In the `Operations` tab, navigate to the `Maintenance` section, and
    click `Change maintenance window`.
3.  In the `Maintenance` dialog, select the day of the week, the time, and the
    timezone that you want the maintenance window to start. Maintenance windows
    can run for up to four hours.
4.  Check `Apply new maintenance window to all services` if you want to use the
    same maintenance window settings for all of your Timescale services.
5.  Click `Apply Changes`.
  
    <img class="main-content__illustration"
    width={1375} height={944}
    src="https://assets.timescale.com/docs/images/tsc-maintenance-change.webp"
    alt="Timescale change maintenance window"/>

</Procedure>

## Critical updates

Critical upgrades and security fixes are installed outside normal maintenance
windows when necessary, and sometimes require a short outage. In this case, the
downtime is usually between 30&nbsp;seconds and 5&nbsp;minutes. We endeavor to
notify you on email ahead of the upgrade if downtime is required, so that you
can plan accordingly. However, in some cases, we might not be able to do so.

## Upgrade to a new PostgreSQL version

Timescale currently supports PostgreSQL&nbsp;14, 15, and 16. You can see
your PostgreSQL and Timescale versions from the Timescale service
overview page.

<!-- TODO: Add screenshot
<img class="main-content__illustration"
    src="FIXME"
    alt="The Timescale dashboard, showing the PostgreSQL and Timescale
    versions"
/>
-->

You can also manually upgrade to the newest supported PostgreSQL version
(PostgreSQL&nbsp;15) from the service overview page.

Upgrading to a newer version of PostgreSQL allows you to take advantage of new
features, enhancements, and security fixes. It also ensures that you are using a
version of PostgreSQL that's compatible with the newest version of Timescale,
allowing you to take advantage of everything Timescale has to offer. For more
information about feature changes between versions, see the
[PostgreSQL release notes][postgres-relnotes] and
[Timescale release notes][timescale-relnotes].

<Highlight type="warning">
Your Timescale service is unavailable until the upgrade is complete. This
can take up to 20 minutes. It is recommended to test on a fork first for a 
better estimate.
</Highlight>

### Recommended practices for upgrading

For a smooth upgrade experience, make sure you:

*   Plan ahead. Upgrades cause downtime, so ideally perform an upgrade
    during a low traffic time.
*   Fork your database, and try out the upgrade on the fork before running it on
    your production system. This gives you a good idea of what happens during
    the upgrade, and how long it might take. For more information about forking,
    see the section on [forking][operations-forking].
*   Keep a copy of your database with your old version and data, if you're
    worried about losing it. You can fork your database without upgrading the
    fork to keep a duplicate Timescale service. You can immediately pause
    this fork to only pay for storage until you are comfortable deleting it.

<Highlight type="important">
Timescale services with replicas cannot be upgraded. To upgrade a service
with a replica,  you must first delete the replica and then upgrade the service.
</Highlight>

<Procedure>

### Upgrading to a new PostgreSQL version

1.  In the Timescale console, navigate to `Services` and click the service
    you want to upgrade.
1.  Navigate to the `Operations` tab, and go to the `Maintenance` section.
1.  If a new PostgreSQL version is available, click the `Upgrade` button, and
    confirm that you are ready to start the upgrade. Your Timescale
    service is unavailable for use until the upgrade is complete.
1.  When the upgrade is finished, your service automatically resumes normal
    operations. If the upgrade is unsuccessful, the service returns to the state
    it was in before you started the upgrade.

</Procedure>

<Highlight type="cloud" header="Sign up for Timescale" button="Try for free">
</Highlight>

[cloud-login]: https://cloud.timescale.com
[operations-forking]: /use-timescale/:currentVersion:/services/service-management/#fork-a-service
[postgres-relnotes]: https://www.postgresql.org/docs/release/
[replicas-docs]: /use-timescale/:currentVersion:/ha-replicas/high-availability/
[status-page]: https://status.timescale.com/
[timescale-relnotes]: /about/latest/release-notes/
