# Maintenance
The necessary software updates for Services are handled by Timescale Cloud and do not require actions from the users. The software updates are applied during the Maintenance windows (defined by you).

In case security vulnerabilities are found, maintenance will necessarily need to happen more often than that. In case of non-urgent updates, users can also define the maintenance window time from the portal to happen at any point within the next 7 days. This allows for the update to happen during a low traffic time period.

When are maintenance upgrade installed?
Non-critical upgrades are made available in such way that there is a period of time before we actually perform the upgrade automatically. During this availability period you can manually click the "Apply upgrades" button to start the rolling upgrade at the time of your choosing.

There is also a deadline after which we trigger the upgrade automatically at the next available "maintenance window" for your service. The maintenance window is configurable and you may choose a weekday and the time when the upgrades will be started. If there are no upgrades that are past the deadline during a maintenance window, no changes are performed.

The screenshot below shows an example maintenance upgrade.


A quick summary:

An upgrade is made available

During a period of (typically) one week, the upgrade can be manually started at any time you prefer by clicking the "Apply updates" button in the web console

Upgrade deadline is reached after one week

The upgrade is automatically installed at the next possible maintenance window for your service

How are critical upgrades and security fixes installed?
Critical upgrades and security fixes can be installed outside normal maintenance windows when necessary.

Is the service interrupted during a maintenance upgrade? How long will it take.
Timescale Cloud upgrades are performed as rolling upgrades where completely new server instances are built alongside the old ones. Once the new instances are up and running and in sync with the old servers, a controlled automatic failover is performed to switch the service to use the new upgraded servers. The old servers are retired automatically after the new servers have taken over providing the service.

The controlled failover is a very quick and safe operation and it takes less than a minute to get clients connected again. Typically we see a 5-10 second period during which the clients are unable to re-establish the connection.

Note: while the DNS name remains the same, the IP address it points to will change during a maintenance break.

What should I set as my maintenance window?
Some of users prefer to perform the upgrades during a low activity times, such as night time or during weekends to minimize the impact of the short service interruption.

Others prefer to do it during office hours so that their operational staff can monitor their systems during the upgrades.

Is there something that needs to be accounted for on the client side?
Ensure your client software is able to automatically establish a connection

Do not cache IP addresses of the Timescale Cloud service, they may change during upgrades

The DNS address of the service stays the same during and after the upgrade
