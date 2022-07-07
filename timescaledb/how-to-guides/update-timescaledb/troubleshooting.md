# Troubleshooting TimescaleDB updates
This section contains some ideas for troubleshooting common problems experienced
with updating your TimescaleDB installation.

<!---
* Keep this section in alphabetical order
* Use this format for writing troubleshooting sections:
 - Cause: What causes the problem?
 - Consequence: What does the user see when they hit this problem?
 - Fix/Workaround: What can the user do to fix or work around the problem? Provide a "Resolving" Procedure if required.
 - Result: When the user applies the fix, what is the result when the same action is applied?
* Copy this comment at the top of every troubleshooting page
-->

## Updating fails with an error saying `no update path`
In some cases, when you use the `ALTER EXTENSION timescaledb UPDATE` command to update, it might fail with an error like this:

```sql
ERROR: extension "timescaledb" has no update path from version "2.5.2" to version "2.6.1"
```

This occurs if the list of available extensions does not include the version you
are trying to upgrade to, and it can occur if the package was not installed
correctly in the first place. To correct the problem, install the upgrade
package, restart PostgreSQL, verify the version, and then attempt the update
again.
