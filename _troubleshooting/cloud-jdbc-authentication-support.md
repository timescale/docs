---
title: JDBC authentication type is not supported
section: troubleshooting
products: [cloud]
topics: [connections]
errors:
  - language: text
    message: |-
      Check that your connection definition references your JDBC database with
      correct URL syntax, username, and password. The authentication type 10 is
      not supported.
keywords: [authentication, connect]
tags: [passwords, md5, scram, jdbc]
---

<!---
* Use this format for writing troubleshooting sections:
 - Cause: What causes the problem?
 - Consequence: What does the user see when they hit this problem?
 - Fix/Workaround: What can the user do to fix or work around the problem? Provide a "Resolving" Procedure if required.
 - Result: When the user applies the fix, what is the result when the same action is applied?
* Copy this comment at the top of every troubleshooting page
-->

When connecting to Timescale with a Java Database Connectivity (JDBC)
driver, you might get this error message.

Your Timescale authentication type doesn't match your JDBC driver's
supported authentication types. The recommended approach is to upgrade your JDBC
driver to a version that supports `scram-sha-256` encryption. If that isn't an
option, you can change the authentication type for your Timescale service
to `md5`. Note that `md5` is less secure, and is provided solely for
compatibility with older clients.

For information on changing your authentication type, see the documentation on
[resetting your service password][password-reset].

[password-reset]: /use-timescale/:currentVersion:/services/service-management/#reset-service-password
