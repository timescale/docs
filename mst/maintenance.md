# Maintenance
On Managed Service for TimescaleDB, software updates are handled automatically
by us, and you do not need to perform any actions to keep up to date.

Non-critical software updates are applied during a maintenance window that you can define to suit your workload.
If we detect a security vulnerability that affects you, we might need to perform maintenance outside of
the scheduled maintenance window.

<highlight type="important">
After a maintenance update, the DNS name remains the same, but the IP address
it points to changes.
</highlight>

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

### Procedure: Adjusting your maintenance window
1.  [Log in to your account][mst-login]. Click the name of the service that
    you want to manage the maintenance window for.
1.  In the `Maintenance window` section, click `Change`.
1.  In the `Service Maintenance Window` dialog, select the day of the week and
    the time (in Universal Coordinated Time) you want the maintenance window to
    start. Maintenance windows can run for up to four hours.
    <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/mst-maintwindow.png" alt="Adjust maintenance window"/>
1.  Click `Save Changes`.

## Critical updates
Critical upgrades and security fixes are installed outside normal maintenance windows when
necessary, and sometimes require a short outage.

Upgrades are performed as rolling upgrades where completely new server instances
are built alongside the old ones. When the new instances are up and running they
are synchornized with the old servers, and a controlled automatic failover is
performed to switch the service to the new upgraded servers. The old servers are
retired automatically after the new servers have taken over. The controlled
failover is a very quick and safe operation and it takes less than a minute to
get clients connected again. In most cases, there is five to ten second outage
during this process.


[mst-login]: https://portal.timescale.cloud/login
