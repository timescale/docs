---
title: Service management
excerpt: Manage your service from the Operations dashboard
products: [cloud]
keywords: [services, operations, forks]
tags: [manage, admin, passwords, pause, stop, terminate]
cloud_ui:
    path:
        - [services, :serviceId, operations, management]
        - [create_services, fork, :serviceId]
---

# Service management

In the `Service management` section of the Operations dashboard, you can fork
your service, reset the password, pause, or delete the service.

## Fork a service

When you a fork a service, you create an exact copy of the service, including
the underlying database. This allows you to create a copy that you can use for
testing purposes, or to prepare for a major version upgrade. The only difference
between the original and the forked service is that the `tsdbadmin` user has a
different password.

The fork is created by restoring from backup and applying the write-ahead log.
The data is fetched from Amazon S3, so forking doesn't tax the running instance.

<Highlight type="important">
You can fork services that have a status of `Running` or `Paused`. You cannot
fork services while they have a status of `In progress`. Wait for the service to
complete the transition before you start forking.
</Highlight>

<Highlight type="warning">
Forks only have data up to the point when the original service was forked. Any
data written to the original service after the time of forking does not appear
in the fork. If you want the fork to assume operations from the original
service, pause your main service before forking to avoid any
data discrepancy between services.
</Highlight>

<Procedure>

### Forking a service

1.  In the Timescale console, from the `Services` list, ensure the service
    you want to form has a status of `Running` or `Paused`, then click the name
    of the service you want to fork.
1.  Navigate to the `Operations` tab.
1.  In the `Service management` section, click `Fork service`. In the dialog,
    confirm by clicking `Fork service`. The forked service takes a few minutes
    to start.
1.  <Optional />To change the configuration of your fork, click `Advanced
    options`. You can set different compute and storage options, separate from
    your original database.
1.  Confirm by clicking `Fork service`. The forked service takes a few minutes
    to start.
1.  The forked service shows in the `Services` dashboard with a label stating
    which service it has been forked from.

<img
class="main-content__illustration"
src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-forked-service.png"
alt="Fork a Timescale service"
/>

</Procedure>

### Reset service password

You can reset your service password from the `Operations` dashboard. This is the
password you use to connect to your database, not the password to your Timescale
Cloud account. To reset your Timescale password, navigate to the `Account`
page.

When you reset your service password, you are prompted for your Timescale
Cloud password. When you have authenticated, you can create a new service password,
ask Timescale to auto-generate a password, or switch your authentication
type between SCRAM and MD5.

SCRAM (salted challenge response authentication mechanism) and MD5 (message
digest algorithm 5) are cryptographic authentication mechanisms. Timescale
uses SCRAM by default. It is more secure and strongly recommended. The MD5
option is provided for compatibility with older clients.

### Pause service

You can pause a service if you want to stop it running temporarily. When you
pause a service, you are no longer billed for compute services. However, you do
need to continue paying for any storage you are using. Pausing a service ensures
that it is still available, and is ready to be restarted at any time.

### Delete a service

You can delete a service to remove it completely. This removes the service
and its underlying data from the server. You cannot recover a deleted
service.
