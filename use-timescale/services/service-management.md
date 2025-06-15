---
title: Service management
excerpt: Manage your Tiger Cloud service from the Operations dashboard in Tiger Cloud console. Fork the service, reset your password, pause or delete a service, and more
products: [cloud]
keywords: [services, operations, forks]
tags: [manage, admin, passwords, pause, stop, terminate]
cloud_ui:
    path:
        - [services, :serviceId, operations, management]
        - [create_services, fork, :serviceId]
---

# $SERVICE_SHORT_CAP management

In the `Service management` section of the `Operations` dashboard, you can fork
your $SERVICE_SHORT, reset the password, pause, or delete the $SERVICE_SHORT.

## Fork a $SERVICE_SHORT

When you a fork a $SERVICE_SHORT, you create its exact copy including
the underlying database. This allows you to create a copy that you can use for
testing purposes, or to prepare for a major version upgrade. The only difference
between the original and the forked $SERVICE_SHORT is that the `tsdbadmin` user has a
different password.

The fork is created by restoring from backup and applying the write-ahead log.
The data is fetched from Amazon S3, so forking doesn't tax the running instance.

<Highlight type="important">

You can fork $SERVICE_SHORTs that have a status of `Running` or `Paused`. You cannot
fork $SERVICE_SHORTs while they have a status of `In progress`. Wait for the $SERVICE_SHORT to
complete the transition before you start forking.

</Highlight>

<Highlight type="warning">

Forks only have data up to the point when the original $SERVICE_SHORT was forked. Any
data written to the original $SERVICE_SHORT after the time of forking does not appear
in the fork. If you want the fork to assume operations from the original
$SERVICE_SHORT, pause your main $SERVICE_SHORT before forking to avoid any
data discrepancy between $SERVICE_SHORTs.

</Highlight>

<Procedure>

### Forking a $SERVICE_SHORT

1.  In $CONSOLE_LONG, from the `Services` list, ensure the $SERVICE_SHORT
    you want to form has a status of `Running` or `Paused`, then click the name
    of the $SERVICE_SHORT you want to fork.
1.  Navigate to the `Operations` tab.
1.  In the `Service management` section, click `Fork service`. In the dialog,
    confirm by clicking `Fork service`. The forked $SERVICE_SHORT takes a few minutes
    to start.
1.  [](#)<Optional />To change the configuration of your fork, click
    `Advanced options`. You can set different compute and storage options,
    separate from your original $SERVICE_SHORT.
1.  Confirm by clicking `Fork service`. The forked $SERVICE_SHORT takes a few minutes
    to start.
1.  The forked $SERVICE_SHORT shows in the `Services` dashboard with a label stating
    which $SERVICE_SHORT it has been forked from.

<img
class="main-content__illustration"
width={1375} height={944}
src="https://assets.timescale.com/docs/images/tsc-forked-service.webp"
alt="Fork a Tiger Cloud service"
/>

</Procedure>

### Reset your $SERVICE_SHORT password

You can reset your $SERVICE_SHORT password from the `Operations` dashboard. This is the
password you use to connect to your $SERVICE_SHORT, not the password for $CONSOLE. To reset your $CONSOLE_SHORT password, navigate to the `Account` page.

When you reset your $SERVICE_SHORT password, you are prompted for your $CONSOLE_SHORT password. When you have authenticated, you can create a new $SERVICE_SHORT password,
ask $CONSOLE_SHORT to auto-generate a password, or switch your authentication
type between SCRAM and MD5.

SCRAM (salted challenge response authentication mechanism) and MD5 (message
digest algorithm 5) are cryptographic authentication mechanisms. $CONSOLE_LONG
uses SCRAM by default. It is more secure and strongly recommended. The MD5
option is provided for compatibility with older clients.

### Pause a $SERVICE_SHORT

You can pause a $SERVICE_SHORT if you want to stop it running temporarily. When you
pause a $SERVICE_SHORT, you are no longer billed for compute resources. However, you do
need to continue paying for any storage you are using. Pausing a $SERVICE_SHORT ensures
that it is still available, and is ready to be restarted at any time.

### Delete a $SERVICE_SHORT

You can delete a $SERVICE_SHORT to remove it completely. This removes the $SERVICE_SHORT
and its underlying data from the server. You cannot recover a deleted
$SERVICE_SHORT.
