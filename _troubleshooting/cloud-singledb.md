---
title: Cannot create another database
section: troubleshooting
products: [cloud, mst, self_hosted]
topics: [services]
errors:
  - language: text
    message: |-
      ERROR:  tsdb_admin: database <DB_NAME> is not an allowed database name
      HINT:  Contact your administrator to configure the "tsdb_admin.allowed_databases"

apis:

keywords: [services]
tags: [services]
---

{/*
* Use this format for writing troubleshooting sections:
 - Cause: What causes the problem?
 - Consequence: What does the user see when they hit this problem?
 - Fix/Workaround: What can the user do to fix or work around the problem?
   Provide a "Resolving" Procedure if required.
 - Result: When the user applies the fix, what is the result when the same
   action is applied?
* Copy this comment at the top of every troubleshooting page
*/}

Each Timescale service hosts a single database named `tsdb`. You see this error when you try
to create an additional database in a service. If you need another database,
[create a new service][create-service].

[create-service]: /getting-started/:currentVersion:/services/#create-a-timescale-service
