import SetupSourceTarget from "versionContent/_partials/_migrate_set_up_source_and_target.mdx";

<SetupSourceTarget />

<Highlight type="important">
Do not use a Timescale connection pooler connection for live migration. There
are a number of issues which can arise when using a connection pooler, and no
advantage. Very small instances may not have enough connections configured by
default, in which case you should modify the value of `max_connections`, in
your instance, as shown on [Configure database parameters](/use-timescale/:currentVersion/configuration/customize-configuration/#configure-database-parameters).
</Highlight>

It's important to ensure that the `old_snapshot_threshold` value is set to the
default value of `-1` in your source database. This prevents PostgreSQL from
treating the data in a snapshot as outdated. If this value is set other than
`-1`, it might affect the existing data migration step.

To check the current value of `old_snapshot_threshold`, run the command:

```sh
psql -X -d $SOURCE -c 'show old_snapshot_threshold'
```

If the query returns something other than `-1`, you must change it.

If you have a superuser on a self-hosted database, run the following command:

```sh
psql -X -d $SOURCE -c 'alter system set old_snapshot_threshold=-1'
```

Otherwise, if you are using a managed service, use your cloud provider's
configuration mechanism to set `old_snapshot_threshold` to `-1`.

Next, you should set `wal_level` to `logical` so that the write-ahead log (WAL)
records information that is needed for logical decoding.

To check the current value of  `wal_level`, run the command:

```sh
psql -X -d $SOURCE -c 'show wal_level'
```

If the query returns something other than `logical`, you must change it.

If you have a superuser on a self-hosted database, run the following command:

```sh
psql -X -d $SOURCE -c 'alter system set wal_level=logical'
```

Otherwise, if you are using a managed service, use your cloud provider's
configuration mechanism to set `wal_level` to `logical`.

Restart your database for the changes to take effect, and verify that the
settings are reflected in your database.