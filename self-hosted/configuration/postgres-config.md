---
title: Manual PostgreSQL configuration and tuning
excerpt: How to manually configure your PostgreSQL instance
products: [self_hosted]
keywords: [configuration, settings]
tags: [tune]
---

# Manual PostgreSQL configuration and tuning

If you prefer to tune settings yourself, or for settings not covered by
`timescaledb-tune`, you can manually configure your installation using the
PostgreSQL configuration file.

For some common configuration settings you might want to adjust, see the
[about-configuration][about-configuration] page.

For more information about the PostgreSQL configuration page, see the
[PostgreSQL documentation][pg-config].

## Editing the PostgreSQL configuration file

The location of the PostgreSQL configuration file depends on your operating
system and installation. You can find the location by querying the database as
the `postgres` user, from the psql prompt:

```sql
SHOW config_file;
```

The configuration file requires one parameter per line. Blank lines are ignored,
and you can use a `#` symbol at the beginning of a line to denote a comment.

When you have made changes to the configuration file, the new configuration is
not applied immediately. The configuration file is reloaded whenever the server
receives a `SIGHUP` signal, or you can manually reload the file uses the
`pg_ctl` command.

## Setting parameters at the command prompt

If you don't want to open the configuration file to make changes, you can also
set parameters directly from the command prompt, using the `postgres` command.
For example:

```sql
postgres -c log_connections=yes -c log_destination='syslog'
```

[about-configuration]: /self-hosted/:currentVersion:/configuration/about-configuration
[pg-config]: https://www.postgresql.org/docs/current/config-setting.html
