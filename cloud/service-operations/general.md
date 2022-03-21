# Services operations - General
Timescale Cloud contains several mechanisms for managing disk space on your
services. There are four key tasks that Cloud performs to handle disk space:
1.  Detect if storage capacity begins to fill up
1.  Notify you about the growth of storage consumption
1.  Automatically activate overload protections
1.  Allow you to return your database to a normal state

This section explains what the various mechanisms are, and how to best make use
of them.

By default, Timescale Cloud services have autoscaling enabled. Autoscaling
automatically increases your disk size, up to a maximum amount, as you fill the
disk. For more information about autoscaling, including instructions for setting
the maximum limit, or turning autoscaling off, see the
[scaling a service][scaling] section.

For more information about memory management, including out of memory (OOM)
errors, see the [memory management][memory-mgmt] section.

## General
In the `General` section of the Operations dashboard, you can fork your service,
reset the password, pause, or terminate the service.

### Fork a service
When you a fork a service, you create an exact copy of the service, including
the underlying database. This allows you to create a copy that you can use for
testing purposes, or to prepare for a major version upgrade. The only difference
between the original and the forked service is that the `tsdbadmin` user has a
different password.

<highlight type="important">
You can fork services that have a status of `Running` or `Paused`. You cannot
fork services while they have a status of `In progress`. Wait for the service to
complete the transition before you start forking.
</highlight>

<procedure>

### Forking a service
1.  In the Timescale Cloud console, from the `Services` list, ensure the service you want to form has a status of `Running` or `Paused`, then click the name of
    the service you want to fork.
1.  Navigate to the `Operations` tab.
1.  In the `General` section, click `Fork service`. In the dialog, confirm by
    clicking `Fork service`. The forked service takes a few minutes to start.
1.  The forked service shows in the `Services` dashboard with a label stating
    which service it has been forked from.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-forked-service.png" alt="Fork a Timescale Cloud service"/>

</procedure>

### Reset service password
You can reset your service password from the `Operations` dashboard. This is the
password you use to connect to your database, not the password to your Timescale
Cloud account. To reset your Timescale Cloud password, navigate to the `Account`
page.

When you reset your service password, you are prompted for your Timescale
Cloud password. When you have authenticated, you can create a new service password,
ask Timescale Cloud to auto-generate a password, or switch your authentication
type between SCRAM and MD5.

SCRAM (Salted Challenge Response Authentication Mechanism) and MD5 (Message Digest
Algorithm 5) are cryptographic authentication mechanisms. Timescale Cloud uses SCRAM
by default. It is more secure and strongly recommended. The MD5 option is provided
for compatibility with older clients.

### Pause service
You can pause a service if you want to stop it running temporarily. This stops
your service from costing you, but the service is still available and ready to
be restarted at any time.

### Terminate a service
You can terminate a service to delete it completely. This removes the service
and its underlying data from the server. You cannot recover a terminated
service.






[scaling]: cloud/:currentVersion:/scaling-a-service/
[memory-mgmt]: cloud/:currentVersion:/memory-management/
