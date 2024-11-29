Before you upgrade:

*   Read [the release notes][relnotes] for the version of TimescaleDB that you are upgrading to.
*   Check the version TimescaleDB you are currently running, and the version you want to upgrade to
    against the [upgrade matrix][upgrade-pg]. You may need to up 

* You might need to
    [upgrade to the latest PostgreSQL version][upgrade-pg]
    before you begin your Timescale upgrade.
*   [Perform a backup][backup] of your database. While Timescale
    upgrades are performed in-place, upgrading is an intrusive operation. Always
    make sure you have a backup on hand, and that the backup is readable in the
    case of disaster.

[relnotes]: https://github.com/timescale/timescaledb/releases
[upgrade-pg]: /self-hosted/:currentVersion:/upgrade-pg/#upgrade-your-postgresql-instance
[backup]: /self-hosted/:currentVersion:/backup-and-restore/
