---
title: Troubleshooting
excerpt: Troubleshoot common problems that occur when integrating Tiger services with third-party solutions
products: [cloud, self_hosted]
keywords: [troubleshooting]
---

# Troubleshooting

## JDBC authentication type is not supported

When connecting to $SERVICE_LONG with a Java Database Connectivity (JDBC)
driver, you might get this error message:

```text
Check that your connection definition references your JDBC database with correct URL syntax, 
username, and password. The authentication type 10 is not supported.
```

Your $CLOUD_LONG authentication type doesn't match your JDBC driver's
supported authentication types. The recommended approach is to upgrade your JDBC
driver to a version that supports `scram-sha-256` encryption. If that isn't an
option, you can change the authentication type for your $SERVICE_LONG
to `md5`. Note that `md5` is less secure, and is provided solely for
compatibility with older clients.

For information on changing your authentication type, see the documentation on
[resetting your service password][password-reset].

[password-reset]: /use-timescale/:currentVersion:/services/service-management/#reset-service-password

