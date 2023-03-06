---
title: Hypershift migration runs slowly
section: troubleshooting
products: [cloud]
keywords: [migration, hypershift]
tags: [hypershift, migration, ingest, postgresql]
---

<!---
* Use this format for writing troubleshooting sections:
 - Cause: What causes the problem?
 - Consequence: What does the user see when they hit this problem?
 - Fix/Workaround: What can the user do to fix or work around the problem? Provide a "Resolving" Procedure if required.
 - Result: When the user applies the fix, what is the result when the same action is applied?
* Copy this comment at the top of every troubleshooting page
-->

When you migrate a PostgreSQL database to Timescale using the Hypershift tool,
the migration runs very slowly if you do not have an index on the `time` column.
Hypershift uses the index to determine how to perform the migration, and without
an index it attempts to do the entire copy at once. To resolve this problem,
create an index on the `time` column in your source database, and re-run
Hypershift.

<highlight type="important">
Hypershift does not support composite indexes. Ensure your source database has
a plain index before you run the Hypershift migration.
</highlight>
