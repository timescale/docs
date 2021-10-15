## apt Installation (Ubuntu) [](installation-apt-ubuntu)

This will install TimescaleDB via `pacman` on archlinux distros.

**Note: TimescaleDB requires PostgreSQL 12 or 13.**

#### Prerequisites

- archlinux X.X or later, except obsoleted versions.
Check [archlinux.org/releng/releases/][archlinux-releases] for list of
non-obsolete releases.

#### Build and install

<highlight type="warning">
TODO
</highlight>



Once you confirm and install the newest binary package, you must still perform the
EXTENSION update as discussed in [Updating Timescale to 2.0][update-tsdb-2].

#### Configure your database

There are a [variety of settings that can be configured][config] for your
new database. At a minimum, you will need to update your `postgresql.conf`
file to include `shared_preload_libraries = 'timescaledb'`.
The easiest way to get started is to run `timescaledb-tune`...

This will ensure that our extension is properly added to the parameter
`shared_preload_libraries` as well as offer suggestions for tuning memory,
parallelism, and other settings.

To get started you'll now need to restart PostgreSQL:
```bash
# Restart PostgreSQL instance
sudo service postgresql restart
```

[archlinux-releases]: https://archlinux.org/releng/releases/
[config]: /how-to-guides/configuration/
[update-tsdb-2]: /how-to-guides/update-timescaledb/update-timescaledb-2/
