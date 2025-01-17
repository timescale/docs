
- Install the PostgreSQL client tools on your migration machine. This includes `psql`, and `pg_dump`.
- Read [the release notes][relnotes] for the version of TimescaleDB that you are upgrading to.
- [Perform a backup][backup] of your database. While Timescale
    upgrades are performed in-place, upgrading is an intrusive operation. Always
    make sure you have a backup on hand, and that the backup is readable in the
    case of disaster.

[relnotes]: https://github.com/timescale/timescaledb/releases
[upgrade-pg]: /self-hosted/:currentVersion:/upgrade-pg/#upgrade-your-postgresql-instance
[backup]: /self-hosted/:currentVersion:/backup-and-restore/
