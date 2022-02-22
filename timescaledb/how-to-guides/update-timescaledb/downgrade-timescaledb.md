# Downgrade TimescaleDB versions
If you upgrade your TimescaleDB version and encounter problems, you can
immediately roll back your upgrade. To downgrade to your previous version,
connect to your database and run:
```sql
ALTER EXTENSION timescaledb UPDATE TO '<PREVIOUS_VERSION>';
```

For example:
```sql
ALTER EXTENSION timescaledb UPDATE TO '2.5.1';
```

<highlight type="important"> 
If you're connecting to your database with `psql`,
connect with the `-X` flag. This prevents any commands in `.psqlrc` from loading
another TimescaleDB version. 
</highlight>

You can verify that the downgrade worked by running `\dx timescaledb` to see the
version number of the extension.

## Limitations
Downgrading might not be supported for all versions. Where possible, downgrades
between patch versions and between consecutive minor versions are supported. For
example, you can downgrade from TimescaleDB 2.5.2 to 2.5.1, or from 2.5.0 to
2.4.2. However, some versions might not support downgrading. To check whether
you can downgrade from a specific version, see the [release
notes](https://docs.timescale.com/timescaledb/latest/overview/release-notes/).

Where supported, the downgrade script is tested for a single-step downgrade from
the current version to the previous version. Multi-step downgrades may work but
have not been tested. Downgrading might not work if you make changes to your
database between upgrading and downgrading.