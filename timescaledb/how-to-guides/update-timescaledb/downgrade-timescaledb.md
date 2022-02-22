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
The downgrade script is tested for a single-step downgrade from the current
version to the previous version. Multi-step downgrades may work but have not
been tested. Downgrading might not work if you make changes to your database
between upgrading and downgrading.