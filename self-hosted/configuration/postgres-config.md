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

## Edit the PostgreSQL configuration file

The location of the PostgreSQL configuration file depends on your operating
system and installation. 

1. **Find the location of the config file for your Postgres instance**
   1. Connect to your database:
      ```shell
      psql -d "postgres://<username>:<password>@<host>:<port>/<database-name>"
      ```
   1. Retrieve the database file location from the database internal configuration.
      ```sql
      SHOW config_file;
      ```
      Postgres returns the path to your configuration file. For example:
      ```sql
      --------------------------------------------
      /home/postgres/pgdata/data/postgresql.conf
      (1 row)
      ```

1. **Open the config file, then [edit your postgres configuration][pg-config]** 
   ```shell
   vi /home/postgres/pgdata/data/postgresql.conf
   ```
   
1. **Save your updated configuration**

   When you have saved the changes you make to the configuration file, the new configuration is
   not applied immediately. The configuration file is automatically reloaded when the server
   receives a `SIGHUP` signal. To manually reload the file, use the `pg_ctl` command.

## Setting parameters at the command prompt

If you don't want to open the configuration file to make changes, you can also
set parameters directly from the command prompt, using the `postgres` command.
For example:

```sql
postgres -c log_connections=yes -c log_destination='syslog'
```

[about-configuration]: /self-hosted/:currentVersion:/configuration/about-configuration
[pg-config]: https://www.postgresql.org/docs/current/config-setting.html
