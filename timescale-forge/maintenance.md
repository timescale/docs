# Maintenance
On Timescale Forge, software updates are handled automatically by us, and you do
not need to perform any actions.

Non-critical software updates are applied during a maintenance window that you
can define to suit your workload.  If we detect a security vulnerability that
affects you, we might need to perform maintenance outside of the scheduled
maintenance window.

<highlight type="important">
After a maintenance update, the DNS name remains the same, but the IP address
it points to changes.
</highlight>

Upgrades are performed as zero-downtime upgrades during maintenance windows.
This means that there is no outage of your services during the upgrade. However,
all connections and transactions in progress during the upgrade are reset.

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
1.  [Log in to your Timescale Forge account][cloud-login]. Click the name of the
    service that you want to manage the maintenance window for.
1.  In the `Operations` tab, navigate to the `Maintenance` section, and
    click `Change maintenance window`.
1.  In the `Maintenance` dialog, select the day of the week, the time, and the
    timezone that you want the maintenance window to start. Maintenance windows
    can run for up to four hours.
1.  Check `Apply new maintenance window to all services` if you want to use the
    same maintenance window settings for all of your Timescale Forge services.
1.  Click `Apply Changes`.

## Critical updates
Critical upgrades and security fixes are installed outside normal maintenance
windows when necessary, and sometimes require a short outage.

[cloud-login]: https://console.forge.timescale.com/login
