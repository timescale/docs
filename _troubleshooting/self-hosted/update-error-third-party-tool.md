---
title: Error updating TimescaleDB when using a third-party PostgreSQL admin tool
products: [self_hosted]
topics: [upgrades]
keywords: [updates, third-party tools]
---

{/*
* Use this format for writing troubleshooting sections:
 - Cause: What causes the problem?
 - Consequence: What does the user see when they hit this problem?
 - Fix/Workaround: What can the user do to fix or work around the problem? Provide a "Resolving" Procedure if required.
 - Result: When the user applies the fix, what is the result when the same action is applied?
* Copy this comment at the top of every troubleshooting page
*/}

The update command `ALTER EXTENSION timescaledb UPDATE` must be the first command
executed upon connection to a database. Some admin tools execute commands before
this, which can disrupt the process. Try manually updating the database with
`psql`. For instructions, see the [updating guide][update].

[update]: /self-hosted/:currentVersion:/upgrades/
