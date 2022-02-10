# Maintenance
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

## Upgrade to a new PostgreSQL version
Timescale currently supports PostgreSQL&nbsp;12 and 13. You can manually upgrade
to the next PostgreSQL version in the Timescale Cloud dashboard.

Upgrading to a newer version of PostgreSQL allows you to take advantage of new
features, enhancements, and security fixes. It also ensures that you are using a
version of PostgreSQL that is compatible with the newest version of TimescaleDB,
allowing you to take advantage of everything Timescale has to offer. For more
information about feature changes between versions, see the
[PostgreSQL release notes][postgres-relnotes] and
[TimescaleDB release notes][timescale-relnotes].

<highlight type="warning">
Your Timescale Cloud service is unavailable for use until the upgrade is
complete. Upgrading can take up to several hours to complete, so we recommend
that you plan ahead, and upgrade during a time with low usage.
</highlight>

If you want to try out the upgrade before you run it on your production system,
you can create a fork of your service, and attempt the upgrade on the fork
before you start. This can give you a good idea of what happens during an
upgrade, and how long it might take in your use case. For more infomration about
creating a fork of your service, see the [Operations
section][operations-forking].

<procedure>

### Upgrading to a new PostgreSQL version
1.  In the Timescale Cloud console, navigate to `Services` and click the service
    you want to adjust.
1.  Navigate to the `Operations` tab, and go to the `Maintenance` section.
1.  If a new PostgreSQL version is available, click the `Upgrade` button, and
    confirm that you are ready to start the upgrade. Your Timescale Cloud
    service is unavailable for use until the upgrade is complete.
1.  When the upgrade is finished, your service automatically resumes normal
    operations. If the upgrade is unsuccessful, the service returns to the state
    it was in before you started the upgrade.

</procedure>

[cloud-login]: https://cloud.timescale.com
[operations-forking]: cloud/:currentVersion:/operations/#fork-a-service
[postgres-relnotes]: https://www.postgresql.org/docs/release/
[timescale-relnotes]: /timescaledb/:currentVersion:/overview/release-notes/
