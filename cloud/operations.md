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

### Reset password
Use this section to reset the password you use to log in to your Timescale Cloud
account. You must have access to the current password to do this. If you have
forgotten your password, you can reset it from the login screen instead.

### Pause service
You can pause a service if you want to stop it running temporarily. This stops
your service from costing you, but the service is still available and ready to
be restarted at any time.

### Terminate a service
You can terminate a service to delete it completely. This removes the service
and its underlying data from the server. You cannot recover a terminated
service.
