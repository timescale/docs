You can upgrade your self-hosted Timescale installation in-place. This means
that you do not need to dump and restore your data. However, it is still
important that you plan for your upgrade ahead of time.

Before you upgrade:

*   Read [the release notes][relnotes] for the Timescale version you are
    upgrading to.
*   Check which PostgreSQL version you are currently running. You might need to
    [upgrade to the latest PostgreSQL version][upgrade-pg]
    before you begin your Timescale upgrade.
*   [Perform a backup][backup] of your database. While Timescale
    upgrades are performed in-place, upgrading is an intrusive operation. Always
    make sure you have a backup on hand, and that the backup is readable in the
    case of disaster.

[relnotes]: /about/:currentVersion:/release-notes/
[upgrade-pg]: /self-hosted/:currentVersion:/upgrades/upgrade-pg/
[backup]: /self-hosted/:currentVersion:/backup-and-restore/
