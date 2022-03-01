# Operations
Timescale Cloud provides an operations dashboard for managing your services. You
can see the Operations dashboard in your Timescale Cloud account by navigating
to the `Services` section, clicking the service you want to explore, and
selecting the `Operations` tab.

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

When you reset your service password, you are first prompted for your Timescale
Cloud password. Once you authenticate, you can create a new service password,
ask Timescale Cloud to auto-generate a password, or switch your authentication
type between SCRAM and MD5.

### Pause service
You can pause a service if you want to stop it running temporarily. This stops
your service from costing you, but the service is still available and ready to
be restarted at any time.

### Terminate a service
You can terminate a service to delete it completely, and remove the service and
it's underlying data from the server. You cannot recover a service that has been
terminated.
