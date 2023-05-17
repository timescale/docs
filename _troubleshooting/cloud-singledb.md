---
title: Cannot add column to a compressed hypertable
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

<!---
* Use this format for writing troubleshooting sections:
 - Cause: What causes the problem?
 - Consequence: What does the user see when they hit this problem?
 - Fix/Workaround: What can the user do to fix or work around the problem?
   Provide a "Resolving" Procedure if required.
 - Result: When the user applies the fix, what is the result when the same
   action is applied?
* Copy this comment at the top of every troubleshooting page
-->

Each Timescale service can have a single database. The database must be
named `tsdb`. If you try to create an additional database you receive this error.

If you need another database, you need to create a new service.
